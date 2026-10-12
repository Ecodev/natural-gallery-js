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
        const galleryTop = this.getGalleryTop();
        const viewportBottom = this.currentScrollTop + this.currentViewportHeight;

        for (const column of this.columns) {
            // A jump far from the mounted items (scrollbar drag, Home/End keys, programmatic scroll) would otherwise
            // mount every item in between, one at a time, before trimming them on the next scroll event
            const windowTop = this.currentScrollTop - overscan;
            const windowBottom = viewportBottom + overscan;
            const mountedTop = galleryTop + column.topSpacerHeight;
            const mountedBottom = galleryTop + column.totalHeight - column.bottomSpacerHeight;
            if (!column.hasVisibleItems || mountedBottom < windowTop || mountedTop > windowBottom) {
                column.mountVisibleWindow(windowTop, windowBottom, galleryTop);
                continue;
            }

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

    protected getContentHeight(): number {
        return Math.max(0, ...this.columns.map(column => column.totalHeight));
    }

    public getVisibleCollection(): Item<Model>[] {
        if (this.currentViewportHeight <= 0) {
            return [];
        }

        const galleryTop = this.getGalleryTop();
        const viewportTop = this.currentScrollTop;
        const viewportBottom = this.currentScrollTop + this.currentViewportHeight;
        const visible = new Set<Item<Model>>();

        // The viewport always lies within the mounted items, so the items hidden by the virtual scroll are skipped
        for (const column of this.columns) {
            let itemTop = galleryTop + column.topSpacerHeight;
            const end = column.items.length - column.hiddenFromBottomCount;
            for (let i = column.hiddenFromTopCount; i < end && itemTop < viewportBottom; i++) {
                const item = column.items[i];
                if (itemTop + item.height > viewportTop) {
                    visible.add(item);
                }

                itemTop += item.height + this.options.gap;
            }
        }

        return this.collection.filter(item => visible.has(item));
    }

    protected getShownItemCount(): number {
        if (!this.options.rowsPerPage) {
            return this.collection.length;
        }

        // Masonry has no rows, a page shows as many items as rowsPerPage rows would hold
        const shownCount = this.shownPageCount * this.options.rowsPerPage * this.columns.length;

        return Math.min(shownCount, this.collection.length);
    }

    protected computeNewItemsSizes(firstNewIndex: number): void {
        const items = this.collection.slice(firstNewIndex);
        this.organizeItems(items);
        for (const item of items) {
            this.getLogicallyShortestColumn().addItem(item);
        }
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
     * Capture the scroll anchor at the first resize event, from the scroll position and the gallery top read before
     * the resize, since the browser has already rearranged the items by then
     */
    protected captureResizeAnchor(): void {
        const anchorItem = this.currentViewportHeight > 0 ? this.findAnchorItem() : null;
        const anchorTop = anchorItem ? this.getItemTop(anchorItem, this.currentGalleryTop) : null;
        this.resizeAnchor =
            anchorItem && anchorTop !== null ? {item: anchorItem, offset: this.currentScrollTop - anchorTop} : null;
    }

    protected endResize(): void {
        super.endResize();

        if (!this.collection.length) {
            return;
        }

        const anchor = this.resizeAnchor;
        this.resizeAnchor = null;

        // Relayout the existing items in place (same items, same order) rather than recreating them — that used to
        // lose the user's scroll position, recreate every <img> from scratch (causing a load/flicker), and force a
        // synchronous reflow per item placed.
        const items = this.collection;
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

        this.mountAroundViewport();

        if (targetTop !== null) {
            this.applyScrollPosition(targetTop);
        }

        this.updateNextButtonVisibility();
    }

    /**
     * Mount the items within one viewport height above and below the viewport. While the viewport height is unknown,
     * as during server side rendering, no item is mounted and every item is folded into the bottom spacer. With
     * rowsPerPage, there is no virtual scroll and the items of the pages shown so far are mounted.
     */
    protected mountAroundViewport(): void {
        if (this.options.rowsPerPage) {
            // Items are spread over the columns in the order of the collection, so the shown items of each column
            // are the first ones of that column
            const shown = new Set(this.collection.slice(0, this.getShownItemCount()));
            this.columns.forEach(column => column.mountFirstItems(column.items.filter(item => shown.has(item)).length));
        } else if (this.currentViewportHeight > 0) {
            const overscan = this.currentViewportHeight;
            const galleryTop = this.getGalleryTop();
            this.columns.forEach(column =>
                column.mountVisibleWindow(
                    this.currentScrollTop - overscan,
                    this.currentScrollTop + this.currentViewportHeight + overscan,
                    galleryTop,
                ),
            );
        } else {
            this.columns.forEach(column => column.mountVisibleWindow(-Infinity, -Infinity, 0));
        }
    }

    /**
     * Shortest column lookup using the logical (pure JS) total height, with no forced DOM layout read, since most
     * items aren't mounted
     */
    private getLogicallyShortestColumn(): Column<Model> {
        return this.columns.reduce((shortest, column) =>
            column.totalHeight < shortest.totalHeight ? column : shortest,
        );
    }

    /**
     * First item of the first column entirely within the viewport. When that item is taller than the viewport, item
     * of the first column crossing the top of the viewport instead. Used to re-anchor scroll position across a
     * resize, so the same content stays visible instead of drifting.
     */
    private findAnchorItem(): Item<Model> | null {
        const firstColumn = this.columns[0];
        if (!firstColumn) {
            return null;
        }

        const viewportBottom = this.currentScrollTop + this.currentViewportHeight;
        let crossingTopItem: Item<Model> | null = null;
        let top = this.currentGalleryTop;
        for (const item of firstColumn.items) {
            const bottom = top + item.height;
            if (top >= this.currentScrollTop) {
                return bottom <= viewportBottom ? item : (crossingTopItem ?? item);
            }

            if (bottom >= this.currentScrollTop) {
                crossingTopItem = item;
            }

            top = bottom + this.options.gap;
        }

        return crossingTopItem;
    }

    protected getItemTop(item: Item<Model>, galleryTop = this.getGalleryTop()): number | null {
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
            const columnRef = new Column<Model>(this.document, {width: columnWidth, gap: this.options.gap}, item =>
                this.mountItem(item),
            );
            this.columns.push(columnRef);
            this.bodyElementRef.appendChild(columnRef.elementRef);
        }
    }

    protected empty(): void {
        super.empty();
        this.addColumns();
    }

    /**
     * Return square side size
     */
    private getColumnWidth(): number {
        const itemsPerRow = this.getEstimatedColumnsPerRow();
        return Math.floor((this.width - (itemsPerRow - 1) * this.options.gap) / itemsPerRow);
    }
}
