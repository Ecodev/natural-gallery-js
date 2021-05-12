import {Item} from './Item';

export declare interface ColumnOptions {
    width: number;
    gap: number;
}

export class Column {

    private collection: Item[] = [];

    private _elementRef: HTMLElement;

    public constructor(private readonly document: Document, private options: ColumnOptions) {
    }

    public init(): HTMLElement {
        this._elementRef = this.document.createElement('div');
        this._elementRef.classList.add('column');
        this._elementRef.style.marginRight = this.options.gap + 'px';
        this._elementRef.style.width = this.options.width + 'px';
        return this._elementRef;
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
