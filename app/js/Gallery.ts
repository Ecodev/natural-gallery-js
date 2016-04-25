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
        showCount : boolean;
        searchFilter : boolean;
        categoriesFilter : boolean;
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
            margin: 5,
            limit: 0,
            showLabels: 'hover',
            lightbox: true,
            minRowsAtStart: 2,
            showCount: false,
            searchFilter: false,
            categoriesFilter: false
        };

        /**
         * Nth gallery on document
         * Used to select root element and then body element
         */
        private _position: number;

        /**
         * Root div containing the gallery
         */
        private _rootElement: JQuery;

        /**
         * Images wrapper container
         */
        private _bodyElement: JQuery;

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
         * @param pswp
         */
        public constructor(position, options, pswp: any) {

            this.pswpElement = pswp;

            this._options = <iGalleryOptions> _.defaults(options, this._options);
            this.position = position;

            this.rootElement = $($('.natural-gallery').get(this.position));

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
            this.bodyWidth = Math.floor(this.bodyElement[0].getBoundingClientRect().width);

        }

        public render() {

            let self = this;

            let noResults = $('<div></div>').addClass('natural-gallery-noresults').append(Utility.getIcon('icon-noresults'));
            let nextButton = $('<div></div>').addClass('natural-gallery-next').append(Utility.getIcon('icon-next')).on('click', function(e) {
                e.preventDefault();
                self.addElements();
            });

            this.bodyElement = $('<div></div>').addClass('natural-gallery-body').append(noResults);

            if (this.header) {
                this.rootElement.append(this.header.render());
            }

            this.rootElement
                .append(this.bodyElement)
                .append(nextButton);

        }

        /**
         * Initialize items
         * @param items
         */
        public appendItems(items): void {

            let self = this;
            let display = false;

            // if first addition of items, add them to container for display
            if (this.collection.length === 0) {
                display = true;
            }

            // Complete collection
            _.each(items, function(item) {
                self.collection.push(new Item(<IItemFields> item, self));
            });

            // Compute sizes
            Organizer.organize(this);

            if (display) {
                this.addElements();
            }
        }

        public style(): void {
            _.each(this.collection, function(item: Item) {
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

            let nextButton = this.rootElement.find('.natural-gallery-next');
            nextButton.show(); // display because filters may add more images and we have to show it again

            if (this.pswpContainer.length === collection.length || !collection.length) {
                nextButton.hide();
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
                    this.bodyElement.append(item.getElement());
                    item.flash();
                }

                // Show / Hide "more" button.
                if (this.pswpContainer.length === collection.length) {
                    nextButton.hide();
                }
            }

            this.rootElement.find('.natural-gallery-noresults').hide();
            this.rootElement.find('.natural-gallery-visible').text(this.pswpContainer.length);
            this.rootElement.find('.natural-gallery-total').text(collection.length);
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

            let winHeight = $(window).height();
            let galleryVisibleHeight = winHeight - gallery.bodyElement.offset().top;
            let nbRows = Math.floor(galleryVisibleHeight / (this.options.rowHeight * 0.7 )); // ratio to be more close from reality average row height

            return nbRows < this.options.minRowsAtStart ? this.options.minRowsAtStart : nbRows;
        }

        /**
         * Check whetever we need to resize a gallery (only if parent container width changes)
         * The keep full rows, it recomputes sizes with new dimension, and reset everything, then add the same number of row. It results in not partial row.
         */
        public resize() {

            let containerWidth = Math.floor(this.bodyElement[0].getBoundingClientRect().width);

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
            this.bodyElement.find('figure').remove();
            this.rootElement.find('.natural-gallery-noresults').show();
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

        get bodyElement(): JQuery {
            return this._bodyElement;
        }

        set bodyElement(value: JQuery) {
            this._bodyElement = value;
        }

        get rootElement(): JQuery {
            return this._rootElement;
        }

        set rootElement(value: JQuery) {
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
    }

}
