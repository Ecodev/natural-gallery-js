import {Item} from './Item';
import {ModelAttributes} from './galleries/AbstractGallery';

export declare interface ColumnOptions {
    width: number;
    gap: number;
}

export class Column<Model extends ModelAttributes> {
    private readonly collection: Item<Model>[] = [];

    private readonly _elementRef: HTMLElement;

    public constructor(
        document: Document,
        private options: ColumnOptions,
    ) {
        this._elementRef = document.createElement('div');
        this._elementRef.classList.add('column');
        this._elementRef.style.width = this.options.width + 'px';
        this._elementRef.style.gap = this.options.gap + 'px';
    }

    get height(): number {
        return this._elementRef.offsetHeight;
    }

    get elementRef(): HTMLElement {
        return this._elementRef;
    }

    public addItem(item: Item<Model>): void {
        this.collection.push(item);
    }
}
