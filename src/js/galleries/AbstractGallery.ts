import {debounce, pick} from 'es-toolkit';
import {defaultsDeep} from 'es-toolkit/compat';
import PhotoSwipe, {PhotoSwipeOptions, SlideData} from 'photoswipe';
import PhotoSwipeLightbox from 'photoswipe/lightbox';
import 'photoswipe/dist/photoswipe.css';
import {Item, ItemActivateEventDetail, ItemOptions, LabelVisibility} from '../Item';
import {getNextIcon} from '../Utility';

export type ObjectFit = 'fill' | 'contain' | 'cover' | 'none' | 'scale-down' | 'inherit' | 'initial' | 'unset';

export type ObjectPosition =
    | 'center'
    | 'top'
    | 'bottom'
    | 'left'
    | 'right'
    | 'top left'
    | 'top right'
    | 'top center'
    | 'bottom left'
    | 'bottom right'
    | 'bottom center'
    | 'center left'
    | 'center right'
    | string;

/**
 * Items touching the viewport, even partially, in the order of the collection, and the indexes of the first and the
 * last of them in the collection. Both indexes are -1 when no item touches the viewport.
 */
export interface VisibleCollectionChange<T extends ModelAttributes> {
    items: Item<T>[];
    firstIndex: number;
    lastIndex: number;
}

/**
 * A map of all possible event and the structure of their details
 */
export interface CustomEventDetailMap<T extends ModelAttributes> {
    activate: {item: Item<T>; event: MouseEvent | KeyboardEvent};
    'item-element-created': Item<T>;
    pagination: {offset: number; limit: number};
    select: Item<T>[];
    'selection-mode-change': boolean;
    'visible-collection-change': VisibleCollectionChange<T>;
}

/**
 * Augment the global namespace with our custom events
 * See: https://github.com/Microsoft/TypeScript/issues/28357
 */
declare global {
    interface HTMLElementEventMap {
        activate: CustomEvent;
        'item-element-created': CustomEvent;
        pagination: CustomEvent;
        select: CustomEvent;
        'selection-mode-change': CustomEvent;
    }
}

export interface SizedModel {
    /**
     * Height in pixels of the enlarged version the image
     * If photoswipe is used, the size of the photoswipe enlarged image is required
     * If photoswipe is not used, any size that match the ratio is enough
     */
    enlargedWidth: number;

    /**
     * Width in pixels of the enlarged version the image
     * If photoswipe is used, the size of the photoswipe enlarged image is required
     * If photoswipe is not used, any size that match the ratio is enough
     */
    enlargedHeight: number;
}

export interface ModelAttributes extends SizedModel {
    /**
     * Source link for thumbnail image
     */
    thumbnailSrc: string;

    /**
     * Source link for enlarged (photoswipe) image
     */
    enlargedSrc?: string;

    /**
     * Label of item (or button)
     */
    title?: string;

    /**
     * Href link
     */
    link?: string;

    /**
     * a href target attribute
     */
    linkTarget?: '_blank' | '_self' | '_parent' | '_top';

    /**
     * Hex color
     */
    color?: string;

    /**
     * If item is selected
     */
    selected?: boolean;

    /**
     * Background size, default : cover
     */
    objectFit?: ObjectFit;

    /**
     * Background position, default : center
     */
    objectPosition?: ObjectPosition;

    /**
     * Short text describing specifically the image
     */
    alt?: string;
}

/**
 * Duration in milliseconds of a press that selects the pressed item, activates the selection mode, and starts the
 * selection drag
 */
const LONG_PRESS_DURATION = 500;

/**
 * Distance in pixels the pointer can move before the long press without giving the move back to the browser, which
 * scrolls on touch devices, or drags the image natively
 */
const LONG_PRESS_TOLERANCE = 5;

/**
 * Distance in pixels between two points of the pointer path where the gallery looks for an item, so that a fast
 * pointer does not skip small items
 */
const POINTER_PATH_STEP = 10;

/**
 * Height in pixels of the zones, along the top and bottom edges of the scroll viewport, where a selection drag scrolls
 * the gallery
 */
const AUTO_SCROLL_ZONE = 60;

/**
 * Scroll speed in pixels per millisecond of a selection drag at an edge of the scroll viewport
 */
const AUTO_SCROLL_MAX_SPEED = 1.5;

/**
 * Longest duration in milliseconds between two frames that the auto scroll takes into account, so that a frozen page
 * does not scroll a long way at once when it resumes
 */
const AUTO_SCROLL_MAX_FRAME_DURATION = 50;

/**
 * Drag that gives to all the items under the pointer path the selection status opposite to the one the item where the
 * drag started had
 */
interface SelectionDrag<Model extends ModelAttributes> {
    anchor: Item<Model>;
    select: boolean;
    touch: boolean;
    /**
     * Pointer position in the viewport at the last update
     */
    clientX: number;
    clientY: number;
    /**
     * Whether the drag selects, which happens after the long press, or as soon as a mouse leaves the anchor item in
     * selection mode
     */
    active: boolean;
    /**
     * The abort controller removes the document listeners of the drag
     */
    abortController: AbortController;
}

