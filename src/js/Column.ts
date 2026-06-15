import {Item} from './Item';
import {ModelAttributes} from './galleries/AbstractGallery';

export declare interface ColumnOptions {
    width: number;
    gap: number;
}

export class Column<Model extends ModelAttributes> {
    private readonly _items: Item<Model>[] = [];
    private readonly _elementRef: HTMLElement;
    private _hiddenFromTopCount = 0;
    private _topSpacerHeight = 0;

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

    get topSpacerHeight(): number {
        return this._topSpacerHeight;
    }

    get hiddenFromTopCount(): number {
        return this._hiddenFromTopCount;
    }

    get firstVisibleItem(): Item<Model> | undefined {
        return this._items[this._hiddenFromTopCount];
    }

    public addItem(item: Item<Model>): void {
        this._items.push(item);
    }

    public trimTopItem(): void {
        const item = this._items[this._hiddenFromTopCount];
        if (!item?.rootElement) return;
        item.remove();
        this._topSpacerHeight += item.height + this.options.gap;
        this._hiddenFromTopCount++;
        this._elementRef.style.paddingTop = this._topSpacerHeight + 'px';
    }

    public restoreTopItem(): void {
        if (this._hiddenFromTopCount === 0) return;
        this._hiddenFromTopCount--;
        const item = this._items[this._hiddenFromTopCount];
        this._topSpacerHeight = Math.max(0, this._topSpacerHeight - item.height - this.options.gap);
        this._elementRef.style.paddingTop = this._topSpacerHeight + 'px';
        const nextVisible = this._items[this._hiddenFromTopCount + 1]?.rootElement ?? null;
        this._elementRef.insertBefore(item.rootElement!, nextVisible);
    }
}
