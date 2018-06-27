import { IItemFields, IPhotoswipeItem, Item } from './Item';
import { Header } from './Header';
import { Utility } from './Utility';
import { Organizer } from './Organizer';

export interface IGalleryOptions {
    rowHeight: number;
    format: 'natural' | 'square';
    round: number;
    imagesPerRow?: number;
    margin: number;
    limit: number;
    showLabels: string;
    lightbox: boolean;
    minRowsAtStart: number;
    showCount: boolean;
    showNone: boolean;
    showOthers: boolean;
    labelNone: string;
    labelOthers: string;
    labelSearch: string;
    labelImages: string;
    selectable: boolean;
    zoomRotation: boolean;
    infiniteScrollOffset: number;
}

export class Gallery {

    /**
     * Default options
     */
    private _options: IGalleryOptions = {
        rowHeight: 350,
        format: 'natural',
        round: 3,
        margin: 3,
        limit: 0,
        showLabels: 'hover',
        lightbox: true,
        minRowsAtStart: 2,
        showCount: false,
        showNone: false,
        showOthers: false,
        labelNone: 'None',
        labelOthers: 'Others',
        labelSearch: 'Search',
        labelImages: 'Images',
        selectable: false,
        zoomRotation: true,
        infiniteScrollOffset: 0,
    };

    private _events: any = {};

    /**
     * Used to test the scroll direction
     * Avoid to load more images when scrolling up in the detection zoneoffsetHeight
     */
    private old_scroll_top = 0;

    private _id: string;

    /**
     * Root div containing the gallery
     */
    private _rootElement: HTMLElement;

    /**
     * Images wrapper container
     */
    private _bodyElement: HTMLElement;

    /**
     * Last saved wrapper width
     */
    private _bodyWidth: number;

    /**
     * Photoswipe images container
     * @type {Array}
     */
    private _photoswipeCollection: IPhotoswipeItem[] = [];

    /**
     * Photoswipe dom element
     */
    private _pswpElement: HTMLElement;

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
    private _collection: Item[] = [];
    private _visibleCollection: Item[] = [];
    private _header: Header;
    private _selected: Item[] = [];
    private nextButton: HTMLElement;
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
     * @param data
     */
    public constructor(rootElement: HTMLElement, pswp: HTMLElement, data, private scrollElement: HTMLElement = null) {

        this.pswpElement = pswp;

        // Complete options with default values
        for (const key in this.options) {
            if (typeof data.options[key] === 'undefined') {
                data.options[key] = this.options[key];
            }
        }

        this.options = data.options;
        this.rootElement = rootElement;
        this.rootElement.classList.add('natural-gallery');

        // Events
        this._events = data.events ? data.events : {};
        if (this._events.select) {
            this.options.selectable = true;
        }

        // header
        if (this.options.showCount) {
            this.header = new Header(this);
        }

        this.render();
        this.bodyWidth = Math.floor(this.bodyElement.getBoundingClientRect().width);

        if (data.images) {
            this.collection = data.images;
        } else {
            this.pagination();
        }

        if (this.options.limit === 0) {
            this.bindScroll(scrollElement !== null ? scrollElement : document);
        }

    }

