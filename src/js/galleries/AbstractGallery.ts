import debounce from 'lodash/debounce';
import defaults from 'lodash/defaults';
import pick from 'lodash/pick';
import PhotoSwipe from 'photoswipe';
import PhotoSwipeUI_Default from 'photoswipe/dist/photoswipe-ui-default';
import { Item, ItemOptions } from '../Item';
import { getIcon } from '../Utility';

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
}

export interface GalleryOptions extends ItemOptions {
    rowsPerPage?: number;
    minRowsAtStart?: number;
    infiniteScrollOffset?: number;
    photoSwipeOptions?: PhotoSwipeOptions;
}

export interface PhotoSwipeOptions {
    getThumbBoundsFn?: (index?: number) => void;
    showHideOpacity?: boolean;
    showAnimationDuration?: number;
    hideAnimationDuration?: number;
    bgOpacity?: number;
    spacing?: number;
    allowPanToNext?: boolean;
    maxSpreadZoom?: number;
    getDoubleTapZoom?: (isMouseClick?: boolean, item?: any) => number;
    pinchToClose?: boolean;
    closeOnScroll?: boolean;
    closeOnVerticalDrag?: boolean;
    mouseUsed?: boolean;
    escKey?: boolean;
    arrowKeys?: boolean;
    history?: boolean;
    galleryUID?: number;
    galleryPIDs?: boolean;
    errorMsg?: string;
    preload?: [number, number];
    mainClass?: string;
    getNumItemsFn?: () => number;
    focus?: boolean;
    modal?: boolean;
    verticalDragRange?: number;
    mainScrollEndFriction?: number;
    panEndFriction?: number;
    isClickableElement?: (el) => boolean;
    scaleMode?: string;
}

export interface InnerPhotoSwipeOptions extends PhotoSwipeOptions {
    index: number;
    loop: boolean;
}

export interface PhotoswipeItem {
    src: string;
    w: number;
    h: number;
    title?: string;
}

export abstract class AbstractGallery<Model extends ModelAttributes = any> {

    /**
     * Default options
     */
    protected options: GalleryOptions = {
        gap: 3,
        rowsPerPage: 0,
        showLabels: 'hover',
        lightbox: false,
        minRowsAtStart: 2,
        selectable: false,
        activable: false,
        infiniteScrollOffset: 0,
        photoSwipeOptions: null,
        cover: true,
    };

    protected photoswipeDefaultOptions: PhotoSwipeOptions = {
        bgOpacity: 0.85,
        showHideOpacity: false,
    };

    /**
     * Images wrapper container
     * If setted, serves as mark for "initialized status" of the gallery
     */
    protected bodyElementRef: HTMLElement;

    /**
     * Items for which container has been added to dom, but image has not been queries yet
     */
    protected scrollBufferedItems = [];

    /**
     * Debounce function
     * Runs a small delay after last image has been added to dom
     * When it runs, images are loaded (appear with fade) and more images are queries to preserve a buffer of out-of-dom items
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
     * Photoswipe images container
     * @type {Array}
     */
    private photoswipeCollection: PhotoswipeItem[] = [];

    /**
     * Reference to next button element
     */
    private nextButton: HTMLElement;

