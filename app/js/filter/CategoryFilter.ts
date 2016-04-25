module Natural.Gallery {

    export class CategoryFilter extends AbstractFilter {
        get element(): JQuery {
            return this._element;
        }

        set element(value: JQuery) {
            this._element = value;
        }

        private _categories: Category[] = [];

        private _element: JQuery;

        public constructor(protected header: Header) {
            super(header);
        }

        public render(): JQuery {

            let self = this;
            this.prepare();

            if (!this.element) {
                this.element = $('<div></div>')
                    .addClass('natural-gallery-categories sectionContainer')
                    .append($('<div></div>').addClass('sectionName').text('Categories'));
            }

            this.element.find('label').remove();

            _.each(this.categories, function(cat: Category) {
                self.element.append(cat.render());
            });

            return self.element;
        }

        public prepare(): void {

            let self = this;
            let galleryCategories = [];
            _.each(this.header.gallery.categories, function(cat) {
                galleryCategories.push(new Category(cat.id, cat.title, self));
            });

            let itemCategories = [];
            _.each(this.header.gallery.getOriginalCollection(), function(item) {
                _.each(item.categories, function(cat) {
                    itemCategories.push(new Category(cat.id, cat.title, self));
                });
            });

            galleryCategories = _.uniqBy(galleryCategories, 'id');
            itemCategories = _.uniqBy(itemCategories, 'id');

            if (galleryCategories.length) {
                this.categories = _.intersectionBy(galleryCategories, itemCategories, 'id');
            } else {
                this.categories = itemCategories;
            }
        }

        public filter(): void {

            let selectedCategories = _.filter(this.categories, function(cat) {
                return cat.isActive;
            });

            // if filter inactive
            if (selectedCategories.length === this.categories.length) {
                this.collection = null;
            } else if (selectedCategories.length === 0) {
                this.collection = [];
            } else {

                let filteredItems = [];

                _.each(this.header.gallery.getOriginalCollection(), function(item) {
                    if (!item.categories || item.categories && item.categories.length === 0) {
                        // if no categories
                    } else {
                        _.each(item.categories, function(cat: Category) {
                            if (_.find(selectedCategories, {'id': cat.id})) {
                                filteredItems.push(item);
                                return false;
                            }
                        });
                    }
                });

                this.collection = filteredItems;
            }

            this.header.filter();
        }

        // peut etre dans imge
        private getImageCategories(image) {

            if (typeof image._categories == 'undefined') {
                return [];
            }

            if (image._categories.constructor !== Array) {
                return [];
            }

            return image._categories;
        }

        get categories(): Category[] {
            return this._categories;
        }

        set categories(value: Category[]) {
            this._categories = value;
        }

    }
}
