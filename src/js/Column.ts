import {Item} from './Item';

export declare interface ColumnOptions {
    width: number;
    gap: number;
}

export class Column {

    private readonly collection: Item[] = [];

    private readonly _elementRef: HTMLElement;

    public constructor(document: Document, private options: ColumnOptions) {
        this._elementRef = document.createElement('div');
        this._elementRef.classList.add('column');
        this._elementRef.style.marginRight = this.options.gap + 'px';
        this._elementRef.style.width = this.options.width + 'px';
    }

    public addItem(item: Item): void {
        this.collection.push(item);
    }

    get height(): number {
        return this._elementRef.offsetHeight;
    }

    get length(): number {
        return this.collection.length;
    }

    get elementRef(): HTMLElement {
        return this._elementRef;
    }

}
