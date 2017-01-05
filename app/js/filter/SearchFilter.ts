module Natural.Gallery {

    export class SearchFilter extends AbstractFilter {

        public render(): HTMLElement {

            let element = document.createElement('div');
            Utility.addClass(element, 'natural-gallery-searchTerm sectionContainer');
            element.appendChild(Utility.getIcon('icon-search'));
            element.appendChild(this.getInput());

            let label = document.createElement('label');
            Utility.addClass(label, 'sectionName');
            label.textContent = 'Search';
            element.appendChild(label);

            let bar = document.createElement('span');
            Utility.addClass(bar, 'bar');
            element.appendChild(bar);

            return element;
        }

        private getInput(): HTMLElement {

            let self = this;

            let input = document.createElement('input');
            input.setAttribute('required', '');
            input.addEventListener('keyup', function(event) {

                // On escape, empty field
                if (event.keyCode == 27) {
                    this.value = '';
                }

                self.filter(this.value);
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
