import {Item} from './Item';
import {ModelAttributes} from './galleries/AbstractGallery';
import {setChildren} from './Utility';

export declare interface ColumnOptions {
    width: number;
    gap: number;
}

export class Column<Model extends ModelAttributes> {
    private readonly _items: Item<Model>[] = [];
    private readonly _elementRef: HTMLElement;
    private _hiddenFromTopCount = 0;
    private _topSpacerHeight = 0;
    private _hiddenFromBottomCount = 0;
    private _bottomSpacerHeight = 0;
    private _totalHeight = 0;

    /**
     * @param mountItem Returns the root element of given item, created the first time the item is mounted
     */
    public constructor(
        document: Document,
        private options: ColumnOptions,
        private readonly mountItem: (item: Item<Model>) => HTMLElement = item => item.rootElement!,
    ) {
        this._elementRef = document.createElement('div');
        this._elementRef.classList.add('column');
        this._elementRef.style.width = this.options.width + 'px';
        this._elementRef.style.gap = this.options.gap + 'px';
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

    get bottomSpacerHeight(): number {
        return this._bottomSpacerHeight;
    }

    get hiddenFromBottomCount(): number {
        return this._hiddenFromBottomCount;
    }

    get totalHeight(): number {
        return this._totalHeight;
    }

    get hasVisibleItems(): boolean {
        return this._hiddenFromTopCount + this._hiddenFromBottomCount < this._items.length;
    }

    get items(): readonly Item<Model>[] {
        return this._items;
    }

    get firstVisibleItem(): Item<Model> | undefined {
        return this._items[this._hiddenFromTopCount];
    }

    get lastVisibleItem(): Item<Model> | undefined {
        return this._items[this._items.length - this._hiddenFromBottomCount - 1];
    }

    public addItem(item: Item<Model>): void {
        this._items.push(item);
        this._totalHeight += item.height + this.options.gap;
    }

    /**
     * Sum of height+gap of every item before given index. Pure JS, no DOM read.
     */
    public cumulativeHeightBefore(index: number): number {
        let sum = 0;
        for (let i = 0; i < index; i++) {
            sum += this._items[i].height + this.options.gap;
        }
        return sum;
    }

    /**
     * Mount the first given number of items, and keep the following items out of the DOM without any spacer. Used
     * with rowsPerPage, where the following items stay hidden until the next button is clicked.
     */
    public mountFirstItems(count: number): void {
        this._hiddenFromTopCount = 0;
        this._topSpacerHeight = 0;
        this._hiddenFromBottomCount = this._items.length - count;
        this._bottomSpacerHeight = 0;
        this._elementRef.style.paddingTop = '0';
        this._elementRef.style.paddingBottom = '0';
        setChildren(
            this._elementRef,
            this._items.slice(0, count).map(item => this.mountItem(item)),
        );
    }

    /**
     * Mount only the items whose [top, bottom] intersects [viewportTop, viewportBottom], and fold every other item
     * into the top or bottom spacer, so that the column keeps the height of all its items. The item positions come
     * from the item heights alone, with no DOM read, and the DOM is touched once at the end. The mount state is
     * computed again from scratch, which suits a resize, where the item sizes change. Existing root elements are
     * reused, so the images neither reload nor flicker.
     */
    public mountVisibleWindow(viewportTop: number, viewportBottom: number, galleryTop: number): void {
        let cumulative = 0;
        let topSpacer = 0;
        let bottomSpacer = 0;
        let hiddenTop = 0;
        let hiddenBottom = 0;
        const visible: Item<Model>[] = [];

        for (const item of this._items) {
            const itemTop = cumulative;
            const itemBottom = cumulative + item.height;
            cumulative = itemBottom + this.options.gap;

            if (galleryTop + itemBottom < viewportTop) {
                hiddenTop++;
                topSpacer += item.height + this.options.gap;
            } else if (galleryTop + itemTop > viewportBottom) {
                hiddenBottom++;
                bottomSpacer += item.height + this.options.gap;
            } else {
                visible.push(item);
            }
        }

        this._totalHeight = cumulative;
        this._hiddenFromTopCount = hiddenTop;
        this._topSpacerHeight = topSpacer;
        this._hiddenFromBottomCount = hiddenBottom;
        this._bottomSpacerHeight = bottomSpacer;
        this._elementRef.style.paddingTop = topSpacer + 'px';
        this._elementRef.style.paddingBottom = bottomSpacer + 'px';
        setChildren(
            this._elementRef,
            visible.map(item => this.mountItem(item)),
        );
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
        this._elementRef.insertBefore(this.mountItem(item), this._elementRef.firstChild);
    }

    public trimBottomItem(): void {
        const item = this.lastVisibleItem;
        if (!item?.rootElement) return;
        item.remove();
        this._bottomSpacerHeight += item.height + this.options.gap;
        this._hiddenFromBottomCount++;
        this._elementRef.style.paddingBottom = this._bottomSpacerHeight + 'px';
    }

    public restoreBottomItem(): void {
        if (this._hiddenFromBottomCount === 0) return;
        this._hiddenFromBottomCount--;
        const item = this._items[this._items.length - this._hiddenFromBottomCount - 1];
        this._bottomSpacerHeight = Math.max(0, this._bottomSpacerHeight - item.height - this.options.gap);
        this._elementRef.style.paddingBottom = this._bottomSpacerHeight + 'px';
        this._elementRef.appendChild(this.mountItem(item));
    }
}
