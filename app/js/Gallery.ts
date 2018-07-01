import { Item } from './Item';
import { Header } from './Header';
import { Utility } from './Utility';
import { Organizer } from './Organizer';
import { GalleryOptions, ItemOptions, ModelAttributes, PhotoswipeItem } from './types';
import * as PhotoSwipe from 'photoswipe';
import * as PhotoSwipeUI_Default from 'photoswipe/dist/photoswipe-ui-default';

export class Gallery<Model extends ModelAttributes = any> {

    /**
     * Default options
     * @private
     */
    private options: GalleryOptions = {
        rowHeight: 350,
        format: 'natural',
        round: 3,
        margin: 3,
        rowsPerPage: 0,
        showLabels: 'hover',
        lightbox: true,
        minRowsAtStart: 2,
        showCount: false,
        labelImages: 'Images',
        selectable: false,
        activable: false,
        zoomRotation: true,
        infiniteScrollOffset: 0,
        events: null,
    };

    /**
     * Used to test the scroll direction
     * Avoid to load more images when scrolling up
     */
    private old_scroll_top = 0;

    /**
     * Images wrapper container
     */
    private bodyElement: HTMLElement;

    /**
     * Last saved wrapper width
     */
    private bodyWidth: number;

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
    private _collection: Item<Model>[] = [];

    /**
     * Partial set of items that represent the visible items
     * @type {Item[]}
     * @private
     */
    private _visibleCollection: Item<Model>[] = [];

    /**
     * Photoswipe images container
     * @type {Array}
     */
    private photoswipeCollection: PhotoswipeItem[] = [];

    /**
     * Stores object header, that contains display for image count
     */
    private readonly header: Header;

    /**
     * Reference to next button element
     */
    private nextButton: HTMLElement;

    /**
     * Reference to no results icon
     */
    private noResults: HTMLElement;

    /**
     * This ratio is the supposed average ratio for the first pagination estimation
     * When gallery is created without images, this ratio is used to estimate number of images per page
     */
    public defaultImageRatio = .7;

    /**
     * Initiate gallery
     * @param rootElement
     * @param pswpElement
     * @param scrollElement
     * @param options
     */
    public constructor(private rootElement: HTMLElement,
                       private pswpElement: HTMLElement,
                       options: GalleryOptions,
                       private scrollElement: HTMLElement = null) {

        // Default options
        for (const key in this.options) {
            if (typeof options[key] === 'undefined') {
                options[key] = this.options[key];
            }
        }

        this.options = options;
        this.rootElement.classList.add('natural-gallery');

        // header
        if (this.options.showCount) {
            this.header = new Header(this.options.labelImages);
        }

        this.render();
        this.bodyWidth = Math.floor(this.bodyElement.getBoundingClientRect().width);
        this.requestItems(1);

        if (!this.options.rowsPerPage) {
            this.bindScroll(scrollElement !== null ? scrollElement : document);
        }

    }

    public render() {

        // Next button
        this.nextButton = document.createElement('div');
        this.nextButton.classList.add('natural-gallery-next');
        this.nextButton.appendChild(Utility.getIcon('icon-next'));
        this.nextButton.style.display = 'none';
        this.nextButton.addEventListener('click', (e) => {
            e.preventDefault();
            const rows = this.options.rowsPerPage > 0 ? this.options.rowsPerPage : this.getRowsPerPage();
            this.addRows(rows);
            this.requestItems(rows);
        });

        // Iframe
        const iframe = document.createElement('iframe');
        this.rootElement.appendChild(iframe);
        let timer = null;
        iframe.contentWindow.addEventListener('resize', () => {
            clearTimeout(timer);
            timer = setTimeout(() => {
                this.resize();
            }, 100);
        });

        this.bodyElement = document.createElement('div');
        this.bodyElement.classList.add('natural-gallery-body');

        if (this.header) {
            this.rootElement.appendChild(this.header.render());
        }

        this.rootElement.appendChild(this.bodyElement);
        this.rootElement.appendChild(this.nextButton);
    }

    /**
     * We only show empty button after calling addItems or setItems and collection is empty
     */
    private renderNoResultsIndicator() {
        if (!this.noResults) {
            this.noResults = document.createElement('div');
            this.noResults.classList.add('natural-gallery-noresults');
            this.noResults.appendChild(Utility.getIcon('icon-noresults'));
            this.rootElement.appendChild(this.noResults);
        }
    }

    private updateNoResultsVisibility() {
        this.renderNoResultsIndicator();

        if (this.collection.length) {
            this.noResults.style.display = 'none';
        } else {
            this.noResults.style.display = 'block';
        }
    }

