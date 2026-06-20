import {Column} from '../Column';
import {Item} from '../Item';
import {getImageRatioAndIfCropped, RatioLimits} from '../Utility';
import {AbstractGallery, GalleryOptions, ModelAttributes} from './AbstractGallery';

export interface MasonryGalleryOptions extends GalleryOptions {
    columnWidth: number;
    ratioLimit?: RatioLimits;
}

export class Masonry<Model extends ModelAttributes = ModelAttributes> extends AbstractGallery<Model> {
    /**
     * Options after having been defaulted
     */
    declare protected options: Required<MasonryGalleryOptions>;

    /**
     * Regroup the list of columns
     */
    protected columns: Column<Model>[] = [];

    constructor(elementRef: HTMLElement, options: MasonryGalleryOptions, scrollElementRef?: HTMLElement | null) {
        super(elementRef, options, scrollElementRef);

        if (!options.columnWidth || options.columnWidth <= 0) {
            throw new Error('Option.columnWidth must be positive');
        }

        this.addColumns();

        /**
         * Setup scroll detection to prevent empty zones due to different heights
         */
        if (!this.options.infiniteScrollOffset) {
            let ratio = 0.5; // Portrait format to maximize estimated height

            // Better prediction using ratio if provided
            if (this.options.ratioLimit && this.options.ratioLimit.min) {
                ratio = this.options.ratioLimit.min;
            }

            const columnWidth = this.getColumnWidth();
            this.options.infiniteScrollOffset = (-1 * columnWidth) / ratio;
        }
    }

    /**
     * Compute sides with 1:1 ratio
     */
    public static organizeItems<T extends ModelAttributes>(
        gallery: Masonry<T>,
        items: Item<T>[],
        fromIndex = 0,
        toIndex: number | null = null,
    ): void {
        const itemsPerRow = gallery.getEstimatedColumnsPerRow();

        // Compute columnWidth of pictures
        const columnWidth = gallery.getColumnWidth();

        let lastIndex = toIndex ? itemsPerRow * (toIndex - fromIndex + 1) : items.length;
        lastIndex = lastIndex > items.length ? items.length : lastIndex;

        for (let i = 0; i < lastIndex; i++) {
            const item = items[i];
            const {ratio, cropped} = getImageRatioAndIfCropped(item.model, gallery.options.ratioLimit);

            item.width = Math.floor(columnWidth);
            item.height = item.width / ratio;
            item.cropped = cropped;
            item.style(); // todo : externalise to split dom manipulation and logic computing
        }
    }

    public organizeItems(items: Item<Model>[], fromRow?: number, toRow?: number): void {
        Masonry.organizeItems(this, items, fromRow, toRow);
    }

    protected onVirtualScroll(): void {
        if (this.currentViewportHeight <= 0) return;

        const overscan = this.currentViewportHeight;
        const galleryTop = this.elementRef.offsetTop;
        const viewportBottom = this.currentScrollTop + this.currentViewportHeight;

        for (const column of this.columns) {
            while (column.hasVisibleItems) {
                const item = column.firstVisibleItem!;
                const rowBottom = galleryTop + column.topSpacerHeight + item.height;
                if (this.currentScrollTop - rowBottom <= overscan) break;
                column.trimTopItem();
            }

            while (column.hiddenFromTopCount > 0) {
                const hiddenContentBottom = galleryTop + column.topSpacerHeight;
                if (this.currentScrollTop - hiddenContentBottom > overscan) break;
                column.restoreTopItem();
            }

            while (column.hasVisibleItems) {
                const contentBottom = galleryTop + column.totalHeight - column.bottomSpacerHeight;
                if (contentBottom - viewportBottom <= overscan) break;
                column.trimBottomItem();
            }

            while (column.hiddenFromBottomCount > 0) {
                const hiddenRowTop = galleryTop + column.totalHeight - column.bottomSpacerHeight;
                if (hiddenRowTop - viewportBottom > overscan) break;
                column.restoreBottomItem();
            }
        }
    }

    protected onScroll(): void {
        this.addUntilFill();
    }

    protected onPageAdd(): void {
        this.addUntilFill();
    }