export interface GalleryOptions extends ItemOptions {
    rowsPerPage?: number;
    minRowsAtStart?: number;
    infiniteScrollOffset?: number;
    photoSwipeOptions?: PhotoSwipeOptions;
    photoSwipePluginsInitFn?: ((lighbox: PhotoSwipeLightbox) => void) | null;
    /**
     * This option enables the selection mode, and implies `selectable`. The selection mode is active as long as at least one item
     * is selected. While the selection mode is active, all checkboxes are visible, a click anywhere on an item toggles
     * its selection instead of opening the lightbox, following the link or emitting `activate`, a shift click selects
     * all the items since the last clicked item, and Escape unselects all items.
     *
     * A long press on an item selects the item, activates the selection mode, and starts a drag that gives the same
     * selection status to all the items under the pointer path. In selection mode, a mouse drag starts without the
     * long press.
     */
    selectionMode?: boolean;
    /**
     * This option enables the long press on touch devices, which replaces the long press of the system, like the
     * context menu or the preview of the image. This option requires `selectionMode`.
     */
    touchLongPress?: boolean;
    ssr?: {
        /**
         * In SSR mode, if the gallery width cannot be computed, it will fallback to this value
         */
        galleryWidth: number;
    };
}

export abstract class AbstractGallery<Model extends ModelAttributes = ModelAttributes> {
    /**
     * Default options
     */
    protected options: Required<GalleryOptions> = {
        gap: 3,
        rowsPerPage: 0,
        labelVisibility: LabelVisibility.HOVER,
        lightbox: false,
        minRowsAtStart: 2,
        selectable: false,
        activable: false,
        infiniteScrollOffset: 0,
        photoSwipeOptions: {
            loop: false,
        },
        photoSwipePluginsInitFn: null,
        selectionMode: false,
        touchLongPress: true,
        ssr: {
            galleryWidth: 480,
        },
    };

    /**
     * Images wrapper container
     */
    protected bodyElementRef: HTMLElement;

    /**
     * With rowsPerPage, number of pages shown so far
     */
    protected shownPageCount = 1;
    protected readonly document: Document;
    /**
     * PhotoSwipe Lightbox object
     */
    protected psLightbox: PhotoSwipeLightbox | null = null;
    /**
     * Used to test the scroll direction
     * Avoid to load more images when scrolling up
     */
    private old_scroll_top = 0;
    protected currentScrollTop = 0;
    protected currentViewportHeight = 0;
    /**
     * Gallery top read together with currentScrollTop. The browser changes the layout before the gallery hears about
     * a resize, so the resize anchor relies on both values as they were before the resize.
     */
    protected currentGalleryTop = 0;
    /**
     * Gallery width the items are organized for
     */
    private organizedWidth = 0;
    /**
     * Item and offset that keep the same content visible across a resize. Captured by startResize(), consumed by
     * endResize(), and discarded when the user scrolls in between.
     */
    protected resizeAnchor: {item: Item<Model>; offset: number} | null = null;
    /**
     * Stores page index that have been emitted
     * Keeps a log of pages already asked to prevent to ask them multiple times
     */
    private requestedIndexesLog: number[] = [];
    /**
     * Reference to next button element
     */
    private nextButton: HTMLElement;
    private _selectionModeActive = false;
    private readonly itemsByRootElement = new WeakMap<HTMLElement, Item<Model>>();
    private selectionDrag: SelectionDrag<Model> | null = null;
    /**
     * Last item clicked or dragged over, where the range of a shift click starts
     */
    private selectionAnchor: Item<Model> | null = null;
    /**
     * A drag ends with a click on the item under the pointer, which must not toggle that item
     */
    private suppressNextClick = false;
    /**
     * While setItemsSelected() runs, the gallery ignores the select events of the items, and setItemsSelected() emits
     * a single select event at the end
     */
    private batchingSelectionChange = false;
    /**
     * The abort controller removes the listeners that the gallery registered outside of its own DOM, and cancels the
     * debounced functions, when the gallery is destroyed
     */
    private readonly abortController = new AbortController();
    private readonly iframe: HTMLIFrameElement;

    /**
     *
     * @param elementRef
     * @param options
     * @param scrollElementRef
     */
    constructor(
        protected elementRef: HTMLElement,
        options: GalleryOptions,
        protected scrollElementRef?: HTMLElement | null,
    ) {
        this.document = this.elementRef.ownerDocument;
        this.options = defaultsDeep(options, this.options);

        if (this.options.selectionMode) {
            this.options.selectable = true;
        }

        this.elementRef.classList.add('natural-gallery-js');
        this.elementRef.classList.add(this.getFormatName());

        // Next button
        this.nextButton = this.document.createElement('button');
        this.nextButton.classList.add('natural-gallery-next');
        this.nextButton.appendChild(getNextIcon(this.document));
        this.nextButton.setAttribute('aria-label', 'next page');
        this.nextButton.style.display = 'none';
        this.nextButton.addEventListener('click', e => {
            e.preventDefault();
            this.showNextPage();
        });

        this.bodyElementRef = this.document.createElement('div');
        this.bodyElementRef.classList.add('natural-gallery-body');
        this.extendToFreeViewport();

        // Iframe
        this.iframe = this.document.createElement('iframe');
        this.elementRef.appendChild(this.iframe);

        // Resize debounce
        const signal = this.abortController.signal;
        const resizeDebounceDuration = 500;
        const startResize = debounce(() => this.startResize(), resizeDebounceDuration, {edges: ['leading'], signal});
        const onEndResize = () => {
            this.endResize();
            this.organizedWidth = this.width;
            this.readScrollPosition();
            this.updateVisibleCollection();
        };
        const endResize = debounce(onEndResize, resizeDebounceDuration, {signal});
        this.organizedWidth = this.width;
        const onResize = () => {
            // The iframe also fires a resize event when it first takes its size, without any change of width
            if (this.width === this.organizedWidth) {
                return;
            }

            endResize();
            startResize();
        };

        // The iframe window is another realm, and jsdom rejects a signal from another realm
        const contentWindow = this.iframe.contentWindow;
        if (contentWindow) {
            contentWindow.addEventListener('resize', onResize);
            signal.addEventListener('abort', () => contentWindow.removeEventListener('resize', onResize));
        }

        this.elementRef.appendChild(this.bodyElementRef);
        this.elementRef.appendChild(this.nextButton);

        this.bindScroll(this.scrollElementRef || this.document);

        this.requestItems();

        if (this.options.lightbox) {
            this.photoSwipeInit();
        }

        if (this.options.selectionMode) {
            this.bindSelectionMode();
            this.elementRef.classList.toggle('touch-long-press', this.options.touchLongPress);
        }
    }