    /**
     * Override current collection
     * @param {Item[]} items
     */
    public setItems(items: Model[]) {
        this.clearVisibleItems();
        this._collection = [];
        this.addItems(items);
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
        let display = this.collection.length === 0 || this.collection.length === this.visibleCollection.length;

        // Complete collection
        models.forEach((model: Model) => {
            const item = new Item<Model>(this.getItemOptions(model), model);
            this._collection.push(item);
            this.photoswipeCollection.push(this.getPhotoswipeItem(item));
        });

        this.updateNoResultsVisibility();

        if (display) {
            this.addRows(this.getRowsPerPage());
        }

        if (this.header) {
            this.header.updateTotalImages(this.collection.length);
        }
    }

    /**
     * Combine options from gallery with attributes required to generate a figure
     * @param {Model} model
     * @returns {ItemOptions}
     */
    private getItemOptions(model: Model): ItemOptions {
        return {
            lightbox: this.options.lightbox,
            selectable: this.options.selectable,
            activable: this.options.activable,
            margin: this.options.margin,
            round: this.options.round,
            showLabels: this.options.showLabels,
            zoomRotation: this.options.zoomRotation,
        };
    }

    /**
     * Add given number of rows to DOM
     * @param rows
     */
    public addRows(rows: number): void {

        // Show / Hide "more" button.
        if (this.visibleCollection.length === this.collection.length) {
            this.nextButton.style.display = 'none';
        } else {
            this.nextButton.style.display = 'block';
        }

        let nbVisibleImages = this.visibleCollection.length;
        const lastVisibleRow = this.visibleCollection.length ? this.visibleCollection[nbVisibleImages - 1].row + 1 : 0;
        const lastWantedRow = lastVisibleRow + rows;

        Organizer.organize(this.collection.slice(nbVisibleImages), this.width, this.options, lastVisibleRow, lastWantedRow);

        for (const item of this.collection) {
            item.style();
        }

        for (let i = nbVisibleImages; i < this.collection.length; i++) {
            let item = this.collection[i];
            if (item.row <= lastWantedRow) {
                this.addItemToDOM(item);
            }
        }

        // Show / Hide "more" button.
        if (this.visibleCollection.length === this.collection.length) {
            this.nextButton.style.display = 'none';
        } else {
            this.nextButton.style.display = 'block';
        }

        if (this.header) {
            this.header.updateVisibleImages(this.visibleCollection.length);
        }
    }

    /**
     * Add given item to DOM and to visibleCollection
     * @param {Item} item
     */
    private addItemToDOM(item: Item<Model>) {
        this.visibleCollection.push(item);
        this.bodyElement.appendChild(item.init());

        // When selected / unselected
        item.element.addEventListener('select', () => {
            this.notifySelectedItems(this.visibleCollection.filter(i => i.selected));
        });

        // When activate (if activate event is given in options)
        item.element.addEventListener('activate', (ev: CustomEvent) => {
            this.notifyActivatedItem(ev.detail.item, ev.detail.clickEvent);
        });

        // When open zoom (photoswipe)
        item.element.addEventListener('zoom', (ev: CustomEvent) => {
            this.openPhotoSwipe(ev.detail);
        });

    }

    /**
     * Return number of rows to show per page,
     * If rowsPerPage is specified in the options, it's used.
     * If not, it uses the vertical available space to compute the number of rows to display.
     * @returns {number}
     */
    private getRowsPerPage(): number {

        if (this.options.rowsPerPage) {
            return this.options.rowsPerPage;
        }

        let winHeight = this.scrollElement ? this.scrollElement.clientHeight : document.documentElement.clientHeight;
        let galleryVisibleHeight = winHeight - this.bodyElement.offsetTop;

        // ratio to be more close from reality average row height
        let nbRows = Math.floor(galleryVisibleHeight / (this.options.rowHeight * 0.55));

        return nbRows < this.options.minRowsAtStart ? this.options.minRowsAtStart : nbRows;
    }

