module Natural.Gallery {

    export class Category {

        private _id: number;

        private _title: string;

        private _isActive: boolean = true;

        private _element: JQuery;

        public constructor(id: number, title: string, private filter?: AbstractFilter) {
            this.id = id;
            this.title = title;
        }

        public render(): JQuery {

            let self = this;

            this.element = $('<label></label>')
                .attr('data-id', this.id)
                .append($('<input>')
                    .attr('type', 'checkbox')
                    .attr('checked', 'checked')
                    .on('change', function() {
                        self.isActive = !self.isActive;
                        self.filter.filter();
                    }))
                .append($('<span></span>')
                    .addClass('label')
                    .append(Utility.getIcon('icon-category'))
                    .append($('<span></span>').text(this.title)))
                .append($('<span></span>').addClass('bar'));

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

        get element(): JQuery {
            return this._element;
        }

        set element(value: JQuery) {
            this._element = value;
        }
    }

}
