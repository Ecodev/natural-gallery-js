import { Item } from '../Item';
import { Utility } from '../Utility';
import { GalleryOptions, ItemOptions, ModelAttributes, PhotoswipeItem } from '../types';
import * as PhotoSwipe from 'photoswipe';
import * as PhotoSwipeUI_Default from 'photoswipe/dist/photoswipe-ui-default';
import * as _ from '../lodash/debounce.js';

export abstract class AbstractGallery<Model extends ModelAttributes = any> {

    /**
     * Default options
     * @private
     */
    protected defaultOptions: GalleryOptions = {
        gap: 3,
        rowsPerPage: 0,
        showLabels: 'hover',
        lightbox: true,
        minRowsAtStart: 2,
        showCount: false,
        selectable: false,
        activable: false,
        infiniteScrollOffset: 0,
        events: null,
    };

    protected options: GalleryOptions;

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
     * Photoswipe javascript object
     * Contains api to interact with library
     * @type PhotoSwipe
     */
    private _photoswipe: any;

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
     * This ratio is the supposed average ratio for the first pagination estimation
     * When gallery is created without images, this ratio is used to estimate number of images per page
     */
    protected defaultImageRatio = .7;

    protected scrollBufferedItems = [];
    protected flushBufferedItems;

    protected requiredItems = 0;

    /**
     *
     * @param elementRef
     * @param photoswipeElementRef
     * @param userOptions
     * @param scrollElementRef
     */
    protected constructor(protected elementRef: HTMLElement,
                          protected photoswipeElementRef: HTMLElement,
                          protected userOptions: GalleryOptions,
                          protected scrollElementRef: HTMLElement = null) {

        this.init();
    }

    protected init(): void {
        this.elementRef.classList.add('natural-gallery-js');

        /**
         * After having finished to add figures to dom, show images inside containers and emit updated pagination
         */
        this.flushBufferedItems = _.debounce(() => {
            this.scrollBufferedItems.forEach(i => {
                i.loadImage();
            });
            this.scrollBufferedItems = [];

            if (this.requiredItems) {
                this.dispatchEvent('pagination', {offset: this.collection.length, limit: this.requiredItems});
                this.requiredItems = 0;
            }

        }, 400, {leading: false, trailing: true});

        this.defaultsOptions();

        this.render();
        this.requestItems();

        if (!this.options.rowsPerPage) {
            this.bindScroll(this.scrollElementRef !== null ? this.scrollElementRef : document);
        }
    }

    /**
     * @param width
     * @param defaultImageRatio
     * @param options
     */
    protected abstract getEstimatedItemsPerRow(width: number, defaultImageRatio: number, options: GalleryOptions): number;

    /**
     *
     * @param items
     * @param fromRow
     * @param toRow
     */
    protected abstract organizeItems(items: Item[], fromRow?: number, toRow?: number): void;

    /**
     * Add given number of rows to DOM
     * @param rows
     */
    protected addRows(rows: number): void {

        let nbVisibleImages = this.visibleCollection.length;

        // Next row to add (first invisible row)
        const nextRow = this.visibleCollection.length ? this.visibleCollection[nbVisibleImages - 1].row + 1 : 0;
        const lastWantedRow = nextRow + rows - 1;

        // Compute size only for elements we're going to add
        this.organizeItems(this.collection.slice(nbVisibleImages), nextRow, lastWantedRow);

        for (let i = nbVisibleImages; i < this.collection.length; i++) {
            let item = this.collection[i];
            item.style();
            if (item.row <= lastWantedRow) {
                this.addItemToDOM(item);
            } else {
                break;
            }
        }

        this.flushBufferedItems();
        this.updateNextButtonVisibility();
    }

    /**
     * Return number of rows to show per page to fill the empty space until the bottom of the screen
     * Should grant all the space is used or more, but not less.
     * @returns {number}
     */
    protected abstract getEstimatedRowsPerPage(): number;

    /**
     * @param options
     */
    protected defaultsOptions(): void {

        this.options = this.userOptions;
        for (const key in this.defaultOptions) {
            if (typeof this.options[key] === 'undefined') {
                this.options[key] = this.defaultOptions[key];
            }
        }
    }

    /**
     * Fire pagination event
     * Information provided in the event allows to retrieve items from the server using given data :
     * "offset" and "limit" that have the same semantic that respective attributes in mySQL.
     *
     * The gallery asks for items it needs, including some buffer items that are not displayed when given but are available to be added
     * immediately to DOM when user scrolls.
     *
     * @param {number} nbItems
     */
    protected requestItems(nbItems?: number) {
        const estimatedPerRow = this.getEstimatedItemsPerRow(this.width, this.defaultImageRatio, this.options);
        const limit = estimatedPerRow * this.getRowsPerPage();
        this.dispatchEvent('pagination', {offset: this.collection.length, limit: limit});
    }