    /**
     * Items touching the viewport, even partially, in the order of the collection. The positions come from the item
     * sizes alone, with no DOM read but the gallery top.
     */
    public abstract getVisibleCollection(): Item<Model>[];

    /**
     * Get PhotoSwipe Lightbox
     */
    /* istanbul ignore next */
    get photoSwipe(): PhotoSwipeLightbox | null {
        return this.psLightbox;
    }

    /**
     * Get currently selected PhotoSwipe image
     */
    /* istanbul ignore next */
    get photoSwipeCurrentItem(): Model | null {
        return this.collection[this.psLightbox?.pswp?.currIndex || 0]?.model || null;
    }

    /**
     * Complete collection of images
     * @type {Array}
     */
    protected _collection: Item<Model>[] = [];

    get collection(): Item<Model>[] {
        return this._collection;
    }

    /**
     * Last items touching the viewport, as emitted by visible-collection-change
     */
    private lastVisibleCollection: Item<Model>[] = [];

    get selectedItems(): Item<Model>[] {
        return this.collection.filter(item => item.selected);
    }

    get selectionModeActive(): boolean {
        return this._selectionModeActive;
    }

    get width(): number {
        // elementRef.clientWidth rounds ceil, we need round floor to grant computing fits in the available space
        // elementRef.getBoundingClientRect().width doesn't round, so we can round floor.
        return Math.floor(this.elementRef.getBoundingClientRect?.().width ?? this.options.ssr.galleryWidth);
    }

    public addItemToPhotoSwipeCollection(item: Item<Model>) {
        /* istanbul ignore next */
        item.rootElement?.addEventListener('zoom', () => {
            this.psLightbox?.loadAndOpen(this.collection.indexOf(item));
        });
    }

    /**
     * Add items to collection
     * Transform given list of models into inner Items
     * @param models list of models
     */
    public addItems(models: Model[]): void {
        const firstNewIndex = this.collection.length;

        // Complete collection
        models.forEach((model: Model) => {
            const itemOptions = pick(this.options, ['lightbox', 'selectable', 'activable', 'gap', 'labelVisibility']);
            const item = new Item<Model>(this.document, itemOptions, model);
            this._collection.push(item);
        });

        // Every received item is laid out at once, so the scrollbar covers all of them
        this.readScrollPosition();
        this.computeNewItemsSizes(firstNewIndex);
        this.mountAroundViewport();
        this.updateNextButtonVisibility();

        if (this.options.selectionMode && models.some(model => model.selected)) {
            this.applySelectionMode(true);
        }

        this.requestNextPageWhenNeeded();
        this.updateVisibleCollection();
    }

    public setLabelHover(activate: boolean): void {
        this.options.labelVisibility = activate ? LabelVisibility.HOVER : LabelVisibility.ALWAYS;
        this.collection.forEach(item => {
            item.setLabelHover(activate);
        });
    }

    /**
     * Select all items given to the gallery, whenever they are in the DOM or not
     */
    public selectCollection(): Item<Model>[] {
        return this.selectItems(this.collection);
    }

    private selectItems(collection: Item<Model>[]): Item<Model>[] {
        if (!this.options.selectable) {
            throw Error('Gallery is not selectable');
        }

        this.setItemsSelected(collection, true);
        return this.selectedItems;
    }

    /**
     * Unselect all selected elements
     */
    public unselectAllItems(): void {
        this.setItemsSelected(this.selectedItems, false);
    }

    /**
     * The selection mode takes the given state. Deactivating the selection mode unselects all items.
     */
    public setSelectionModeActive(active: boolean): void {
        if (!this.options.selectionMode) {
            throw Error('Gallery has no selection mode');
        }

        if (!active) {
            this.endSelectionDrag();
            this.unselectAllItems();
        }

        this.applySelectionMode(active);
    }

    /**
     * Scroll so that the given item becomes visible.
     *
     * Does nothing if the item is not laid out yet.
     *
     * Note: `behavior: 'smooth'` can visibly conflict with virtual scroll mounting/unmounting items while the
     * animation runs; prefer the default 'auto' (instant) unless you know your use case doesn't scroll through
     * a large virtualized range.
     */
    public scrollToItem(item: Item<Model>, options?: {behavior?: ScrollBehavior}): void {
        const top = this.getItemTop(item);
        if (top === null) {
            return;
        }

        this.applyScrollPosition(top, options?.behavior);
    }