    public render() {

        const self = this;

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
            const rows = this.options.limit > 0 ? this.options.limit : self.getRowsPerPage();
            self.addRows(rows);
            self.pagination(rows);
        });

        // Iframe
        const iframe = document.createElement('iframe');
        this.rootElement.appendChild(iframe);
        let timer = null;
        iframe.contentWindow.addEventListener('resize', () => {
            clearTimeout(timer);
            timer = setTimeout(function() {
                self.resize();
            }, 100);
        });

        this.bodyElement = document.createElement('div');
        this.bodyElement.classList.add('natural-gallery-body');
        this.bodyElement.appendChild(this.noResults);

        if (this.header) {
            this.rootElement.appendChild(this.header.render());
        }

        this.rootElement.appendChild(this.bodyElement);
        this.rootElement.appendChild(this.nextButton);
    }

    /**
     * Initialize items
     * @param models
     */
    public addItems(models: IItemFields[]): void {

        if (!(models.constructor === Array && models.length)) {
            return;
        }

        // Display newly added images if it's the first addition or if all images are already shown
        let display = this.collection.length === 0; // || this.collection.length === this.visibleCollection.length;

        // Complete collection
        models.forEach((model: IItemFields) => {
            const item = new Item(<IItemFields> model, this);
            this._collection.push(item);
            this._photoswipeCollection.push(item.getPhotoswipeItem());
        });

        if (display) {
            this.addRows(this.getRowsPerPage());
        }
    }

    public style(): void {
        this.collection.forEach(function(item: Item) {
            item.style();
        });
    }

    /**
     * Add a number of rows to DOM.
     * If rows are not given, is uses backoffice data or compute according to browser size
     * @param gallery target
     * @param rows
     */
    public addRows(rows: number = null): void {

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

        Organizer.organize(this.collection.slice(nbVisibleImages), this, lastVisibleRow, lastWantedRow);

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

    private addItem(item: Item) {
        this.visibleCollection.push(item);
        this.bodyElement.appendChild(item.init());
    }

    /**
     * Return number of rows to show per page,
     * If a number of rows are specified in the backoffice, this data is used.
     * If not specified, uses the vertical available space to compute the number of rows to display.
     * There is a letiable in the header of this file to specify the  minimum number of rows for the computation (minNumberOfRowsAtStart)
     * @param gallery
     * @returns {*}
     */
    private getRowsPerPage() {

        if (this.options.limit) {
            return this.options.limit;
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

        let containerWidth = Math.floor(this.bodyElement.getBoundingClientRect().width);
        if (containerWidth !== this.bodyWidth) {
            this.bodyWidth = containerWidth;

            // Compute with new width. Rows indexes may have change
            Organizer.organize(this.visibleCollection, this);

            // Refresh dom element dimensions according to last organize().
            for (const item of this.visibleCollection) {
                item.style();
            }

            // Get new last row number
            const lastVisibleRow = this.visibleCollection[this.visibleCollection.length - 1].row;

            const visibleItemsInLastRow = this.visibleCollection.filter(i => i.row === lastVisibleRow).length;

            const collectionFromLastVisibleRow = this.collection.slice(this.visibleCollection.length - visibleItemsInLastRow);

            Organizer.organize(collectionFromLastVisibleRow, this, lastVisibleRow, lastVisibleRow);

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
     * Empty DOM container and PhotoSwipe container
     */
    public clear(): void {

        this._visibleCollection.forEach(function(item: Item) {
            item.remove();
        });

        this._visibleCollection = [];
        this.noResults.style.display = 'block';
    }

    /**
     * todo : remove function
     */
    public redraw(): void {
        Organizer.organize(this.collection, this);
        for (const item of this.collection) {
            item.style();
        }
    }

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
        if (this.events.pagination) {
            if (this.collection.length) {
                const elementPerRow = this.getMaxImagesPerRow();
                this._events.pagination(this.collection.length, elementPerRow * nbRows);
            } else {
                const estimation = Organizer.simulatePagination(this);
                this._events.pagination(this.collection.length, estimation * this.getRowsPerPage() * 2);
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

    public select(item: Item, notify: boolean = true) {
        const index = this._selected.indexOf(item);
        if (index === -1) {
            this._selected.push(item);
            if (notify) {
                this._events.select(this._selected.map(i => i.fields));
            }
        }
    }

    public selectVisibleItems() {

        this.visibleCollection.forEach((item) => {
            item.select(false);
        });

        this._selected = this.visibleCollection.slice(0); // clone
        this._events.select(this.visibleCollection.map(i => i.fields));
    }

    public unselect(item: Item, notify: boolean = true) {
        const index = this._selected.indexOf(item);
        if (index > -1) {
            this._selected.splice(index, 1);
            if (notify) {
                this._events.select(this._selected.map(i => i.fields));
            }
        }
    }

    public unselectAll() {
        for (let i = this.visibleCollection.length - 1; i >= 0; i--) {
            this.visibleCollection[i].unselect(false);
        }

        this._events.select([]);
    }

    get events(): any {
        return this._events;
    }

    get id(): string {
        return this._id;
    }

    set id(value: string) {
        this._id = value;
    }

    get collection(): Item[] {
        return this._collection;
    }

    set collection(items: Item[]) {
        this.clear();
        this._collection = [];
        this.addItems(items); // completes this._collection correctly
    }

    get visibleCollection(): Item[] {
        return this._visibleCollection;
    }

    get photoswipeCollection(): IPhotoswipeItem[] {
        return this._photoswipeCollection;
    }

    get bodyWidth(): number {
        return this._bodyWidth;
    }

    set bodyWidth(value: number) {
        this._bodyWidth = value;
    }

    get bodyElement(): HTMLElement {
        return this._bodyElement;
    }

    set bodyElement(value: HTMLElement) {
        this._bodyElement = value;
    }

    get rootElement(): HTMLElement {
        return this._rootElement;
    }

    set rootElement(value: HTMLElement) {
        this._rootElement = value;
    }

    get pswpApi(): any {
        return this._pswpApi;
    }

    set pswpApi(value: any) {
        this._pswpApi = value;
    }

    get pswpElement(): HTMLElement {
        return this._pswpElement;
    }

    set pswpElement(value: HTMLElement) {
        this._pswpElement = value;
    }

    get options(): IGalleryOptions {
        return this._options;
    }

    set options(value: IGalleryOptions) {
        this._options = value;
    }

    get header(): Header {
        return this._header;
    }

    set header(value: Header) {
        this._header = value;
    }
}