    protected getFormatName(): string {
        return 'format-masonry';
    }

    protected getEstimatedColumnsPerRow(): number {
        return Math.ceil((this.width - this.options.gap) / (this.options.columnWidth + this.options.gap));
    }

    protected getEstimatedRowsPerPage(): number {
        let ratio = 1.75; // ~16/9 - landscape format to minimum the height and maximize the prediction of the number of items

        // Better prediction using ratio if provided
        if (this.options.ratioLimit && this.options.ratioLimit.max) {
            ratio = this.options.ratioLimit.max;
        }

        const columnWidth = this.getColumnWidth();
        const estimatedImageHeight = columnWidth / ratio;
        return Math.ceil(this.getGalleryVisibleHeight() / estimatedImageHeight);
    }

    /**
     * Use current gallery height as reference. To fill free space it add images until the gallery height changes, then are one more row
     */
    protected addUntilFill(): void {
        do {
            this.addItemsToDom(1);
        } while (this.viewportIsNotFilled() && this.domCollection.length < this.collection.length);
    }

    protected addItemToDOM(item: Item<Model>): void {
        const shortestColumn = this.getShortestColumn();
        shortestColumn.addItem(item);
        super.addItemToDOM(item, shortestColumn.elementRef);
    }

    private resizeAnchor: {item: Item<Model>; offset: number} | null = null;

    /**
     * Capture the scroll anchor as early as possible — before the browser's own layout has a chance to alter the
     * scroll position. Called on every raw resize event (not just the debounced startResize()): a burst that
     * started right after construction can still be "open" when a later, genuine resize happens, in which case
     * startResize()'s leading edge wouldn't fire again and would otherwise leave us with a stale (pre-scroll)
     * anchor.
     */
    protected captureResizeAnchor(): void {
        const anchorItem = this.currentViewportHeight > 0 ? this.findAnchorItem() : null;
        const anchorTop = anchorItem ? this.getItemTop(anchorItem) : null;
        this.resizeAnchor =
            anchorItem && anchorTop !== null ? {item: anchorItem, offset: this.currentScrollTop - anchorTop} : null;
    }

    protected endResize(): void {
        super.endResize();

        if (!this.domCollection.length) {
            return;
        }

        const anchor = this.resizeAnchor;
        this.resizeAnchor = null;

        // Relayout the existing domCollection in place (same items, same order) rather than discarding it and
        // rebuilding from collection index 0 — that used to lose the user's scroll position, recreate every
        // <img> from scratch (causing a load/flicker), and force a synchronous reflow per item placed.
        const items = this.domCollection;
        this.addColumns();
        const columnWidth = this.getColumnWidth();

        for (const item of items) {
            const {ratio, cropped} = getImageRatioAndIfCropped(item.model, this.options.ratioLimit);
            item.width = Math.floor(columnWidth);
            item.height = item.width / ratio;
            item.cropped = cropped;
            item.style();
            this.getLogicallyShortestColumn().addItem(item);
        }

        // The browser may have already silently clamped the real scroll position by now (e.g. CSS flex-wrap
        // re-wrapping figures at their old width as soon as the container got wider/narrower, before any of our
        // JS ran) — currentScrollTop can no longer be trusted to reflect where the user actually was. Use the
        // anchor-derived target instead, so the mount window below is consistent with where we're about to
        // scroll, rather than a stale/corrupted value.
        const anchorNewTop = anchor ? this.getItemTop(anchor.item) : null;
        const targetTop = anchor && anchorNewTop !== null ? Math.max(0, anchorNewTop + anchor.offset) : null;
        if (targetTop !== null) {
            this.currentScrollTop = targetTop;
        }

        if (this.currentViewportHeight > 0) {
            const overscan = this.currentViewportHeight;
            const galleryTop = this.elementRef.offsetTop;
            this.columns.forEach(column =>
                column.mountVisibleWindow(
                    this.currentScrollTop - overscan,
                    this.currentScrollTop + this.currentViewportHeight + overscan,
                    galleryTop,
                ),
            );
        } else {
            this.columns.forEach(column => column.mountAll());
        }

        // Apply the real scroll position before the safety net below: addUntilFill()'s viewportIsNotFilled()
        // check reads getBoundingClientRect(), which is relative to the *actual* browser scroll position. If we
        // checked it before scrolling there, it would compare freshly-mounted content (positioned for targetTop)
        // against the stale old scroll position — almost always reporting "not filled" and forcing the
        // expensive legacy fallback (getShortestColumn()'s offsetHeight reads) to run on every resize, even
        // though mountVisibleWindow() already mounted everything needed.
        if (targetTop !== null) {
            this.applyScrollPosition(targetTop);
        }

        // Safety net only: no-op whenever the just-mounted window already fills the viewport
        this.addUntilFill();
        this.updateNextButtonVisibility();
    }

