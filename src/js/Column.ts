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
    private _hiddenFromBottomCount = 0;
    private _bottomSpacerHeight = 0;
    private _totalHeight = 0;

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
     * Mount every item with no hidden/spacer state. Used when the viewport height isn't known yet (no scroll event
     * has fired), where virtualizing would be incorrect since we don't know what's actually visible.
     */
    public mountAll(): void {
        this._elementRef.innerHTML = '';
        this._hiddenFromTopCount = 0;
        this._topSpacerHeight = 0;
        this._hiddenFromBottomCount = 0;
        this._bottomSpacerHeight = 0;
        this._elementRef.style.paddingTop = '0';
        this._elementRef.style.paddingBottom = '0';
        this._items.forEach(item => this._elementRef.appendChild(item.rootElement!));
    }

    /**
     * Pure analytical relayout: mount only items whose [top, bottom] intersects [viewportTop, viewportBottom],
     * reusing existing rootElement nodes (never recreated). Replaces the entire mount state in one pass, used after
     * a resize where item sizes have changed and the previous mount state no longer applies.
     *
     * "Mounting" an item means putting its element on the page so it's actually visible. An item that isn't
     * mounted isn't deleted — it's just kept off the page, and its height is folded into a block of empty space
     * (a "spacer") instead, so the column still takes up the right amount of room without the browser having to
     * deal with elements nobody can see.
     *
     * To decide who gets mounted, we go through every item once, top to bottom, and re-decide the whole thing
     * from scratch rather than patching what changed. We never ask the browser where an item is — we just add up
     * heights as we go, so by the time we reach an item we already know where it starts and ends.
     *
     * For each item, the question is simply: does it fall inside the window we care about?
     *   - yes -> mount it
     *   - no, and nothing has been mounted yet -> it's above the window, fold it into the top spacer
     *   - no, but something has already been mounted -> it's below the window, fold it into the bottom spacer
     * Because the list is already top to bottom, that's enough to know which spacer it belongs to — we never
     * have to check both directions.
     *
     * Only once every item has been sorted this way do we actually touch the DOM: clear the column, set the two
     * spacers, then put the mounted items back. We reuse their existing elements instead of recreating them,
     * otherwise every image would reload and flicker each time this runs.
     */
    public mountVisibleWindow(viewportTop: number, viewportBottom: number, galleryTop: number): void {
        this._elementRef.innerHTML = ''; // wiped once up front, items get put back at the very end

        let cumulative = 0; // how much height we've gone through so far — doubles as "where the next item starts"
        let topSpacer = 0;
        let bottomSpacer = 0;
        let hiddenTop = 0;
        let hiddenBottom = 0;
        let mountedAny = false; // true as soon as we've crossed into the window — tells us which side we're on
        const visible: Item<Model>[] = [];

        for (const item of this._items) {
            const itemTop = cumulative;
            const itemBottom = cumulative + item.height;
            cumulative = itemBottom + this.options.gap; // move the running total forward before deciding this one

            const isVisible = galleryTop + itemBottom >= viewportTop && galleryTop + itemTop <= viewportBottom;

            if (isVisible) {
                visible.push(item);
                mountedAny = true;
            } else if (!mountedAny) {
                // haven't reached the window yet, so this one is above it
                hiddenTop++;
                topSpacer += item.height + this.options.gap;
            } else {
                // already went through the window, so this one is below it
                hiddenBottom++;
                bottomSpacer += item.height + this.options.gap;
            }
        }

        // everything above is just bookkeeping in memory — the DOM only gets touched now, all at once
        this._totalHeight = cumulative;
        this._hiddenFromTopCount = hiddenTop;
        this._topSpacerHeight = topSpacer;
        this._hiddenFromBottomCount = hiddenBottom;
        this._bottomSpacerHeight = bottomSpacer;
        this._elementRef.style.paddingTop = topSpacer + 'px';
        this._elementRef.style.paddingBottom = bottomSpacer + 'px';
        visible.forEach(item => this._elementRef.appendChild(item.rootElement!));
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
        this._elementRef.appendChild(item.rootElement!);
    }
}
