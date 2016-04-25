module Natural.Gallery {

    export class CategoryFilter extends AbstractFilter {

        set element(value: JQuery) {
            this._element = value;
        }

        private _categories: Category[] = [];

        private _element: JQuery;

        private _none: Category;
        private _others: Category;

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

            self.none = new Category(-1, 'None');
            self.others = new Category(-2, 'Others');

            let itemCategories = [];
            _.each(this.header.gallery.getOriginalCollection(), function(item: Item) {

                // Set category "none"
                if (!item.categories || item.categories && item.categories.length === 0 && self.header.gallery.options.showNone) {
                    item.categories = [self.none];
                }

                _.each(item.categories, function(cat) {
                    itemCategories.push(new Category(cat.id, cat.title, self));
                });
            });

            // If show unclassified
            if (this.header.gallery.options.showNone && galleryCategories.length) {
                galleryCategories.push(self.none);
            }

            galleryCategories = _.uniqBy(galleryCategories, 'id');
            itemCategories = _.uniqBy(itemCategories, 'id');

            if (galleryCategories.length) {
                this.categories = _.intersectionBy(galleryCategories, itemCategories, 'id');
            } else {
                this.categories = itemCategories;
            }

        }

        public filter(): void {

            let self = this;

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
                        if (self.none) {
                            filteredItems.push(item);
                        }
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

        get others(): Natural.Gallery.Category {
            return this._others;
        }

        set others(value: Natural.Gallery.Category) {
            this._others = value;
        }

        get none(): Natural.Gallery.Category {
            return this._none;
        }

        set none(value: Natural.Gallery.Category) {
            this._none = value;
        }

        get element(): JQuery {
            return this._element;
        }

    }
}
