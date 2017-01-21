module Natural.Gallery {

    export class CategoryFilter extends AbstractFilter {

        set element(value: HTMLElement) {
            this._element = value;
        }

        private _categories: Category[] = [];

        private _element: HTMLElement;

        private _none: Category;
        private _others: Category;

        public constructor(protected header: Header) {
            super(header);
        }

        public render(): HTMLElement {

            this.prepare();

            if (!this.element) {
                this.element = document.createElement('div');
                Utility.addClass(this.element, 'natural-gallery-categories sectionContainer');

                let sectionName = document.createElement('div');
                Utility.addClass(sectionName, 'sectionName');
                sectionName.textContent = 'Categories';
                this.element.appendChild(sectionName);
            }

            let label = this.element.getElementsByTagName('label')[0];
            if (label) {
                label.parentNode.removeChild(label);
            }

            this.categories.forEach(function(cat: Category) {
                this.element.appendChild(cat.render());
            }, this);

            return this.element;
        }

        public prepare(): void {

            let galleryCategories = [];
            this.header.gallery.categories.forEach(function(cat) {
                galleryCategories.push(new Category(cat.id, cat.title, this));
            }, this);

            this.none = new Category(-1, 'None', this);
            this.others = new Category(-2, 'Others', this);

            // If show unclassified
            if (this.header.gallery.options.showNone && galleryCategories.length) {
                galleryCategories.push(this.none);
            }

            // If show others and there are main categories
            if (this.header.gallery.options.showOthers && galleryCategories.length) {
                galleryCategories.push(this.others);
            }

            let itemCategories = [];
            this.header.gallery.getOriginalCollection().forEach(function(item: Item) {

                // Set category "none" if empty
                if (!item.categories || item.categories && item.categories.length === 0 && this.header.gallery.options.showNone) {
                    item.categories = [this.none];
                }

                // Set category "others" if none of categories are used in gallery categories
                if (galleryCategories.length && Utility.differenceBy(item.categories, galleryCategories, 'id').length === item.categories.length && this.header.gallery.options.showOthers) {
                    item.categories = [this.others];
                }

                // Assign categories as object
                item.categories.forEach(function(cat) {
                    itemCategories.push(new Category(cat.id, cat.title, this));
                }, this);

            }, this);

            // Avoid duplicates
            galleryCategories = Utility.uniqBy(galleryCategories, 'id');
            itemCategories = Utility.uniqBy(itemCategories, 'id');

            if (galleryCategories.length) {
                this.categories = Utility.intersectionBy(galleryCategories, itemCategories, 'id');
            } else {
                this.categories = itemCategories;
            }

        }

        public filter(): void {

            let selectedCategories = this.categories.filter(function(cat) {
                return cat.isActive;
            });

            if (selectedCategories.length === this.categories.length) {
                // if all categories are selected
                this.collection = null;

            } else if (selectedCategories.length === 0) {
                // if no category is selected
                this.collection = [];

            } else {

                let filteredItems = [];

                this.header.gallery.getOriginalCollection().forEach(function(item) {
                    if (!item.categories || item.categories && item.categories.length === 0) {
                        if (this.none) {
                            filteredItems.push(item);
                        }
                    } else {
                        item.categories.some(function(cat1: Category) {
                            let found = selectedCategories.some(function(cat2: Category) {
                                return cat1.id === cat2.id;
                            });
                            if (found) {
                                filteredItems.push(item);
                                return true;
                            }
                        });
                    }
                }, this);

                this.collection = filteredItems;
            }

            this.header.filter();
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

        get element(): HTMLElement {
            return this._element;
        }

    }
}
