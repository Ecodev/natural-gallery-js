import {Item} from './Item';
import {ModelAttributes} from './galleries/AbstractGallery';

export declare interface ColumnOptions {
    width: number;
    gap: number;
}

export class Column<Model extends ModelAttributes> {

    private readonly collection: Item<Model>[] = [];

    private readonly _elementRef: HTMLElement;

    public constructor(document: Document, private options: ColumnOptions) {
        this._elementRef = document.createElement('div');
        this._elementRef.classList.add('column');
        this._elementRef.style.marginRight = this.options.gap + 'px';
        this._elementRef.style.width = this.options.width + 'px';
    }

    public addItem(item: Item<Model>): void {
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