    /**
     *
     * @param elementRef
     * @param options
     * @param photoswipeElementRef
     * @param scrollElementRef
     */
    constructor(protected elementRef: HTMLElement,
                options: GalleryOptions,
                protected photoswipeElementRef?: HTMLElement,
                protected scrollElementRef?: HTMLElement) {

        this.options = defaults(options, this.options);

        if (this.options.lightbox && !this.photoswipeElementRef) {
            console.error('Lightbox option is set to true, but no PhotoSwipe reference is given');
        }

        // After having finished to add items to dom, show images inside containers and emit updated pagination
        this.flushBufferedItems = debounce(() => {

            this.scrollBufferedItems.forEach(i => {
                i.loadImage();
                this.dispatchEvent('item-displayed', i.model);
            });

            this.scrollBufferedItems = [];

            if (this.requiredItems) {
                this.dispatchEvent('pagination', {offset: this.collection.length, limit: this.requiredItems});
                this.requiredItems = 0;
            }

        }, 500, {leading: false, trailing: true});

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
    protected _visibleCollection: Item<Model>[] = [];

    get visibleCollection(): Item<Model>[] {
        return this._visibleCollection;
    }

    get selectedItems(): Model[] {
        return this.visibleCollection.filter((item) => item.selected).map(item => item.model);
    }

    get width(): number {

        // elementRef.clientWidth rounds ceil, we need round floor to grant computing fits in the available space
        // elementRef.getBoundingClientRect().width doesn't round, so we can round floor.
        return Math.floor(this.elementRef.getBoundingClientRect().width);
    }

    get collectionLength(): number {
        return this.collection.length;
    }

    get visibleCollectionLength(): number {
        return this.visibleCollection.length;
    }

    /**
     * Initializes DOM manipulations
     */
    public init(): void {

        this.elementRef.classList.add('natural-gallery-js');

        // Next button
        this.nextButton = document.createElement('div');
        this.nextButton.classList.add('natural-gallery-next');
        this.nextButton.appendChild(getIcon('natural-gallery-icon-next'));
        this.nextButton.style.display = 'none';
        this.nextButton.addEventListener('click', (e) => {
            e.preventDefault();
            this.onPageAdd();
        });

        this.bodyElementRef = document.createElement('div');
        this.bodyElementRef.classList.add('natural-gallery-body');
        this.extendToFreeViewport();

        // Iframe
        const iframe = document.createElement('iframe');
        this.elementRef.appendChild(iframe);

        // Resize debounce
        const resizeDebounceDuration = 500;
        const startResize = debounce(() => this.startResize(), resizeDebounceDuration, {leading: true, trailing: false});
        const endResize = debounce(() => this.endResize(), resizeDebounceDuration, {leading: false, trailing: true});
        iframe.contentWindow.addEventListener('resize', () => {
            endResize();
            startResize();
        });

        this.elementRef.appendChild(this.bodyElementRef);
        this.elementRef.appendChild(this.nextButton);

        if (!this.options.rowsPerPage) {
            this.bindScroll(this.scrollElementRef || document);
        }

        this.initItems();
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
        let display = this.collection.length === this.visibleCollection.length;

        // Complete collection
        models.forEach((model: Model) => {
            const itemOptions = pick(this.options, ['lightbox', 'selectable', 'activable', 'gap', 'showLabels', 'cover']);
            const item = new Item<Model>(itemOptions, model);
            this._collection.push(item);

            if (this.photoswipeElementRef) {
                this.photoswipeCollection.push(this.getPhotoswipeItem(item));
            }
        });

        // If display and ready to display ( = if gallery has been initialized)
        if (display && this.bodyElementRef) {
            this.onPageAdd();
        }
    }

    /**
     * Select all items visible in the DOM
     * Ignores buffered items
     */
    public selectVisibleItems(): Model[] {
        this.visibleCollection.forEach((item) => item.select());
        return this.selectedItems;
    }

    /**
     * Unselect all selected elements
     */
    public unselectAllItems() {
        this.visibleCollection.forEach((item) => item.unselect());
    }

    /**
     * Allows to use the same approach and method name to listen as gallery events on DOM or on javascript gallery object
     *
     * Gallery requests items when it's instantiated. But user may subscribe after creation, so we need to request again if
     * user subscribes by this function.
     *
     * @param name
     * @param callback
     */
    public addEventListener(name: string, callback: (ev) => void) {
        this.elementRef.addEventListener(name, callback);

        if (name === 'pagination' && this.bodyElementRef) {
            this.requestItems();
        }
    }

    /**
     * Public api for empty function
     * Emits a pagination event
     */
    public clear() {
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
    public setItems(items: Model[]) {
        this.empty();
        this.addItems(items);
    }

    /**
     *
     */
    public abstract organizeItems(items: Item[], fromRow?: number, toRow?: number): void;

    /**
     * If gallery already has items on initialisation, set first page visible, load second page and query for more items if needed
     * If not, just query for items
     */
    protected initItems() {

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
        const bufferedItems = this.collection.slice(this.visibleCollection.length);
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
     * The gallery asks for items it needs, including some buffer items that are not displayed when given but are available to be added
     * immediately to DOM when user scrolls.
     *
     */
    protected requestItems() {
        const estimatedPerRow = this.getEstimatedColumnsPerRow();

        // +1 because we have to get more than that is used under onPageAdd().
        // Without +1 all items are always added to DOM and gallery will loop load until end of collection
        const limit = estimatedPerRow * this.getRowsPerPage() + 1;
        this.dispatchEvent('pagination', {offset: this.collection.length, limit: limit});
    }

    /**
     * Returns option.rowsPerPage is specified.
     * If not returns the estimated number of rows to fill the rest of the vertical space in the screen
     * @returns {number}
     */
    protected getRowsPerPage() {
        if (this.options.rowsPerPage > 0) {
            return this.options.rowsPerPage;
        }

        const estimation = this.getEstimatedRowsPerPage();
        return estimation < this.options.minRowsAtStart ? this.options.minRowsAtStart : estimation;
    }

    /**
     * Add given item to DOM and to visibleCollection
     * @param {Item} item
     * @param destination
     */
    protected addItemToDOM(item: Item<Model>, destination: HTMLElement = this.bodyElementRef): void {
        this.visibleCollection.push(item);

        destination.appendChild(item.init());

        this.scrollBufferedItems.push(item);
        this.requiredItems++;
        this.dispatchEvent('item-added-to-dom', item.model);

        // When selected / unselected
        item.element.addEventListener('select', () => {
            this.dispatchEvent('select', this.visibleCollection.filter(i => i.selected).map(i => i.model));
        });

        // When activate (if activate event is given in options)
        item.element.addEventListener('activate', (ev: CustomEvent) => {
            this.dispatchEvent('activate', {model: ev.detail.item.model, clickEvent: ev.detail.clickEvent});
        });

        // When open zoom (photoswipe)
        item.element.addEventListener('zoom', (ev: CustomEvent) => {
            this.openPhotoSwipe(ev.detail);
        });

    }

    protected updateNextButtonVisibility() {
        if (this.visibleCollection.length === this.collection.length) {
            this.nextButton.style.display = 'none';
        } else {
            this.nextButton.style.display = 'block';
        }
    }

    /**
     * If infinite scroll (no option.rowsPerPage provided), a minimum height is setted to force gallery to overflow from viewport.
     * This activates the scroll before adding items to dom. This prevents the scroll to fire new resize event and recompute all gallery
     * twice on start.
     */
    protected extendToFreeViewport() {

        if (this.options.rowsPerPage) {
            return this.options.rowsPerPage;
        }

        this.elementRef.style.minHeight = (this.getGalleryVisibleHeight() + 10) + 'px';
    }

    /**
     * Space between the top of the gallery wrapper (parent of gallery root elementRef) and the bottom of the window
     */
    protected getGalleryVisibleHeight() {
        return document.documentElement.clientHeight - this.elementRef.offsetTop;
    }

    protected startResize() {
        this.bodyElementRef.classList.add('resizing');
    }

    protected endResize() {
        this.bodyElementRef.classList.remove('resizing');
    }

    protected openPhotoSwipe(item: Item) {

        if (this.options.lightbox && !this.photoswipeElementRef) {
            console.error('Lightbox option is set to true, but no PhotoSwipe reference is given');
            return;
        }

        let pswpOptions: InnerPhotoSwipeOptions = {
            index: this.collection.findIndex(i => i === item),
            loop: false,
        };
        pswpOptions = Object.assign({}, this.photoswipeDefaultOptions, this.options.photoSwipeOptions, pswpOptions);

        const photoswipe = new PhotoSwipe(this.photoswipeElementRef, PhotoSwipeUI_Default, this.photoswipeCollection, pswpOptions);
        photoswipe.init();

        // Loading one more page when going to next image
        photoswipe.listen('beforeChange', (delta) => {
            // Positive delta means next slide.
            // If we go next slide, and current index is out of visible collection bound, load more items
            if (delta === 1 && photoswipe.getCurrentIndex() === this.visibleCollection.length) {
                this.onPageAdd();
            }
        });

        this.dispatchEvent('zoom', {item: item.model, photoswipe: photoswipe});
    }

    /**
     * Format an Item into a PhotoswipeItem that has different attributes
     * @param item
     * @returns {PhotoswipeItem}
     */
    protected getPhotoswipeItem(item): PhotoswipeItem {
        return {
            src: item.model.enlargedSrc,
            w: item.model.enlargedWidth,
            h: item.model.enlargedHeight,
            title: item.title,
        };
    }

    protected dispatchEvent(name: string, data: any) {
        const event = new CustomEvent(name, {detail: data});
        this.elementRef.dispatchEvent(event);
    }

    /**
     * Effectively empty gallery, and should prepare container to receive new items
     */
    protected empty() {
        this.bodyElementRef.innerHTML = '';
        this._visibleCollection = [];
        this.photoswipeCollection = [];
        this._collection = [];
    }

    /**
     * Listen to scroll event and manages rows additions for lazy load
     * @param {HTMLElement | Document} element
     */
    private bindScroll(element: HTMLElement | Document) {

        const scrollable = element;
        let wrapper = null;
        if (element instanceof Document) {
            wrapper = element.documentElement;
        } else {
            wrapper = element;
        }

        const startScroll = debounce(() => this.elementRef.classList.add('scrolling'), 300, {leading: true, trailing: false});
        const endScroll = debounce(() => this.elementRef.classList.remove('scrolling'), 300, {leading: false, trailing: true});

        scrollable.addEventListener('scroll', () => {
            startScroll();
            endScroll();
            let endOfGalleryAt = this.elementRef.offsetTop + this.elementRef.offsetHeight + this.options.infiniteScrollOffset;

            // Avoid to expand gallery if we are scrolling up
            let current_scroll_top = wrapper.scrollTop - (wrapper.clientTop || 0);
            let wrapperHeight = wrapper.clientHeight;
            let scroll_delta = current_scroll_top - this.old_scroll_top;
            this.old_scroll_top = current_scroll_top;

            // "enableMoreLoading" is a setting coming from the BE bloking / enabling dynamic loading of thumbnail
            if (scroll_delta > 0 && current_scroll_top + wrapperHeight >= endOfGalleryAt) {
                // When scrolling only add a row at once
                this.onScroll();
            }
        });
    }

}
