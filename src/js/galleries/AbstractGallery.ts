import debounce from 'lodash-es/debounce';
import defaults from 'lodash-es/defaults';
import pick from 'lodash-es/pick';
import PhotoSwipe from 'photoswipe';
import PhotoSwipeUI_Default from 'photoswipe/dist/photoswipe-ui-default';
import { Item, ItemOptions } from '../Item';
import { Utility } from '../Utility';

export interface ModelAttributes {
    thumbnailSrc: string;
    enlargedSrc?: string;
    enlargedWidth?: number;
    enlargedHeight?: number;
    title?: string;
    link?: string;
    linkTarget?: string;
    color?: string;
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
    title: string;
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
     * Used to test the scroll direction
     * Avoid to load more images when scrolling up
     */
    private old_scroll_top = 0;

    /**
     * Images wrapper container
     */
    protected bodyElementRef: HTMLElement;

    /**
     * Complete collection of images
     * @type {Array}
     */
    protected _collection: Item<Model>[] = [];

    /**
     * Partial set of items that represent the visible items
     * @type {Item[]}
     * @private
     */
    protected _visibleCollection: Item<Model>[] = [];

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
     * Items for which container has been added to dom, but image has not been queries yet
     */
    protected scrollBufferedItems = [];

    /**
     * Debounced function that queries for images after a little moment where no other images container have been added to DOM
     */
    protected flushBufferedItems: () => void;

    protected requiredItems = 0;

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
        console.log('this.options', this.options);

        if (this.options.lightbox && !this.photoswipeElementRef) {
            console.error('Lightbox option is set to true, but no PhotoSwipe reference is given');
        }

    }

    protected abstract getEstimatedItemsPerRow(): number;

    protected abstract organizeItems(items: Item[], fromRow?: number, toRow?: number): void;

    protected abstract onScroll(): void;

    protected abstract onPageAdd(): void;

    protected init(): void {

        this.elementRef.classList.add('natural-gallery-js');

        // After having finished to add figures to dom, show images inside containers and emit updated pagination
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

        // Next button
        this.nextButton = document.createElement('div');
        this.nextButton.classList.add('natural-gallery-next');
        this.nextButton.appendChild(Utility.getIcon('natural-gallery-icon-next'));
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

        this.requestItems();

        if (!this.options.rowsPerPage) {
            this.bindScroll(this.scrollElementRef !== null ? this.scrollElementRef : document);
        }
    }

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
        const estimatedPerRow = this.getEstimatedItemsPerRow();
        const limit = estimatedPerRow * (this.getRowsPerPage() + 1);
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
     * Add items to collection
     * Transform given list of models into inner Items
     * @param models
     */
    public addItems(models: Model[]): void {

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
            this.photoswipeCollection.push(this.getPhotoswipeItem(item));
        });

        if (display) {
            this.onPageAdd();
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

        if (name === 'pagination') {
            this.requestItems();
        }
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
     * Public api for empty function
     * Emits a pagination event
     */
    public clear() {
        this.empty();
        this.requestItems();
    }

    /**
     * Override current collection
     * @param {Item[]} items
     */
    public setItems(items: Model[]) {
        this.empty();
        this.addItems(items);
    }

    get collection(): Item<Model>[] {
        return this._collection;
    }

    get visibleCollection(): Item<Model>[] {
        return this._visibleCollection;
    }

    get selectedItems(): Model[] {
        return this.visibleCollection.filter((item) => item.selected).map(item => item.model);
    }

    get width(): number {
        return Math.floor(this.bodyElementRef.getBoundingClientRect().width);
    }

    get collectionLength(): number {
        return this.collection.length;
    }

    get visibleCollectionLength(): number {
        return this.visibleCollection.length;
    }

}
