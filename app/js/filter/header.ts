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

        private filters: AbstractFilter[];

        private _gallery: Gallery;

        /**
         * CONSTRUCTOR
         * @param gallery
         */
        public constructor(gallery: Gallery) {
            this._gallery = gallery;
        }

        public addFilter(filter: AbstractFilter): void {
            this.filters.push(filter);
            this.element.append(filter.render());
        }

        public render(): JQuery {

            let imagesLayout = $('<div></div>')
                .addClass('natural-gallery-images sectionContainer')
                .append(Utility.getIcon('icon-pict'))
                .append($('<div></div>').addClass('sectionName').text('Images'))
                .append($('<span></span>').addClass('natural-gallery-visible'))
                .append($('<span></span>').text('/'))
                .append($('<span></span>').addClass('natural-gallery-total'));

            let headerLayout = $('<div></div>')
                .addClass('natural-gallery-header')
                .append(imagesLayout);

            return headerLayout;
        }

        public isFiltered(): boolean {
            return !_.isNull(this.collection);
        }

        /**
         * Filter first by term, then by categories
         * @param gallery
         */
        private filter(): Item[] {

            let filteredCollections = [];
            _.each(this.filters, function(filter: AbstractFilter) {
                filteredCollections.push(filter.filter());
            });

            this.collection = filteredCollections[0]; // @todo : do some intelligent things here
            return this.collection;
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
    }
}
