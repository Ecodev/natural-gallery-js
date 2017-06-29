import {Utility} from '../Utility';
import {AbstractFilter} from './AbstractFilter';

    export class Category {

        private _id: number;

        private _title: string;

        private _isActive: boolean = true;

        private _element: HTMLElement;

        public constructor(id: number, title: string, private filter?: AbstractFilter) {
            this.id = id;
            this.title = title;
        }

        public render(): HTMLElement {

            const self = this;

            this.element = document.createElement('label');
            let input = document.createElement('input');
            input.setAttribute('type', 'checkbox');
            input.setAttribute('checked', 'checked');
            input.addEventListener('change', function() {
                self.isActive = !self.isActive;
                self.filter.filter();
            });

            this.element.appendChild(input);

            let title = document.createElement('span');
            title.textContent = this.title;

            let label = document.createElement('span');
            Utility.addClass(label, 'label');
            label.appendChild(Utility.getIcon('icon-category'));
            label.appendChild(title);

            this.element.appendChild(label);

            let bar = document.createElement('span');
            Utility.addClass(bar, 'bar');
            this.element.appendChild(bar);

            return this.element;
        }

        get id(): number {
            return this._id;
        }

        set id(value: number) {
            this._id = value;
        }

        get title(): string {
            return this._title;
        }

        set title(value: string) {
            this._title = value;
        }

        get isActive(): boolean {
            return this._isActive;
        }

        set isActive(value: boolean) {
            this._isActive = value;
        }

        get element(): HTMLElement {
            return this._element;
        }

        set element(value: HTMLElement) {
            this._element = value;
        }
    }


