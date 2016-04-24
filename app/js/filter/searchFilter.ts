module Natural.Gallery {

    export class SearchFilter extends AbstractFilter {

        private lastSearch: string;

        public render(): JQuery {

            let element = $('<div></div>')
                .addClass('natural-gallery-searchTerm sectionContainer')
                .append(Utility.getIcon('icon-search'))
                .append($('<input type="text" required/>').on('keydown', this.search))
                .append($('<label></label>').addClass('sectionName'))
                .append($('<span></span>').addClass('bar'));

            return element;
        }

        private search():void {
            console.log('type');
        }

        private bindEvents() {

            let self = this;

            /**
             * Attach event to the search field
             */
            $('.natural-gallery-searchTerm input[type="text"]').on('keydown', function(event) {

                // On escape, empty field
                if (event.keyCode == 27) {
                    $(this).val('');
                }

                if (self.lastSearch != $(this).val()) {
                    self.lastSearch = $(this).val();
                    self.filter();
                }

            }).on('blur', function() {
                if (self.lastSearch != $(this).val()) {
                    self.lastSearch = $(this).val();
                    self.filter();
                }
            });
        }

        public filter(): Item[] {

            let term = Utility.removeDiacritics(this.header.gallery.rootElement.find('.natural-gallery-searchTerm input').val()).toLowerCase();

            // show all if empty
            if (term.length === 0) {
                this.collection = [];
            } else {
                for (let i = 0; i < this.header.gallery.collection.length; i++) {
                    let image = this.header.gallery.collection[i];
                    let needle = Utility.removeDiacritics(image.title + " " + (image.description ? image.description : '')).toLowerCase();

                    if (needle.search(term) != -1) {
                        this.collection.push(image);
                    }
                }
            }

            return this.collection;
        }

    }
}