    /**
     * Check if we need to resize a gallery (only if parent container width changes)
     * The keep full rows, it recomputes sizes with new dimension, and reset everything, then add the same number of row.
     * It results in not partial row.
     */
    public resize() {

        // todo : hide images during resize
        // 1) On resize start fix gallery container size
        // 2) Hide items
        // 3) Show resizing icon
        // 4) Debounce resize end
        // 5) On resize ends, reorganize item sizes, and update dom elements
        // 6) Show items, and hide resizing icon

        let containerWidth = Math.floor(this.bodyElement.getBoundingClientRect().width);
        if (containerWidth !== this.bodyWidth) {
            this.bodyWidth = containerWidth;

            // Compute with new width. Rows indexes may have change
            Organizer.organize(this.visibleCollection, this.width, this.options);

            // Refresh dom element dimensions according to last organize().
            for (const item of this.visibleCollection) {
                item.style();
            }

            // Get new last row number
            const lastVisibleRow = this.visibleCollection[this.visibleCollection.length - 1].row;

            // Get number of items in that last row
            const visibleItemsInLastRow = this.visibleCollection.filter(i => i.row === lastVisibleRow).length;

            // Get a list from first item of last row until end of collection
            const collectionFromLastVisibleRow = this.collection.slice(this.visibleCollection.length - visibleItemsInLastRow);

            // Organize entire last row + number of specified additional rows
            Organizer.organize(collectionFromLastVisibleRow, this.width, this.options, lastVisibleRow, lastVisibleRow);

            for (let i = this.visibleCollection.length; i < this.collection.length; i++) {
                const testedItem = this.collection[i];

                if (testedItem.row === lastVisibleRow) {
                    this.addItemToDOM(testedItem);
                } else {
                    break;
                }
            }

        }
    }

    /**
     * Remove items from DOM, but preverves collection
     */
    public clearVisibleItems(): void {
        this._visibleCollection.forEach((item) => item.remove());
        this._visibleCollection = [];
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
            let endOfGalleryAt = this.rootElement.offsetTop + this.rootElement.offsetHeight + this.options.infiniteScrollOffset;

            // Avoid to expand gallery if we are scrolling up
            let current_scroll_top = wrapper.scrollTop - (wrapper.clientTop || 0);
            let wrapperHeight = wrapper.clientHeight;
            let scroll_delta = current_scroll_top - this.old_scroll_top;
            this.old_scroll_top = current_scroll_top;

            // "enableMoreLoading" is a setting coming from the BE bloking / enabling dynamic loading of thumbnail
            if (scroll_delta > 0 && current_scroll_top + wrapperHeight >= endOfGalleryAt) {
                // When scrolling only add a row at once
                this.addRows(1);
                this.requestItems(1);
            }
        });
    }

    private openPhotoSwipe(item: Item) {

        let pswpOptions = {
            index: this.collection.findIndex(i => i === item),
            bgOpacity: 0.85,
            showHideOpacity: true,
            loop: false,
        };

        this._photoswipe = new PhotoSwipe(this.pswpElement, PhotoSwipeUI_Default, this.photoswipeCollection, pswpOptions);
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
    public getPhotoswipeItem(item): PhotoswipeItem {
        return {
            src: item.model.enlargedSrc,
            w: item.model.enlargedWidth,
            h: item.model.enlargedHeight,
            title: item.title,
        };
    }

    /**
     * Fire pagination event (if applicable)
     * Information provided in the event allows to retrieve items from the server using given data :
     * "offset" and "limit" that have the same semantic that respective attributes in mySQL.
     *
     * The gallery asks for items it needs, including some buffer items that are not displayed when given but are available to be added
     * immediately to DOM when user scrolls.
     *
     * @param {number} nbRows
     */
    private requestItems(nbRows: number) {

        let offset = null;
        let limit = null;

        if (this.collection.length) {
            const elementPerRow = this.getMaxImagesPerRow();
            limit = elementPerRow * nbRows;
            offset = this.collection.length;
        } else {
            const estimation = Organizer.simulatePagination(this.width, this.defaultImageRatio, this.options);
            limit = estimation * this.getRowsPerPage() * 2;
            offset = 0;
        }

        this.notifyPagination(offset, limit);
    }

    /**
     * Return the max number of images per row
     * @returns {number}
     */
    private getMaxImagesPerRow() {
        const nbPerRowFn = arr => arr.reduce((stack, e) => {
            stack[e.row] = stack[e.row] > -1 ? stack[e.row] + 1 : 1;
            return stack;
        }, []);

        return Math.max.apply(null, nbPerRowFn(this.visibleCollection));
    }

    private notifySelectedItems(items: Item[]) {
        if (this.options.events && this.options.events.select) {
            this.options.events.select(items.map(i => i.model));
        }
    }

    private notifyActivatedItem(item: Item, ev: CustomEvent) {
        if (this.options.events && this.options.events.activate) {
            this.options.events.activate(item.model, ev);
        }
    }

    private notifyPagination(offset: number, limit: number) {
        if (this.options.events && this.options.events.activate) {
            this.options.events.pagination({offset: offset, limit: limit});
        }
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
     * todo : implement
     */
    // public enableSelectionMode() {
    // }

    /**
     * todo : implement
     */
    // public disableSelectionMode() {
    // }

    get collection(): Item<Model>[] {
        return this._collection;
    }

    get visibleCollection(): Item<Model>[] {
        return this._visibleCollection;
    }

    get width(): number {
        return this.bodyWidth;
    }

    get photoswipe(): any {
        return this._photoswipe;
    }

}