    /**
     * Remove the gallery from the host element, which can then receive a new gallery. The gallery stops listening to
     * the scroll container, to the document and to the resizes, cancels its pending timers, ends the selection drag,
     * and destroys the PhotoSwipe lightbox.
     */
    public destroy(): void {
        if (this.abortController.signal.aborted) {
            return;
        }

        this.endSelectionDrag();
        this.abortController.abort();
        this.psLightbox?.destroy();
        this.psLightbox = null;

        this.iframe.remove();
        this.bodyElementRef.remove();
        this.nextButton.remove();
        this.elementRef.classList.remove(
            'natural-gallery-js',
            this.getFormatName(),
            'selection-mode',
            'touch-long-press',
            'scrolling',
        );
        this.elementRef.style.removeProperty('min-height');
    }

    /**
     * Allows to use the same approach and method name to listen as gallery events on DOM or on javascript gallery
     * object
     *
     * Gallery requests items when it's instantiated. But user may subscribe after creation, so we need to request
     * again if user subscribes by this function.
     *
     * @param name
     * @param callback
     * @param options An object that specifies characteristics about the event listener. The available options are, see
     *     addEventListener official documentation
     */
    public addEventListener<K extends keyof CustomEventDetailMap<Model>>(
        name: K,
        callback: (evt: CustomEvent<CustomEventDetailMap<Model>[K]>) => void,
        options?: boolean | AddEventListenerOptions,
    ): void;

    public addEventListener(
        name: keyof CustomEventDetailMap<Model>,
        callback: (evt: CustomEvent<CustomEventDetailMap<Model>[keyof CustomEventDetailMap<Model>]>) => void,
        options?: boolean | AddEventListenerOptions,
    ): void {
        this.elementRef.addEventListener(name, callback, options);

        if (name === 'pagination') {
            this.requestItems();
        }
    }

    /**
     * Public api for empty function
     * Emits a pagination event
     */
    public clear(): void {
        this.empty();
        this.updateVisibleCollection();
        this.requestItems();
    }

    /**
     * Return copy of options to prevent modification
     */
    public getOptions(): GalleryOptions {
        return this.options;
    }

    /**
     * Override current collection
     * @param {Item[]} items
     */
    public setItems(items: Model[]): void {
        this.empty();
        this.addItems(items);
    }

    /**
     *
     */
    public abstract organizeItems(items: Item<Model>[], fromRow?: number, toRow?: number): void;

    /**
     * Initializes PhotoSwipe
     */
    protected photoSwipeInit() {
        this.psLightbox = new PhotoSwipeLightbox({
            ...this.options.photoSwipeOptions,
            pswpModule: PhotoSwipe,
        });

        /* istanbul ignore next */
        this.psLightbox.addFilter('numItems', (): number => {
            return this.getShownItemCount();
        });

        /* istanbul ignore next */
        this.psLightbox.addFilter('itemData', (_itemData: SlideData, index: number): SlideData => {
            const item = this.collection[index];
            return {
                id: index,
                src: item.model.enlargedSrc,
                w: item.model.enlargedWidth,
                h: item.model.enlargedHeight,
                msrc: item.model.thumbnailSrc,
                element: item.rootElement!,
                thumbCropped: item.cropped,
                alt: item.sanitizedTitle,
                item,
            };
        });

        /* istanbul ignore next */
        if (this.options.photoSwipePluginsInitFn) {
            this.options.photoSwipePluginsInitFn(this.psLightbox);
        }

        this.psLightbox.init();

        // Loading one more page when going to next image
        /* istanbul ignore next */
        this.psLightbox.on('change', () => {
            // Positive delta means next slide.
            // If we go next slide, and current index is out of visible collection bound, load more items
            if (this.psLightbox?.pswp && this.psLightbox.pswp.currIndex > this.getShownItemCount() - 10) {
                if (this.options.rowsPerPage) {
                    this.showNextPage();
                } else {
                    this.requestNextPage();
                }
            }
        });

        // With accessibility :focus usage, figures tend to stay sticky on focused state. This returns to wanted behavior
        /* istanbul ignore next */
        this.psLightbox.on('destroy', () => {
            (this.document.activeElement as HTMLElement)?.blur();
        });
    }

    /**
     *
     */
    protected abstract getEstimatedColumnsPerRow(): number;

    protected abstract getFormatName(): string;

    protected abstract onVirtualScroll(): void;

    /**
     * Compute the size and the position of the items from the given index to the end of the collection
     */
    protected abstract computeNewItemsSizes(firstNewIndex: number): void;

    /**
     * Mount the items to show, according to the virtual scroll, or to the pages shown so far with rowsPerPage
     */
    protected abstract mountAroundViewport(): void;

    /**
     * Number of items at the start of the collection that the gallery shows. With infinite scroll, every item of
     * the collection is shown. With rowsPerPage, only the items of the pages shown so far.
     */
    protected abstract getShownItemCount(): number;

    /**
     * Height of every item of the collection, computed from the item sizes alone, with no DOM read
     */
    protected abstract getContentHeight(): number;

    /**
     * Return number of rows to show per page to fill the empty space until the bottom of the screen
     * Should grant all the space is used or more, but not less.
     * @returns {number}
     */
    protected abstract getEstimatedRowsPerPage(): number;

    /**
     * Absolute top offset (relative to the scroll container) of given item, or null if it's not part of the
     * collection. Used by scrollToItem() and by resize scroll-anchoring. The gallery top defaults to the current one.
     */
    protected abstract getItemTop(item: Item<Model>, galleryTop?: number): number | null;