    /**
     * Returns option.rowsPerPage is specified.
     * If not returns the estimated number of rows to fill the rest of the vertical space in the screen
     * @returns {number}
     */
    protected getRowsPerPage() {
        if (this.options.rowsPerPage) {
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

    protected render() {

        // Next button
        this.nextButton = document.createElement('div');
        this.nextButton.classList.add('natural-gallery-next');
        this.nextButton.appendChild(Utility.getIcon('icon-next'));
        this.nextButton.style.display = 'none';
        this.nextButton.addEventListener('click', (e) => {
            e.preventDefault();
            const rows = this.options.rowsPerPage > 0 ? this.options.rowsPerPage : this.getRowsPerPage();
            this.addRows(rows);
        });

        this.bodyElementRef = document.createElement('div');
        this.bodyElementRef.classList.add('natural-gallery-body');
        this.extendToFreeViewport();

        // Iframe
        const iframe = document.createElement('iframe');
        this.elementRef.appendChild(iframe);

        // Resize debounce
        const resizeDebounceDuration = 500;
        const startResize = _.debounce(() => this.startResize(), resizeDebounceDuration, {leading: true, trailing: false});
        const endResize = _.debounce(() => this.endResize(), resizeDebounceDuration, {leading: false, trailing: true});
        iframe.contentWindow.addEventListener('resize', () => {
            endResize();
            startResize();
        });

        this.elementRef.appendChild(this.bodyElementRef);
        this.elementRef.appendChild(this.nextButton);
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
            const item = new Item<Model>(this.getItemOptions(), model);
            this._collection.push(item);
            this.photoswipeCollection.push(this.getPhotoswipeItem(item));
        });

        if (display) {
            this.addRows(this.getRowsPerPage());
        }

    }

    /**
     * Combine options from gallery with attributes required to generate a figure
     * @param {Model} model
     * @returns {ItemOptions}
     */
    private getItemOptions(): ItemOptions {
        return {
            lightbox: this.options.lightbox,
            selectable: this.options.selectable,
            activable: this.options.activable,
            gap: this.options.gap,
            showLabels: this.options.showLabels,
        };
    }

    protected extendToFreeViewport() {

        if (this.options.rowsPerPage) {
            return this.options.rowsPerPage;
        }

        this.elementRef.style.minHeight = (this.getFreeViewportSpace() + 10) + 'px';
    }

    /**
     * Space between the top of the gallery wrapper (parent of gallery root elementRef) and the bottom of the window
     */
    protected getFreeViewportSpace() {
        let winHeight = this.scrollElementRef ? this.scrollElementRef.clientHeight : document.documentElement.clientHeight;
        return winHeight - this.elementRef.offsetTop;
    }

    public startResize() {
        this.bodyElementRef.classList.add('resizing');
    }

    public endResize() {

        this.bodyElementRef.classList.remove('resizing');

        if (!this.visibleCollection.length) {
            return;
        }

        // Compute with new width. Rows indexes may have change
        this.organizeItems(this.visibleCollection);

        // Get new last row number
        const lastVisibleRow = this.visibleCollection[this.visibleCollection.length - 1].row;

        // Get number of items in that last row
        const visibleItemsInLastRow = this.visibleCollection.filter(i => i.row === lastVisibleRow).length;

        // Get a list from first item of last row until end of collection
        const collectionFromLastVisibleRow = this.collection.slice(this.visibleCollection.length - visibleItemsInLastRow);

        // organizeItems entire last row + number of specified additional rows
        this.organizeItems(collectionFromLastVisibleRow, lastVisibleRow, lastVisibleRow);

        for (let i = this.visibleCollection.length; i < this.collection.length; i++) {
            const testedItem = this.collection[i];
            if (testedItem.row === lastVisibleRow) {
                this.addItemToDOM(testedItem);
            } else {
                break;
            }
        }

        this.flushBufferedItems();

        for (const item of this.visibleCollection) {
            item.style();
        }

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

        scrollable.addEventListener('scroll', () => {
            let endOfGalleryAt = this.elementRef.offsetTop + this.elementRef.offsetHeight + this.options.infiniteScrollOffset;

            // Avoid to expand gallery if we are scrolling up
            let current_scroll_top = wrapper.scrollTop - (wrapper.clientTop || 0);
            let wrapperHeight = wrapper.clientHeight;
            let scroll_delta = current_scroll_top - this.old_scroll_top;
            this.old_scroll_top = current_scroll_top;

            // "enableMoreLoading" is a setting coming from the BE bloking / enabling dynamic loading of thumbnail
            if (scroll_delta > 0 && current_scroll_top + wrapperHeight >= endOfGalleryAt) {
                // When scrolling only add a row at once
                this.addRows(1);
            }
        });
    }

    protected openPhotoSwipe(item: Item) {

        let pswpOptions = {
            index: this.collection.findIndex(i => i === item),
            bgOpacity: 0.85,
            showHideOpacity: true,
            loop: false,
        };

        this._photoswipe = new PhotoSwipe(this.photoswipeElementRef, PhotoSwipeUI_Default, this.photoswipeCollection, pswpOptions);
        this._photoswipe.init();

        // Loading one more page when going to next image
        this._photoswipe.listen('beforeChange', (delta) => {
            // Positive delta means next slide.
            // If we go next slide, and current index is out of visible collection bound, load more items
            if (delta === 1 && this._photoswipe.getCurrentIndex() === this.visibleCollection.length) {
                this.addRows(1);
            }
        });
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
    public selectVisibleItems() {
        this.visibleCollection.forEach((item) => item.select());
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

    get width(): number {
        return Math.floor(this.bodyElementRef.getBoundingClientRect().width);
    }

    get photoswipe(): any {
        return this._photoswipe;
    }

}
