module Natural.Gallery {

    export class CategoryFilter extends AbstractFilter {

        public render(): JQuery {

            let element = $('<div></div>')
                .addClass('natural-gallery-categories sectionContainer')
                .append($('<div></div>').addClass('sectionName').text('Catégories'));

            return element;
        }

        private bindEvents() {

            let self = this;

            /**
             * On category checkboxes change
             */
            this.header.gallery.rootElement.find('.natural-gallery-categories input').on('change', function() {
                self.filter();
            });
        }

        public filter(): Item[] {

            let selectedCategories = this.getSelectedCategories();

            // if no categories at all on this.header.gallery, return all images to avoid any filter on it by categories
            if (selectedCategories === null) {
                this.collection = this.header.gallery.collection;
            }

            // if there are categories, but they are not selected, return no images
            if (selectedCategories.length === 0) {
                this.collection = [];
            }

            let filteredImages = [];
            for (let i = 0; i < this.header.gallery.collection.length; i++) {
                let image = this.header.gallery.collection[i];
                let categories = this.getImageCategories(image);

                // If not categories, don't filter, add to elements to consider
                if (categories.length === 0 && selectedCategories.indexOf("none") != -1) {
                    filteredImages.push(image);

                } else if (categories.length > 0) {
                    // Set image as responding to filter if at least one category is found
                    for (let j = 0; j < image.categories.length; j++) {
                        let category = image.categories[j];
                        if (selectedCategories.indexOf(category) >= 0) {
                            filteredImages.push(image);
                            break;
                        }
                    }
                }
            }

            this.collection = filteredImages;
            return filteredImages;
        }

        private getSelectedCategories() {

            // Create an array with id of each selected categories

            let inputs = this.header.gallery.rootElement.find('.natural-gallery-categories input');

            if (inputs.length === 0) {
                return null;
            }

            let selectedCategories = [];
            this.header.gallery.rootElement.find('.natural-gallery-categories input:checked').each(function() {
                selectedCategories.push($(this).parent().data('id'));
            });

            return selectedCategories;
        }

        //private cleanCategories(gallery) {
        //
        //    let vm = this;
        //    let categoriesCount = {};
        //
        //    _.each(gallery.images, function(image) {
        //        let categories = vm.getImageCategories(image);
        //
        //        // Create list of used categories
        //        if (categories.length == 0) {
        //            categoriesCount['none'] = null;
        //            return true;
        //        }
        //
        //        _.each(categories, function(category, j) {
        //            categoriesCount[image.categories[j]] = null;
        //        });
        //    });
        //
        //    // Hide unsused categories
        //    this.header.gallery.rootElement.find('.natural-gallery-categories label').each(function() {
        //        let el = $(this);
        //        let catId = el.data('id');
        //
        //        if (typeof categoriesCount[catId] == 'undefined') {
        //            el.remove();
        //        }
        //    });
        //
        //}

        // peut etre dans imge
        private getImageCategories(image) {

            if (typeof image.categories == 'undefined') {
                return [];
            }

            if (image.categories.constructor !== Array) {
                return [];
            }

            return image.categories;
        }
    }
}