    /**
     * Apply a scroll position on the gallery's scroll container (custom scrollElementRef, or the window itself —
     * the counterpart of bindScroll() listening on `this.document` when no scrollElementRef is given)
     */
    /**
     * Top offset of the gallery in the scroll container coordinates, the same coordinates as currentScrollTop.
     * elementRef.offsetTop cannot be used: it is relative to the offset parent, and differs from the scroll container
     * coordinates as soon as a positioned ancestor is offset.
     */
    protected getGalleryTop(): number {
        const galleryTop = this.elementRef.getBoundingClientRect().top;
        if (this.scrollElementRef) {
            return (
                galleryTop -
                this.scrollElementRef.getBoundingClientRect().top -
                this.scrollElementRef.clientTop +
                this.scrollElementRef.scrollTop
            );
        }

        return galleryTop + this.document.documentElement.scrollTop;
    }

    protected applyScrollPosition(top: number, behavior: ScrollBehavior = 'auto'): void {
        const clampedTop = Math.max(0, top);
        if (this.scrollElementRef) {
            this.scrollElementRef.scrollTo({top: clampedTop, behavior});
        } else {
            this.document.defaultView?.scrollTo({top: clampedTop, behavior});
        }
    }

    /**
     * Fire pagination event
     * Information provided in the event allows to retrieve items from the server using given data :
     * "offset" and "limit" that have the same semantic that respective attributes in mySQL.
     *
     * The gallery asks for one page of items
     *
     */
    protected requestItems(): void {
        const limit = this.getEstimatedColumnsPerRow() * this.getRowsPerPage();
        this.dispatchEvent('pagination', {offset: this.collection.length, limit: limit});
    }

    /**
     * Returns option.rowsPerPage is specified.
     * If not returns the estimated number of rows to fill the rest of the vertical space in the screen
     * @returns {number}
     */
    protected getRowsPerPage(): number {
        if (this.options.rowsPerPage > 0) {
            return this.options.rowsPerPage;
        }

        const estimation = this.getEstimatedRowsPerPage();
        return estimation < this.options.minRowsAtStart ? this.options.minRowsAtStart : estimation;
    }

    /**
     * Root element of given item, created the first time the item is mounted. The image starts loading as soon as
     * the root element exists, so items far from the viewport keep no root element until they come close to it.
     */
    protected mountItem(item: Item<Model>): HTMLElement {
        if (item.rootElement) {
            return item.rootElement;
        }

        const rootElement = item.init();
        this.itemsByRootElement.set(rootElement, item);

        this.dispatchEvent('item-element-created', item);

        item.rootElement?.addEventListener('select', () => this.onSelectionChange());

        // When activate (if activate event is given in options)
        item.rootElement?.addEventListener('activate', (ev: CustomEvent<ItemActivateEventDetail<Model>>) => {
            this.dispatchEvent('activate', {item, event: ev.detail.event});
        });

        if (this.options.lightbox) {
            this.addItemToPhotoSwipeCollection(item);
        }

        return rootElement;
    }

    /**
     * Ask for the next page before the user runs out of items. With rowsPerPage, when less than one page of items
     * remains hidden. With infinite scroll, when the viewport comes within one viewport height of the end of the
     * gallery.
     */
    protected requestNextPageWhenNeeded(): void {
        if (this.options.rowsPerPage) {
            const hiddenCount = this.collection.length - this.getShownItemCount();
            if (hiddenCount < this.getEstimatedColumnsPerRow() * this.options.rowsPerPage) {
                this.requestNextPage();
            }

            return;
        }

        // A gallery that is not visible would ask for pages forever, since its content never grows
        if (this.currentViewportHeight <= 0 || this.width <= 0) {
            return;
        }

        const endOfGalleryAt = this.getGalleryTop() + this.getContentHeight() + this.options.infiniteScrollOffset;
        if (this.currentScrollTop + 2 * this.currentViewportHeight >= endOfGalleryAt) {
            this.requestNextPage();
        }
    }

    /**
     * Emit visible-collection-change when the items touching the viewport differ from the last emitted ones
     */
    protected updateVisibleCollection(): void {
        const items = this.getVisibleCollection();
        const previous = this.lastVisibleCollection;
        if (items.length === previous.length && items.every((item, i) => item === previous[i])) {
            return;
        }

        this.lastVisibleCollection = items;
        this.dispatchEvent('visible-collection-change', {
            items,
            firstIndex: items.length ? this.collection.indexOf(items[0]) : -1,
            lastIndex: items.length ? this.collection.indexOf(items[items.length - 1]) : -1,
        });
    }

    /**
     * Ask for the items that follow the collection, once per offset
     */
    protected requestNextPage(): void {
        const offset = this.collection.length;
        if (this.requestedIndexesLog.indexOf(offset) >= 0) {
            return;
        }

        this.requestedIndexesLog.push(offset);
        const limit = this.getEstimatedColumnsPerRow() * this.getRowsPerPage();
        this.dispatchEvent('pagination', {offset, limit});
    }

    /**
     * With rowsPerPage, show one more page
     */
    protected showNextPage(): void {
        this.shownPageCount++;
        this.mountAroundViewport();
        this.updateNextButtonVisibility();
        this.requestNextPageWhenNeeded();
        this.updateVisibleCollection();
    }

    protected updateNextButtonVisibility(): void {
        if (this.getShownItemCount() === this.collection.length) {
            this.nextButton.style.display = 'none';
        } else {
            this.nextButton.style.display = 'block';
        }
    }

    /**
     * If infinite scroll (no option.rowsPerPage provided), a minimum height is setted to force gallery to overflow
     * from viewport. This activates the scroll before adding items to dom. This prevents the scroll to fire new resize
     * event and recompute all gallery twice on start.
     */
    protected extendToFreeViewport(): void {
        if (this.options.rowsPerPage) {
            return;
        }

        this.elementRef.style.minHeight = this.getGalleryVisibleHeight() + 10 + 'px';
    }

