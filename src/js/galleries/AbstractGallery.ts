import {debounce, defaultsDeep, pick} from 'lodash-es';

import PhotoSwipe, {PhotoSwipeOptions, SlideData} from 'photoswipe';
import PhotoSwipeLightbox from 'photoswipe/lightbox';

import 'photoswipe/dist/photoswipe.css';

import {Item, ItemActivateEventDetail, ItemOptions} from '../Item';
import {getIcon} from '../Utility';

/**
 * A map of all possible event and the structure of their details
 */
export interface CustomEventDetailMap<T> {
    activate: {model: T; clickEvent: MouseEvent};
    'item-added-to-dom': T;
    'item-displayed': T;
    pagination: {offset: number; limit: number};
    select: T[];
}

/**
 * Augment the global namespace with our custom events
 * See: https://github.com/Microsoft/TypeScript/issues/28357
 */
declare global {
    interface HTMLElementEventMap {
        activate: CustomEvent;
        'item-added-to-dom': CustomEvent;
        'item-displayed': CustomEvent;
        pagination: CustomEvent;
        select: CustomEvent;
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
    backgroundSize?: string;

    /**
     * Background position, default : center
     */
    backgroundPosition?: string;
}

export interface GalleryOptions extends ItemOptions {
    rowsPerPage?: number;
    minRowsAtStart?: number;
    infiniteScrollOffset?: number;
    photoSwipeOptions?: PhotoSwipeOptions;
    photoSwipePluginsInitFn?: ((lighbox: PhotoSwipeLightbox) => void) | null;
    ssr?: {
        /**
         * In SSR mode, if the gallery width cannot be computed, it will fallback to this value
         */
        galleryWidth: number;
    };
}

export abstract class AbstractGallery<Model extends ModelAttributes> {
    /**
     * Default options
     */
    protected options: Required<GalleryOptions> = {
        gap: 3,
        rowsPerPage: 0,
        showLabels: 'hover',
        lightbox: false,
        minRowsAtStart: 2,
        selectable: false,
        activable: false,
        infiniteScrollOffset: 0,
        photoSwipeOptions: {
            loop: false,
        },
        photoSwipePluginsInitFn: null,
        ssr: {
            galleryWidth: 480,
        },
    };

    /**
     * Images wrapper container
     * If setted, serves as mark for "initialized status" of the gallery
     */
    protected bodyElementRef: HTMLElement | null = null;

    /**
     * Items for which container has been added to dom, but image has not been queries yet
     */
    protected scrollBufferedItems: Item<Model>[] = [];

    /**
     * Debounce function
     * Runs a small delay after last image has been added to dom
     * When it runs, images are loaded (appear with fade) and more images are queries to preserve a buffer of
     * out-of-dom items
     */
    protected flushBufferedItems: () => void;

    /**
     * Number of items to query on buffer flushing
     */
    protected requiredItems = 0;

    /**
     * Used to test the scroll direction
     * Avoid to load more images when scrolling up
     */
    private old_scroll_top = 0;

    /**
     * Stores page index that have been emmited
     * Keeps a log of pages already asked to prevent to ask them multiple times
     */
    private requestedIndexesLog: number[] = [];

    /**
     * Reference to next button element
     */
    private nextButton: HTMLElement | null = null;
    protected readonly document: Document;

    /**
     * PhotoSwipe Lightbox object
     */
    protected psLightbox: PhotoSwipeLightbox | null = null;

    /**
     * Get PhotoSwipe Lightbox
     */
    get photoSwipe(): PhotoSwipeLightbox | null {
        return this.psLightbox;
    }

    /**
     * Get currently selected PhotoSwipe image
     */
    get photoSwipeCurrentItem(): Model | null {
        return this.collection[this.psLightbox?.pswp?.currIndex || 0]?.model || null;
    }

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

        // After having finished to add items to dom, show images inside containers and emit updated pagination
        this.flushBufferedItems = debounce(
            () => {
                this.scrollBufferedItems.forEach(i => {
                    i.loadImage();
                    this.dispatchEvent('item-displayed', i.model);
                });

                this.scrollBufferedItems = [];

                if (!this.requiredItems) {
                    return;
                }

                // Each time a pagination event is emitted, the offset is logged and then verified to be sure to not ask it
                // twice. That would cause duplicated entries and probably empty buffer with smaller pages. That could
                // cause infinite loading until the end of the gallery
                if (this.requestedIndexesLog.indexOf(this.collection.length) < 0) {
                    const offset = this.collection.length;
                    this.dispatchEvent('pagination', {offset, limit: this.requiredItems});
                    this.requestedIndexesLog.push(offset);
                    this.requiredItems = 0;
                }
            },
            500,
            {leading: false, trailing: true},
        );
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
     * Partial set of items that represent the visible items
     * @type {Item[]}
     * @private
     */
    protected _domCollection: Item<Model>[] = [];

    get domCollection(): Item<Model>[] {
        return this._domCollection;
    }

    get selectedItems(): Model[] {
        return this.domCollection.filter(item => item.selected).map(item => item.model);
    }

    get width(): number {
        // elementRef.clientWidth rounds ceil, we need round floor to grant computing fits in the available space
        // elementRef.getBoundingClientRect().width doesn't round, so we can round floor.
        return Math.floor(this.elementRef.getBoundingClientRect?.().width ?? this.options.ssr.galleryWidth);
    }

    get collectionLength(): number {
        return this.collection.length;
    }

    get domCollectionLength(): number {
        return this.domCollection.length;
    }

    /**
     * Initializes DOM manipulations
     */
    public init(): void {
        this.elementRef.classList.add('natural-gallery-js');

        // Next button
        this.nextButton = this.document.createElement('div');
        this.nextButton.classList.add('natural-gallery-next');
        this.nextButton.appendChild(getIcon(this.document, 'natural-gallery-icon-next'));
        this.nextButton.style.display = 'none';
        this.nextButton.addEventListener('click', e => {
            e.preventDefault();
            this.onPageAdd();
        });

        this.bodyElementRef = this.document.createElement('div');
        this.bodyElementRef.classList.add('natural-gallery-body');
        this.extendToFreeViewport();

        // Iframe
        const iframe = this.document.createElement('iframe');
        this.elementRef.appendChild(iframe);

        // Resize debounce
        const resizeDebounceDuration = 500;
        const startResize = debounce(() => this.startResize(), resizeDebounceDuration, {
            leading: true,
            trailing: false,
        });
        const endResize = debounce(() => this.endResize(), resizeDebounceDuration, {leading: false, trailing: true});
        iframe.contentWindow?.addEventListener('resize', () => {
            endResize();
            startResize();
        });

        this.elementRef.appendChild(this.bodyElementRef);
        this.elementRef.appendChild(this.nextButton);

        if (!this.options.rowsPerPage) {
            this.bindScroll(this.scrollElementRef || this.document);
        }

        this.initItems();

        if (this.options.lightbox) this.photoSwipeInit();
    }

    /**
     * Initializes PhotoSwipe
     */
    protected photoSwipeInit() {
        this.psLightbox = new PhotoSwipeLightbox({
            ...this.options.photoSwipeOptions,
            pswpModule: PhotoSwipe,
        });

        this.psLightbox.addFilter('numItems', (): number => {
            return this.domCollection.length;
            // return this.collection.length;
        });

        this.psLightbox.addFilter('itemData', (_itemData: SlideData, index: number): SlideData => {
            const item = this.collection[index];
            return {
                id: index,
                src: item.model.enlargedSrc,
                w: item.model.enlargedWidth,
                h: item.model.enlargedHeight,
                msrc: item.model.thumbnailSrc,
                element: item.element,
                thumbCropped: item.cropped,
            };
        });

        if (this.options.photoSwipePluginsInitFn) {
            this.options.photoSwipePluginsInitFn(this.psLightbox);
        }

        this.psLightbox.init();

        // Loading one more page when going to next image
        this.psLightbox.on('change', () => {
            // Positive delta means next slide.
            // If we go next slide, and current index is out of visible collection bound, load more items
            if (this.psLightbox?.pswp && this.psLightbox.pswp.currIndex > this.domCollection.length - 10) {
                this.onPageAdd();
            }
        });
    }

    public addItemToPhotoSwipeCollection(item: Item<Model>) {
        const photoSwipeId = this.domCollection.length - 1;

        item.element.addEventListener('zoom', () => {
            this.psLightbox?.loadAndOpen(photoSwipeId);
        });
    }

    /**
     * Add items to collection
     * Transform given list of models into inner Items
     * @param models list of models
     */
    public addItems(models: Model[]): void {
        // Accept only tables
        if (!(models.constructor === Array && models.length)) {
            return;
        }

        // Display newly added images if it's the first addition or if all images are already shown
        const addToDom = this.collection.length === this.domCollection.length;
        const collectionSize = this.collection.length;

        // Complete collection
        models.forEach((model: Model) => {
            const itemOptions = pick(this.options, ['lightbox', 'selectable', 'activable', 'gap', 'showLabels']);
            const item = new Item<Model>(this.document, itemOptions, model);
            this._collection.push(item);
        });

        if (addToDom && collectionSize === 0 && this.bodyElementRef) {
            // First initialization : collection size is 0
            this.onPageAdd();
        } else if (addToDom && collectionSize > 0 && this.bodyElementRef) {
            // Gallery collection completion (after first initialization) : collection size > 0
            this.onScroll();
        }
    }

    public setLabelHover(activate: boolean): void {
        this.options.showLabels = activate ? 'hover' : 'always';
        this.collection.forEach(item => {
            item.setLabelHover(activate);
        });
    }

    /**
     * Select all items visible in the DOM
     * Ignores buffered items
     */
    public selectVisibleItems(): Model[] {
        this.domCollection.forEach(item => item.select());
        return this.selectedItems;
    }

    /**
     * Unselect all selected elements
     */
    public unselectAllItems(): void {
        this.domCollection.forEach(item => item.unselect());
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

        if (name === 'pagination' && this.bodyElementRef) {
            this.requestItems();
        }
    }

    /**
     * Public api for empty function
     * Emits a pagination event
     */
    public clear(): void {
        this.empty();
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
     * If gallery already has items on initialisation, set first page visible, load second page and query for more
     * items if needed.
     * If not, just query for items
     */
    protected initItems(): void {
        if (!this.collection.length) {
            this.requestItems();
            return;
        }

        const rowsPerPage = this.getEstimatedRowsPerPage();
        const itemsPerRow = this.getEstimatedColumnsPerRow();
        const pageSize = rowsPerPage * itemsPerRow;

        // Add items
        const itemsToAdd = this.collection.slice(0, pageSize);
        this.organizeItems(itemsToAdd, 0, rowsPerPage);
        itemsToAdd.forEach(item => this.addItemToDOM(item));
        this.scrollBufferedItems = itemsToAdd;

        // Prepare second page
        const bufferedItems = this.collection.slice(this.domCollection.length);
        const missing = bufferedItems.length - pageSize;
        this.requiredItems = Math.min(missing, bufferedItems.length, 0);

        // Load images
        this.flushBufferedItems();
        this.updateNextButtonVisibility();
    }

    /**
     *
     */
    protected abstract getEstimatedColumnsPerRow(): number;

    /**
     * AbstractRowGallery + Masonry
     */
    protected abstract onScroll(): void;

    /**
     * AbstractRowGallery + Masonry
     */
    protected abstract onPageAdd(): void;

    /**
     * Return number of rows to show per page to fill the empty space until the bottom of the screen
     * Should grant all the space is used or more, but not less.
     * @returns {number}
     */
    protected abstract getEstimatedRowsPerPage(): number;

    /**
     * Fire pagination event
     * Information provided in the event allows to retrieve items from the server using given data :
     * "offset" and "limit" that have the same semantic that respective attributes in mySQL.
     *
     * The gallery asks for items it needs, including some buffer items that are not displayed when given but are
     * available to be added immediately to DOM when user scrolls.
     *
     */
    protected requestItems(): void {
        const estimatedPerRow = this.getEstimatedColumnsPerRow();

        // +1 because we have to get more than what is used under onPageAdd().
        // Without +1 all items are always added to DOM and gallery will loop load until end of collection
        const limit = estimatedPerRow * this.getRowsPerPage() + 1;
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
     * Add given item to DOM and to domCollection
     * @param {Item} item
     * @param destination
     */
    protected addItemToDOM(item: Item<Model>, destination: HTMLElement | null = this.bodyElementRef): void {
        if (!destination) {
            throw new Error('Gallery not initialized');
        }

        this.domCollection.push(item);

        destination.appendChild(item.init());

        this.scrollBufferedItems.push(item);
        this.requiredItems++;
        this.dispatchEvent('item-added-to-dom', item.model);

        // When selected / unselected
        item.element.addEventListener('select', () => {
            this.dispatchEvent(
                'select',
                this.domCollection.filter(i => i.selected).map(i => i.model),
            );
        });

        // When activate (if activate event is given in options)
        item.element.addEventListener('activate', (ev: CustomEvent<ItemActivateEventDetail<Model>>) => {
            this.dispatchEvent('activate', {model: ev.detail.item.model, clickEvent: ev.detail.clickEvent});
        });

        if (this.options.lightbox) {
            this.addItemToPhotoSwipeCollection(item);
        }
    }

    protected updateNextButtonVisibility(): void {
        if (!this.nextButton) {
            return;
        }

        if (this.domCollection.length === this.collection.length) {
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
        if (this.document.defaultView) {
            return this.document.defaultView.innerHeight - this.elementRef.offsetTop;
        }

        return 0;
    }

    protected startResize(): void {
        this.bodyElementRef?.classList.add('resizing');
    }

    protected endResize(): void {
        this.bodyElementRef?.classList.remove('resizing');
    }

    protected dispatchEvent<K extends keyof CustomEventDetailMap<Model>>(
        name: K,
        data: CustomEventDetailMap<Model>[K],
    ): void;
    protected dispatchEvent(
        name: keyof CustomEventDetailMap<Model>,
        data: CustomEventDetailMap<Model>[keyof CustomEventDetailMap<Model>],
    ): void {
        const event = new CustomEvent(name, {detail: data});
        this.elementRef.dispatchEvent(event);
    }

    /**
     * Effectively empty gallery, and should prepare container to receive new items
     */
    protected empty(): void {
        if (this.bodyElementRef) {
            this.bodyElementRef.innerHTML = '';
        }

        this.requestedIndexesLog.length = 0;
        this._domCollection = [];
        this._collection = [];
    }

    /**
     * Listen to scroll event and manages rows additions for lazy load
     * @param {HTMLElement | Document} element
     */
    private bindScroll(element: HTMLElement | Document) {
        const scrollable = element;
        const wrapper: HTMLElement = element instanceof Document ? element.documentElement : element;

        const startScroll = debounce(() => this.elementRef.classList.add('scrolling'), 300, {
            leading: true,
            trailing: false,
        });
        const endScroll = debounce(() => this.elementRef.classList.remove('scrolling'), 300, {
            leading: false,
            trailing: true,
        });

        scrollable.addEventListener('scroll', () => {
            startScroll();
            endScroll();

            const endOfGalleryAt =
                this.elementRef.offsetTop + this.elementRef.offsetHeight + this.options.infiniteScrollOffset;

            // Avoid to expand gallery if we are scrolling up
            const current_scroll_top = wrapper.scrollTop - (wrapper.clientTop || 0);
            const wrapperHeight = wrapper.clientHeight;
            const scroll_delta = current_scroll_top - this.old_scroll_top;
            this.old_scroll_top = current_scroll_top;

            // "enableMoreLoading" is a setting coming from the BE bloking / enabling dynamic loading of thumbnail
            if (scroll_delta > 0 && current_scroll_top + wrapperHeight >= endOfGalleryAt) {
                // When scrolling only add a row at once
                this.onScroll();
            }
        });
    }
}
