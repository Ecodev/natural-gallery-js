import { Item } from './Item';
import { Header } from './Header';
import { Utility } from './Utility';
import { Organizer } from './Organizer';
import { GalleryOptions, ItemOptions, ModelAttributes, PhotoswipeItem } from './types';

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
    private _pswpApi: any;

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
     * List of selected items
     * @type {Item[]}
     * @private
     */
    private _selected: Item<Model>[] = [];

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
     * @param pswp
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

        // Events
        if (this.options.events && this.options.events.select) {
            this.options.selectable = true;
        }

        // header
        if (this.options.showCount) {
            this.header = new Header(this.options.labelImages);
        }

        this.render();
        this.bodyWidth = Math.floor(this.bodyElement.getBoundingClientRect().width);
        this.pagination();

        if (!this.options.rowsPerPage) {
            this.bindScroll(scrollElement !== null ? scrollElement : document);
        }

    }

    public render() {

        // Empty
        this.noResults = document.createElement('div');
        this.noResults.classList.add('natural-gallery-noresults');
        this.noResults.appendChild(Utility.getIcon('icon-noresults'));
        this.noResults.style.display = 'block';

        // Next button
        this.nextButton = document.createElement('div');
        this.nextButton.classList.add('natural-gallery-next');
        this.nextButton.appendChild(Utility.getIcon('icon-next'));
        this.nextButton.style.display = 'none';
        this.nextButton.addEventListener('click', (e) => {
            e.preventDefault();
            const rows = this.options.rowsPerPage > 0 ? this.options.rowsPerPage : this.getRowsPerPage();
            this.addRows(rows);
            this.pagination(rows);
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
        this.rootElement.appendChild(this.noResults);
        this.rootElement.appendChild(this.nextButton);
    }

    /**
     * Override current collection
     * @param {Item[]} items
     */
    public setItems(items: Model[]) {
        this.clear();
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
            this.photoswipeCollection.push(item.getPhotoswipeItem());
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
    private getItemOptions(model: Model): ItemOptions {
        return {
            lightbox: this.options.lightbox,
            selectable: this.options.selectable,
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

        // display because filters may add more images and we have to show it again
        this.nextButton.style.display = 'block';

        if (this.visibleCollection.length === this.collection.length) {
            this.nextButton.style.display = 'none';

            if (this.collection.length === 0) {
                this.noResults.style.display = 'block';
                (<HTMLElement> this.rootElement.getElementsByClassName('natural-gallery-images')[0]).style.display = 'none';
            }

            return;
        }

        let nbVisibleImages = this.visibleCollection.length;
        const lastVisibleRow = this.visibleCollection.length ? this.visibleCollection[nbVisibleImages - 1].row : 0;
        const lastWantedRow = lastVisibleRow + rows - 1;

        Organizer.organize(this.collection.slice(nbVisibleImages), this.width, this.options, lastVisibleRow, lastWantedRow);

        for (const item of this.collection) {
            item.style();
        }

        for (let i = nbVisibleImages; i < this.collection.length; i++) {
            let item = this.collection[i];
            if (item.row <= lastWantedRow) {
                this.addItem(item);
            }
        }

        // Show / Hide "more" button.
        if (this.visibleCollection.length === this.collection.length) {
            this.nextButton.style.display = 'none';
        }

        this.noResults.style.display = 'none';

        let imageContainer = (<HTMLElement> this.rootElement.getElementsByClassName('natural-gallery-images')[0]);
        if (imageContainer) {
            imageContainer.style.display = 'block';
        }

        let galleryVisible = this.rootElement.getElementsByClassName('natural-gallery-visible')[0];
        if (galleryVisible) {
            galleryVisible.textContent = String(this.visibleCollection.length);
        }

        let galleryTotal = this.rootElement.getElementsByClassName('natural-gallery-total')[0];
        if (galleryTotal) {
            galleryTotal.textContent = String(this.collection.length);
        }
    }

    /**
     * Add given item to DOM and to visibleCollection
     * @param {Item} item
     */
    private addItem(item: Item<Model>) {
        this.visibleCollection.push(item);
        this.bodyElement.appendChild(item.init());
    }

    /**
     * Return number of rows to show per page,
     * If a number of rows are specified in the backoffice, this data is used.
     * If not specified, uses the vertical available space to compute the number of rows to display.
     * There is a letiable in the header of this file to specify the  minimum number of rows for the computation (minNumberOfRowsAtStart)
     * @returns {*}
     */
    private getRowsPerPage() {

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
                    this.addItem(testedItem);
                } else {
                    break;
                }
            }

        }
    }

    /**
     * Remove items from DOM
     */
    public clear(): void {
        this._visibleCollection.forEach((item) => item.remove());
        this._visibleCollection = [];
        this.noResults.style.display = 'block';
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
                this.pagination(1);
            }
        });
    }

    private pagination(nbRows = 1) {
        if (this.options.events && this.options.events.pagination) {
            if (this.collection.length) {
                const elementPerRow = this.getMaxImagesPerRow();
                this.options.events.pagination(this.collection.length, elementPerRow * nbRows);
            } else {
                const estimation = Organizer.simulatePagination(this.width, this.defaultImageRatio, this.options);
                this.options.events.pagination(this.collection.length, estimation * this.getRowsPerPage() * 2);
            }
        }
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

        return Math.max.apply(null, nbPerRowFn(this.collection));
    }

    public selectItem(item: Item<Model>, notify: boolean = true) {
        const index = this._selected.indexOf(item);
        if (index === -1) {
            this._selected.push(item);
            if (notify && this.options.events && this.options.events.select) {
                this.options.events.select(this._selected.map(i => i.model));
            }
        }
    }

    public unselectItem(item: Item<Model>, notify: boolean = true) {
        const index = this._selected.indexOf(item);
        if (index > -1) {
            this._selected.splice(index, 1);
            if (notify && this.options.events && this.options.events.select) {
                this.options.events.select(this._selected.map(i => i.model));
            }
        }
    }

    /**
     * Select all items visible in the dom
     */
    public selectVisibleItems() {
        this.visibleCollection.forEach((item) => item.select(false));
        this._selected = this.visibleCollection.slice(0); // shallow copy, preserve items relations
        if (this.options.events && this.options.events.select) {
            this.options.events.select(this.visibleCollection.map(i => i.model));
        }
    }

    /**
     * Select all items already given
     * Care : they may be not displayed in the DOM
     */
    public selectAllItems() {
        this.collection.forEach((item) => item.select(false));
        this._selected = this.collection.slice(0); // shallow copy, preserve items relations
        if (this.options.events && this.options.events.select) {
            this.options.events.select(this.collection.map(i => i.model));
        }
    }

    /**
     * Unselect all selected elements
     */
    public unselectAll() {

        for (let i = this._selected.length - 1; i >= 0; i--) {
            this._selected[i].unselect(false);
        }

        if (this.options.events && this.options.events.select) {
            this.options.events.select([]);
        }
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

    get pswpApi(): any {
        return this._pswpApi;
    }

}