    /**
     * Shortest column lookup using the logical (pure JS) total height, with no forced DOM layout read. Used during
     * resize relayout, where most items aren't mounted yet. The live pagination path keeps using getShortestColumn()
     * (real DOM height), since accuracy matters more there and items are always mounted already.
     */
    private getLogicallyShortestColumn(): Column<Model> {
        return this.columns.reduce((shortest, column) =>
            column.totalHeight < shortest.totalHeight ? column : shortest,
        );
    }

    /**
     * Item currently crossing currentScrollTop, topmost among all columns. Used to re-anchor scroll position across
     * a resize, so the same content stays visible instead of drifting.
     */
    private findAnchorItem(): Item<Model> | null {
        const galleryTop = this.elementRef.offsetTop;
        let best: Item<Model> | null = null;
        let bestTop = Infinity;
        for (const column of this.columns) {
            let top = galleryTop;
            for (const item of column.items) {
                const bottom = top + item.height;
                if (bottom >= this.currentScrollTop) {
                    if (top < bestTop) {
                        bestTop = top;
                        best = item;
                    }
                    break;
                }
                top += item.height + this.options.gap;
            }
        }
        return best;
    }

    protected getItemTop(item: Item<Model>): number | null {
        const galleryTop = this.elementRef.offsetTop;
        for (const column of this.columns) {
            const index = column.items.indexOf(item);
            if (index >= 0) {
                return galleryTop + column.cumulativeHeightBefore(index);
            }
        }
        return null;
    }

    protected addColumns(): void {
        this.bodyElementRef.innerHTML = '';
        this.columns = [];
        const columnWidth = this.getColumnWidth();
        for (let i = 0; i < this.getEstimatedColumnsPerRow(); i++) {
            const columnRef = new Column<Model>(this.document, {width: columnWidth, gap: this.options.gap});
            this.columns.push(columnRef);
            this.bodyElementRef.appendChild(columnRef.elementRef);
        }
    }

    protected empty(): void {
        super.empty();
        this.addColumns();
    }

    /**
     * Returns true if at least one column doesn't overflow on the bottom of the viewport
     */
    private viewportIsNotFilled(): boolean {
        return this.columns.some(
            c => c.elementRef.getBoundingClientRect().bottom < this.document.documentElement.clientHeight,
        );
    }

    private addItemsToDom(nbItems: number) {
        const nbVisibleImages = this.domCollection.length;

        // Next row to add (first invisible row)
        const firstIndex = this.domCollection.length ? nbVisibleImages : 0;
        const lastWantedIndex = firstIndex + nbItems - 1;

        // Compute size only for elements we're going to add
        this.organizeItems(this.collection.slice(nbVisibleImages), firstIndex, lastWantedIndex);

        for (let i = nbVisibleImages; i < this.collection.length; i++) {
            const item = this.collection[i];
            if (i <= lastWantedIndex) {
                this.addItemToDOM(item);
            } else {
                break;
            }
        }

        this.flushBufferedItems();
        this.updateNextButtonVisibility();
    }

    /**
     * Return square side size
     */
    private getColumnWidth(): number {
        const itemsPerRow = this.getEstimatedColumnsPerRow();
        return Math.floor((this.width - (itemsPerRow - 1) * this.options.gap) / itemsPerRow);
    }

    private getShortestColumn(): Column<Model> {
        return this.columns.reduce((shortestColumn, column) =>
            column.height < shortestColumn.height ? column : shortestColumn,
        );
    }
}
