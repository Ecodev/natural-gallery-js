import {Utility} from '../Utility';
import {AbstractFilter} from './AbstractFilter';

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

        const self = this;

        let input = document.createElement('input');
        input.setAttribute('required', '');
        input.addEventListener('keyup', function(event) {

            let el = <HTMLInputElement> this;

            // On escape key, empty field
            if (event.keyCode === 27) {
                el.value = '';
            }

            self.filter(el.value);
        });

        return input;
    }

    public filter(val: string): void {

        this.collection = null; // set filter inactive

        let term = Utility.removeDiacritics(val).toLowerCase();

        if (term.length > 0) {

            this.collection = []; // filter is active, and at least empty !
            this.header.gallery.getOriginalCollection().forEach(
                function(item) {
                    let needle = Utility.removeDiacritics(item.title + ' ' + (item.description ? item.description : '')).toLowerCase();
                    if (needle.search(term) !== -1) {
                        this.collection.push(item);
                    }
                },
                this);

        }

        this.header.filter();
    }

}