    /**
     * Space between the top of the gallery wrapper (parent of gallery root elementRef) and the bottom of the window
     */
    protected getGalleryVisibleHeight(): number {
        /* istanbul ignore else */
        if (this.document.defaultView) {
            return this.document.defaultView.innerHeight - this.elementRef.offsetTop;
        }

        /* istanbul ignore next */
        return 0;
    }

    /**
     * The anchor is captured once, at the first resize event. Between two resize events, the browser already
     * rearranges the items at their old sizes and moves the scroll position, so an anchor captured later would no
     * longer match the computed positions.
     */
    protected startResize(): void {
        this.captureResizeAnchor();
        this.bodyElementRef?.classList.add('resizing');
    }

    /**
     * Capture whatever scroll-position anchor a subclass needs in order to keep the same content visible across a
     * resize. No-op by default.
     */
    /* istanbul ignore next */
    protected captureResizeAnchor(): void {
        // no-op by default
    }

    protected endResize(): void {
        this.bodyElementRef?.classList.remove('resizing');
    }

    protected dispatchEvent<K extends keyof CustomEventDetailMap<Model>>(
        name: K,
        data: CustomEventDetailMap<Model>[K],
    ): void {
        try {
            const event = new CustomEvent(name, {detail: data});
            this.elementRef.dispatchEvent(event);
        } catch {
            // silent fail
        }
    }

    /**
     * Effectively empty gallery, and should prepare container to receive new items
     */
    protected empty(): void {
        this.bodyElementRef.innerHTML = '';
        this.requestedIndexesLog.length = 0;
        this.shownPageCount = 1;
        this._collection = [];
        this.endSelectionDrag();
        this.selectionAnchor = null;

        if (this.options.selectionMode) {
            this.applySelectionMode(false);
        }
    }

    private onSelectionChange(): void {
        if (this.batchingSelectionChange) {
            return;
        }

        const selectedItems = this.selectedItems;
        this.dispatchEvent('select', selectedItems);

        if (this.options.selectionMode) {
            this.applySelectionMode(selectedItems.length > 0);
        }
    }

    /**
     * The given items take the given selection status, and the gallery emits a single select event when at least one
     * item changed. An item that is not in the DOM yet has no root element to emit its own select event, so the gallery
     * counts the changed items itself.
     */
    private setItemsSelected(items: Item<Model>[], selected: boolean): void {
        const changedItems = items.filter(item => item.selected !== selected);

        this.batchingSelectionChange = true;
        changedItems.forEach(item => {
            if (selected) {
                item.select();
            } else {
                item.unselect();
            }
        });
        this.batchingSelectionChange = false;

        if (changedItems.length) {
            this.onSelectionChange();
        }
    }

    private applySelectionMode(active: boolean): void {
        if (this._selectionModeActive === active) {
            return;
        }

        this._selectionModeActive = active;
        this.elementRef.classList.toggle('selection-mode', active);
        this.dispatchEvent('selection-mode-change', active);
    }

    /**
     * Escape leaves the selection mode, unless the gallery is out of the document, or Escape belongs to an editable
     * field or to a dialog. The document listens to Escape until destroy(). A gallery out of the document, for example
     * in a view that is hidden and shown again, leaves Escape to the rest of the page.
     */
    private onEscape(event: KeyboardEvent): void {
        const target = event.target as HTMLElement | null;
        if (
            !this._selectionModeActive ||
            event.key !== 'Escape' ||
            event.defaultPrevented ||
            !this.elementRef.isConnected ||
            target?.isContentEditable ||
            target?.closest?.('input, textarea, select, dialog')
        ) {
            return;
        }

        this.setSelectionModeActive(false);
    }

    /**
     * While the selection mode is active, the gallery takes over clicks and Enter or Space keys on items, before the
     * item elements receive them. The checkbox keeps its own behavior.
     */
    private bindSelectionMode(): void {
        this.document.addEventListener('keydown', event => this.onEscape(event), {signal: this.abortController.signal});

        this.bodyElementRef.addEventListener(
            'click',
            event => {
                if (this.suppressNextClick) {
                    this.suppressNextClick = false;
                    event.preventDefault();
                    event.stopPropagation();
                    return;
                }

                const target = event.target as HTMLElement;
                const item = this.getItem(target);
                const checkbox = !!target.closest('.select-btn');
                if (!item || (!this._selectionModeActive && !checkbox)) {
                    return;
                }

                const anchor = this.selectionAnchor;
                this.selectionAnchor = item;

                if (event.shiftKey && anchor && this._selectionModeActive) {
                    event.preventDefault();
                    event.stopPropagation();
                    this.selectRange(anchor, item, !item.selected);
                } else if (!checkbox) {
                    event.preventDefault();
                    event.stopPropagation();
                    item.toggleSelect();
                }
            },
            {capture: true},
        );

        this.bodyElementRef.addEventListener(
            'keydown',
            event => {
                // A click that follows a key press comes from the keyboard, and not from the end of a drag
                this.suppressNextClick = false;

                if (event.key !== 'Enter' && event.key !== ' ') {
                    return;
                }

                const item = this.getSelectionModeItem(event);
                if (!item) {
                    return;
                }

                event.stopPropagation();

                // A button emits a click on Enter or Space, a link only on Enter, and the click listener toggles the
                // selection
                const target = event.target as HTMLElement;
                if (target.closest('button') || (event.key === 'Enter' && target.closest('a'))) {
                    return;
                }

                event.preventDefault();
                this.selectionAnchor = item;
                item.toggleSelect();
            },
            {capture: true},
        );

        this.bodyElementRef.addEventListener('pointerdown', event => this.startSelectionDrag(event));

        // The browser would otherwise drag the image or the link itself, and cancel the selection drag
        this.bodyElementRef.addEventListener('dragstart', event => {
            if (this._selectionModeActive) {
                event.preventDefault();
            }
        });

        // On touch devices, the long press of the system opens a context menu. With a mouse, the context menu catches
        // the pointerup, for example after a ctrl click on macOS, so the drag ends when the context menu opens.
        this.bodyElementRef.addEventListener('contextmenu', event => {
            if (this.selectionDrag?.touch) {
                event.preventDefault();
            } else {
                this.endSelectionDrag();
            }
        });
    }

