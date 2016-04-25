module Natural.Gallery {

    export class Header {

        /**
         * Complete collection of filtered elements
         * Contains null or array
         * Null means no selection is active
         * Array means a selection is active, even if array is empty. Render empty
         * @type {Array}
         */
        private _collection: Item[] = null;

        private _element: JQuery;

        private _filters: AbstractFilter[] = [];

        private _gallery: Gallery;

        /**
         * CONSTRUCTOR
         * @param gallery
         */
        public constructor(gallery: Gallery) {
            this.gallery = gallery;
        }

        public addFilter(filter: AbstractFilter): void {
            this.filters.push(filter);
        }

        public refresh():void {
            _.each(this.filters, function(filter) {
                filter.render();
            });
        }

        public render(): JQuery {

            let self = this;

            let imagesLayout = $('<div></div>')
                .addClass('natural-gallery-images sectionContainer')
                .append(Utility.getIcon('icon-pict'))
                .append($('<div></div>').addClass('sectionName').text('Images'))
                .append($('<span></span>').addClass('natural-gallery-visible'))
                .append($('<span></span>').text('/'))
                .append($('<span></span>').addClass('natural-gallery-total'));

            this.element = $('<div></div>');

            _.each(this.filters, function(filter) {
                self.element.append(filter.render());
            });

            this.element
                .addClass('natural-gallery-header')
                .append(imagesLayout);

            return this.element;
        }

        public isFiltered(): boolean {
            return !_.isNull(this.collection);
        }

        /**
         * Filter first by term, then by categories
         * @param gallery
         */
        public filter(): void {

            let filteredCollections = null;

            _.each(this.filters, function(filter: AbstractFilter) {
                if (filter.isActive()) {
                    if (_.isNull(filteredCollections)) {
                        filteredCollections = filter.collection
                    } else {
                        filteredCollections = _.intersectionBy(filteredCollections, filter.collection, 'id');
                    }
                }
            });

            this.collection = filteredCollections; // @todo : do some intelligent things here
            this.gallery.refresh();
        }

        get collection(): Item[] {
            return this._collection;
        }

        set collection(value: Item[]) {
            this._collection = value;
        }

        get element(): JQuery {
            return this._element;
        }

        set element(value: JQuery) {
            this._element = value;
        }

        get gallery(): Natural.Gallery.Gallery {
            return this._gallery;
        }

        set gallery(value: Natural.Gallery.Gallery) {
            this._gallery = value;
        }

        get filters(): AbstractFilter[] {
            return this._filters;
        }

        set filters(value: AbstractFilter[]) {
            this._filters = value;
        }
    }
}
