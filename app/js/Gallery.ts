module Natural.Gallery {

    export interface iGalleryOptions {
        rowHeight: number;
        format: string;
        round: number;
        imagesPerRow: number;
        margin: number;
        limit: number;
        showLabels: string;
        lightbox: boolean;
        minRowsAtStart: number;
        showCount: boolean;
        searchFilter: boolean;
        categoriesFilter: boolean;
        showNone: boolean;
        showOthers: boolean;
    }

    export class Gallery {

        /**
         * Default options
         */
        private _options: iGalleryOptions = {
            rowHeight: 350,
            format: 'natural',
            round: 3,
            imagesPerRow: 4,
            margin: 3,
            limit: 0,
            showLabels: 'hover',
            lightbox: true,
            minRowsAtStart: 2,
            showCount: false,
            searchFilter: false,
            categoriesFilter: false,
            showNone: false,
            showOthers: false
        };

        /**
         * Nth gallery on document
         * Used to select root element and then body element
         */
        private _position: number;

        /**
         * Root div containing the gallery
         */
        private _rootElement: Element;

        /**
         * Images wrapper container
         */
        private _bodyElement: Element;

        /**
         * Last saved wrapper width
         */
        private _bodyWidth: number;

        /**
         * Photoswipe images container
         * @type {Array}
         */
        private _pswpContainer: any[] = [];

        /**
         * Photoswipe dom element
         */
        private _pswpElement: any;

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
        private _categories: any[] = [];

        private _header: Header;

        /**
         * Search and Categories filters
         * @type {null}
         */
        //private filter: Filter = null;

        /**
         * Initiate gallery
         * @param position
         * @param options
         * @param categories
         * @param pswp
         */
        public constructor(position, options, categories: Category[] = [], pswp: any) {

            this.pswpElement = pswp;

            for (var key in this.options) {
                if (typeof options[key] === 'undefined') {
                    options[key] = this.options[key];
                }
            }

            this.options = options;
            this.position = position;
            this.categories = categories;
            this.rootElement = document.getElementsByClassName('natural-gallery').item(this.position);

            // header
            if (this.options.searchFilter || this.options.categoriesFilter || this.options.showCount) {

                this.header = new Header(this);

                if (this.options.searchFilter) {
                    this.header.addFilter(new SearchFilter(this.header));
                }

                if (this.options.categoriesFilter) {
                    this.header.addFilter(new CategoryFilter(this.header));
                }
            }

            this.render();
            this.bodyWidth = Math.floor(this.bodyElement.getBoundingClientRect().width);

        }

        public render() {

            let self = this;

            let noResults = document.createElement('div');
            Utility.addClass(noResults, 'natural-gallery-noresults');
            noResults.appendChild(Utility.getIcon('icon-noresults'));

            let nextButton = document.createElement('div');
            Utility.addClass(nextButton, 'natural-gallery-next');
            nextButton.appendChild(Utility.getIcon('icon-next'));
            nextButton.addEventListener('click', function(e) {
                e.preventDefault();
                self.addElements();
            });

            // Add iframe at root level that launches a resize when width change
            let iframe = document.createElement('iframe');
            iframe.addEventListener('load', function() {
                let timer = null;

                this.contentWindow.addEventListener('resize', function() {
                    clearTimeout(timer);
                    timer = setTimeout(function() {
                        self.resize();
                    }, 100);
                });
            });

            this.bodyElement = document.createElement('div');
            Utility.addClass(this.bodyElement, 'natural-gallery-body');
            this.bodyElement.appendChild(noResults);

            if (this.header) {
                this.rootElement.appendChild(this.header.render());
            }

            this.rootElement.appendChild(this.bodyElement);
            this.rootElement.appendChild(nextButton);
            this.rootElement.appendChild(iframe);

        }

        /**
         * Initialize items
         * @param items
         */
        public appendItems(items): void {

            let display = false;

            // if it's first addition of items, display them
            if (this.collection.length === 0) {
                display = true;
            }

            // Complete collection
            items.forEach(function(item) {
                this.collection.push(new Item(<IItemFields> item, this));
            }, this);

            // Compute sizes
            Organizer.organize(this);

            if (this.header) {
                this.header.refresh();
            }

            if (display) {
                this.addElements();
            }
        }

        public style(): void {
            this.collection.forEach(function(item: Item) {
                item.style();
            });
        }

        /**
         * Add a number of rows to DOM container, and to Photoswipe gallery.
         * If rows are not given, is uses backoffice data or compute according to browser size
         * @param gallery target
         * @param rows
         */
        public addElements(rows: number = null): void {

            let collection = this.collection;

            // display because filters may add more images and we have to show it again
            let nextButton = <HTMLElement> this.rootElement.getElementsByClassName('natural-gallery-next')[0];
            nextButton.style.display = 'block';

            if (this.pswpContainer.length === collection.length ) {
                nextButton.style.display = 'none';

                if (collection.length === 0) {
                    (<HTMLElement> this.rootElement.getElementsByClassName('natural-gallery-noresults')[0]).style.display = 'block';
                    (<HTMLElement> this.rootElement.getElementsByClassName('natural-gallery-images')[0]).style.display = 'none';
                }

                return;
            }

            if (!rows) {
                rows = this.getRowsPerPage(this);
            }

            let nextImage = this.pswpContainer.length;
            let lastRow = this.pswpContainer.length ? collection[nextImage].row + rows : rows;

            // Select next elements, comparing their rows
            for (let i = nextImage; i < collection.length; i++) {
                let item = collection[i];
                if (item.row < lastRow) {
                    this.pswpContainer.push(item.getPswpItem());
                    this.bodyElement.appendChild(item.getElement());
                    item.bindClick();
                    item.flash();
                }

                // Show / Hide "more" button.
                if (this.pswpContainer.length === collection.length) {
                    nextButton.style.display = 'none';
                }
            }

            let noResults = (<HTMLElement> this.rootElement.getElementsByClassName('natural-gallery-noresults')[0]);
            if (noResults) noResults.style.display = 'none';

            let imageContainer = (<HTMLElement> this.rootElement.getElementsByClassName('natural-gallery-images')[0]);
            if (imageContainer) imageContainer.style.display = 'block';

            let galleryVisible = this.rootElement.getElementsByClassName('natural-gallery-visible')[0];
            if (galleryVisible) galleryVisible.textContent = String(this.pswpContainer.length);

            let galleryTotal = this.rootElement.getElementsByClassName('natural-gallery-total')[0];
            if (galleryTotal) galleryTotal.textContent = String(collection.length);
        }

        /**
         * Return number of rows to show per page,
         * If a number of rows are specified in the backoffice, this data is used.
         * If not specified, uses the vertical available space to compute the number of rows to display.
         * There is a letiable in the header of this file to specify the  minimum number of rows for the computation (minNumberOfRowsAtStart)
         * @param gallery
         * @returns {*}
         */
        private getRowsPerPage(gallery) {

            if (this.options.limit) {
                return this.options.limit;
            }

            let winHeight = window.outerHeight;
            let galleryVisibleHeight = winHeight - gallery.bodyElement.offsetTop;
            let nbRows = Math.floor(galleryVisibleHeight / (this.options.rowHeight * 0.7 )); // ratio to be more close from reality average row height

            return nbRows < this.options.minRowsAtStart ? this.options.minRowsAtStart : nbRows;
        }

        /**
         * Check whetever we need to resize a gallery (only if parent container width changes)
         * The keep full rows, it recomputes sizes with new dimension, and reset everything, then add the same number of row. It results in not partial row.
         */
        public resize() {

            let containerWidth = Math.floor(this.bodyElement.getBoundingClientRect().width);

            if (containerWidth != this.bodyWidth) {
                this.bodyWidth = containerWidth;

                Organizer.organize(this);

                let nbRows = this.collection[this.pswpContainer.length - 1].row + 1;
                this.reset();
                this.addElements(nbRows);
            }
        }

        public refresh() {
            this.reset();
            Organizer.organize(this);
            this.addElements();
        }

        /**
         * Empty DOM container and Photoswipe container
         * @param gallery
         */
        public reset(): void {
            this.pswpContainer = [];
            let figures = this.bodyElement.getElementsByTagName('figure');
            for (let i = (figures.length - 1); i >= 0; i--) {
                figures[i].parentNode.removeChild(figures[i]);
            }

            let results = <HTMLElement> this.rootElement.getElementsByClassName('natural-gallery-noresults')[0];
            if (results) {
                results.style.display = 'none';
            }
        }

        get pswpContainer(): any[] {
            return this._pswpContainer;
        }

        set pswpContainer(value: any[]) {
            this._pswpContainer = value;
        }

        get collection(): Item[] {
            return this.header && this.header.isFiltered() ? this.header.collection : this._collection;
        }

        public getOriginalCollection(): Item[] {
            return this._collection;
        }

        set collection(items: Item[]) {
            this._collection = [];
            this.appendItems(items);
        }

        get bodyWidth(): number {
            return this._bodyWidth;
        }

        set bodyWidth(value: number) {
            this._bodyWidth = value;
        }

        get bodyElement(): Element {
            return this._bodyElement;
        }

        set bodyElement(value: Element) {
            this._bodyElement = value;
        }

        get rootElement(): Element {
            return this._rootElement;
        }

        set rootElement(value: Element) {
            this._rootElement = value;
        }

        get pswpApi(): any {
            return this._pswpApi;
        }

        set pswpApi(value: any) {
            this._pswpApi = value;
        }

        get pswpElement(): any {
            return this._pswpElement;
        }

        set pswpElement(value: any) {
            this._pswpElement = value;
        }

        get options(): iGalleryOptions {
            return this._options;
        }

        set options(value: iGalleryOptions) {
            this._options = value;
        }

        get position(): number {
            return this._position;
        }

        set position(value: number) {
            this._position = value;
        }

        get header(): Header {
            return this._header;
        }

        set header(value: Header) {
            this._header = value;
        }

        get categories(): any[] {
            return this._categories;
        }

        set categories(value: any[]) {
            this._categories = value;
        }
    }

}