    /**
     * The selection drag starts with a long press, or with a mouse or pen drag in selection mode. Before the long press,
     * a touch drag scrolls.
     */
    private startSelectionDrag(event: PointerEvent): void {
        // A new press ends the drag of the previous press, for example when a second finger touches the screen
        this.endSelectionDrag();
        this.suppressNextClick = false;
        const touch = event.pointerType === 'touch';
        if (event.button !== 0 || (touch && !this.options.touchLongPress)) {
            return;
        }

        const item = this.getItem(event.target as HTMLElement);
        if (!item) {
            return;
        }

        const drag: SelectionDrag<Model> = {
            anchor: item,
            select: !item.selected,
            touch,
            clientX: event.clientX,
            clientY: event.clientY,
            active: false,
            abortController: new AbortController(),
        };
        this.selectionDrag = drag;
        const signal = drag.abortController.signal;

        // The style reveals the selection, or the deselection, progressively until the long press changes the item
        item.rootElement?.classList.add('long-pressing');

        // Near an edge of the scroll viewport, the gallery scrolls on each frame
        let autoScrollFrame = 0;
        const autoScroll = (previousTime: number | null) => (time: number) => {
            const speed = this.getAutoScrollSpeed(drag.clientY);
            if (!speed) {
                autoScrollFrame = 0;
                return;
            }

            if (previousTime !== null) {
                this.scrollBy(speed * Math.min(time - previousTime, AUTO_SCROLL_MAX_FRAME_DURATION));
            }

            autoScrollFrame = requestAnimationFrame(autoScroll(time));
        };
        const startAutoScroll = () => {
            if (drag.active && !autoScrollFrame) {
                autoScrollFrame = requestAnimationFrame(autoScroll(null));
            }
        };
        signal.addEventListener('abort', () => cancelAnimationFrame(autoScrollFrame));

        const longPress = setTimeout(() => {
            this.paintSelectionDrag(drag, []);
            startAutoScroll();
        }, LONG_PRESS_DURATION);
        signal.addEventListener('abort', () => clearTimeout(longPress));

        const waitsForLongPress = () => !drag.active && (drag.touch || !this._selectionModeActive);

        // Only the pointer moves select, the scroll moves items under the pointer without selecting them
        this.document.addEventListener(
            'pointermove',
            moveEvent => {
                const distance = Math.hypot(moveEvent.clientX - event.clientX, moveEvent.clientY - event.clientY);
                if (waitsForLongPress() && distance > LONG_PRESS_TOLERANCE) {
                    this.endSelectionDrag();
                    return;
                }

                const items = this.getItemsOnPointerPath(drag, moveEvent.clientX, moveEvent.clientY);
                if (drag.active || (!waitsForLongPress() && items.some(other => other !== drag.anchor))) {
                    this.paintSelectionDrag(drag, items);
                }

                startAutoScroll();
            },
            {signal},
        );

        // After the long press, a touch drag selects instead of scrolling. The touch events keep the pressed element as
        // target, and stop reaching the document once the virtual scroll removes the pressed element from the document.
        const preventTouchScroll = (touchEvent: TouchEvent) => {
            if (drag.active) {
                touchEvent.preventDefault();
            }
        };
        this.document.addEventListener('touchmove', preventTouchScroll, {signal, passive: false});
        (event.target as HTMLElement).addEventListener('touchmove', preventTouchScroll, {signal, passive: false});

        this.document.addEventListener(
            'pointerup',
            () => {
                this.endSelectionDrag();
                this.suppressNextClick = drag.active;
            },
            {signal},
        );

        this.document.addEventListener('pointercancel', () => this.endSelectionDrag(), {signal});
    }

    private endSelectionDrag(): void {
        this.selectionDrag?.anchor.rootElement?.classList.remove('long-pressing');
        this.selectionDrag?.abortController.abort();
        this.selectionDrag = null;
        this.elementRef.classList.remove('selection-dragging');
    }

    /**
     * Visible part of the scroll container, in the viewport
     */
    private getScrollViewport(): {top: number; bottom: number} {
        if (this.scrollElementRef) {
            const {top, bottom} = this.scrollElementRef.getBoundingClientRect();
            return {top, bottom};
        }

        return {top: 0, bottom: this.document.documentElement.clientHeight};
    }

    /**
     * The instant behavior ignores a smooth scroll-behavior of the page, which would restart its animation on each frame
     */
    private scrollBy(top: number): void {
        const options: ScrollToOptions = {top, behavior: 'instant'};
        if (this.scrollElementRef) {
            this.scrollElementRef.scrollBy(options);
        } else {
            this.document.defaultView?.scrollBy(options);
        }
    }

