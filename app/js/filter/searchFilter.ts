module Natural.Gallery {

    export class SearchFilter extends AbstractFilter {

        public render(): JQuery {

            let element = $('<div></div>')
                .addClass('natural-gallery-searchTerm sectionContainer')
                .append(Utility.getIcon('icon-search'))
                .append(this.getInput())
                .append($('<label></label>').addClass('sectionName').text('Search'))
                .append($('<span></span>').addClass('bar'));

            return element;
        }

        private getInput(): JQuery {

            let self = this;

            let input = $('<input type="text" required/>').on('keyup', function(event) {

                // On escape, empty field
                if (event.keyCode == 27) {
                    $(this).val('');
                }

                self.filter($(this).val());
            });

            return input;
        }

        public filter(val: string): void {

            let self = this;

            this.collection = null; // set filter inactive

            let term = Utility.removeDiacritics(val).toLowerCase();

            if (term.length > 0) {

                self.collection = []; // filter is active, and at least empty !
                _.each(this.header.gallery.getOriginalCollection(), function(item) {
                    let needle = Utility.removeDiacritics(item.title + " " + (item.description ? item.description : '')).toLowerCase();
                    if (needle.search(term) != -1) {
                        self.collection.push(item);
                    }
                });
            }

            this.header.filter();
        }

    }
}