    /**
     * Scroll speed in pixels per millisecond of a selection drag, negative upward. The speed grows as the pointer gets
     * closer to an edge of the scroll viewport, and is maximal beyond the edge.
     */
    private getAutoScrollSpeed(clientY: number): number {
        const viewport = this.getScrollViewport();
        const zone = Math.min(AUTO_SCROLL_ZONE, (viewport.bottom - viewport.top) / 4);
        const topIntrusion = zone - (clientY - viewport.top);
        const bottomIntrusion = zone - (viewport.bottom - clientY);

        if (topIntrusion > 0) {
            return -AUTO_SCROLL_MAX_SPEED * Math.min(1, topIntrusion / zone);
        } else if (bottomIntrusion > 0) {
            return AUTO_SCROLL_MAX_SPEED * Math.min(1, bottomIntrusion / zone);
        }

        return 0;
    }

    /**
     * Items under the pointer path since the last update, in the order of the path
     */
    private getItemsOnPointerPath(drag: SelectionDrag<Model>, clientX: number, clientY: number): Item<Model>[] {
        const fromX = drag.clientX;
        const fromY = drag.clientY;
        drag.clientX = clientX;
        drag.clientY = clientY;

        const steps = Math.max(1, Math.ceil(Math.hypot(clientX - fromX, clientY - fromY) / POINTER_PATH_STEP));
        const items: Item<Model>[] = [];
        for (let step = 1; step <= steps; step++) {
            const element = this.document.elementFromPoint(
                fromX + ((clientX - fromX) * step) / steps,
                fromY + ((clientY - fromY) * step) / steps,
            );
            const item = element ? this.getItem(element) : undefined;
            if (item && !items.includes(item)) {
                items.push(item);
            }
        }

        return items;
    }

    /**
     * The first paint activates the drag and includes the anchor item
     */
    private paintSelectionDrag(drag: SelectionDrag<Model>, items: Item<Model>[]): void {
        if (!drag.active) {
            drag.active = true;
            drag.anchor.rootElement?.classList.remove('long-pressing');
            this.elementRef.classList.add('selection-dragging');
            items = [drag.anchor, ...items];
        }

        this.setItemsSelected(items, drag.select);

        if (items.length) {
            this.selectionAnchor = items[items.length - 1];
        }
    }

    /**
     * All the items between the two given items, in the collection order, take the given selection status
     */
    private selectRange(from: Item<Model>, to: Item<Model>, selected: boolean): void {
        const fromIndex = this.collection.indexOf(from);
        const toIndex = this.collection.indexOf(to);
        const items = this.collection.slice(Math.min(fromIndex, toIndex), Math.max(fromIndex, toIndex) + 1);

        this.setItemsSelected(items, selected);
    }

    private getSelectionModeItem(event: Event): Item<Model> | undefined {
        const target = event.target as HTMLElement | null;
        if (!this._selectionModeActive || !target?.closest || target.closest('.select-btn')) {
            return undefined;
        }

        return this.getItem(target);
    }

    private getItem(element: Element): Item<Model> | undefined {
        const rootElement = element.closest<HTMLElement>('.root');

        return rootElement ? this.itemsByRootElement.get(rootElement) : undefined;
    }

    /**
     * Listen to scroll event and manages rows additions for lazy load
     * @param {HTMLElement | Document} element
     */
    private bindScroll(element: HTMLElement | Document) {
        const scrollable = element;

        const signal = this.abortController.signal;
        const startScroll = debounce(() => this.elementRef.classList.add('scrolling'), 300, {
            edges: ['leading'],
            signal,
        });
        const endScroll = debounce(() => this.elementRef.classList.remove('scrolling'), 300, {signal});

        // A scroll started by the user during the resize debounce takes precedence over the anchor captured before it
        const discardResizeAnchor = () => (this.resizeAnchor = null);
        for (const eventName of ['wheel', 'touchstart', 'keydown', 'pointerdown']) {
            scrollable.addEventListener(eventName, discardResizeAnchor, {passive: true, signal});
        }

        const onScrollEvent = () => {
            startScroll();
            endScroll();

            this.readScrollPosition();
            const scroll_delta = this.currentScrollTop - this.old_scroll_top;
            this.old_scroll_top = this.currentScrollTop;

            if (!this.options.rowsPerPage) {
                this.onVirtualScroll();

                // Avoid to expand gallery if we are scrolling up
                if (scroll_delta > 0) {
                    this.requestNextPageWhenNeeded();
                }
            }

            this.updateVisibleCollection();
        };
        scrollable.addEventListener('scroll', onScrollEvent, {signal});
    }

    /**
     * Read the scroll position and the viewport height of the scroll container (custom scrollElementRef, or the
     * window itself). A hidden scroll container has no height, so the window height stands in for it. The viewport
     * height stays unknown (0) during server side rendering.
     */
    private readScrollPosition(): void {
        const wrapper = this.scrollElementRef ?? this.document.documentElement;
        this.currentScrollTop = (wrapper.scrollTop || 0) - (wrapper.clientTop || 0);
        this.currentViewportHeight = wrapper.clientHeight || this.document.defaultView?.innerHeight || 0;
        if (this.currentViewportHeight > 0) {
            this.currentGalleryTop = this.getGalleryTop();
        }
    }

    get rootElement(): HTMLElement {
        return this.elementRef;
    }

    get bodyElement(): HTMLElement {
        return this.bodyElementRef;
    }
}
