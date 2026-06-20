import {Item} from '../Item';
import {AbstractGallery, GalleryOptions, ModelAttributes} from './AbstractGallery';

export abstract class AbstractRowGallery<
    Model extends ModelAttributes = ModelAttributes,
> extends AbstractGallery<Model> {
    protected virtualHiddenFromTopCount = 0;
    protected virtualTopPadding = 0;
    protected virtualHiddenFromBottomCount = 0;
    protected virtualBottomPadding = 0;
    protected virtualTotalHeight = 0;

    protected constructor(
        protected elementRef: HTMLElement,
        options: GalleryOptions,
        protected scrollElementRef?: HTMLElement | null,
    ) {
        super(elementRef, options, scrollElementRef);
        this.bodyElementRef!.style.rowGap = this.options.gap + 'px';
    }

    protected onVirtualScroll(): void {
        if (this.currentViewportHeight <= 0) return;
        this.trimTopRows();
        this.restoreTopRows();
        this.trimBottomRows();
        this.restoreBottomRows();
    }

    protected onScroll(): void {
        this.addRows(1);
    }

    protected onPageAdd(): void {
        this.addRows(this.getRowsPerPage());
    }

    protected addRows(rows: number): void {
        const nbVisibleImages = this.domCollection.length;
        const nextRow = this.domCollection.length ? this.domCollection[nbVisibleImages - 1].row + 1 : 0;
        const lastWantedRow = nextRow + rows - 1;

        const bufferedItems = this.collection.slice(nbVisibleImages);
        this.organizeItems(bufferedItems, nextRow, lastWantedRow);

        const itemsToAdd = bufferedItems.filter(i => i.row <= lastWantedRow);
        itemsToAdd.forEach(i => this.addItemToDOM(i));

        let lastRowSeen = -1;
        for (const item of itemsToAdd) {
            if (item.row !== lastRowSeen) {
                this.virtualTotalHeight += item.height + this.options.gap;
                lastRowSeen = item.row;
            }
        }

        this.flushBufferedItems();
        this.updateNextButtonVisibility();
    }

    private resizeAnchor: {item: Item<Model>; offset: number} | null = null;

    /**
     * Capture the scroll anchor as early as possible — before the browser's own layout (e.g. CSS flex-wrap
     * re-wrapping figures at their old width into a new arrangement) has a chance to clamp/alter the scroll
     * position. By the time endResize() runs (500ms debounce later), currentScrollTop may already have been
     * silently overwritten by that browser-driven reflow. Called on every raw resize event (not just the
     * debounced startResize()): a burst that started right after construction can still be "open" when a later,
     * genuine resize happens, in which case startResize()'s leading edge wouldn't fire again and would otherwise
     * leave us with a stale (pre-scroll) anchor.
     */
    protected captureResizeAnchor(): void {
        const anchorItem = this.currentViewportHeight > 0 ? this.findAnchorItem() : null;
        const anchorTop = anchorItem ? this.getItemTop(anchorItem) : null;
        this.resizeAnchor =
            anchorItem && anchorTop !== null ? {item: anchorItem, offset: this.currentScrollTop - anchorTop} : null;
    }

    protected endResize(): void {
        const anchor = this.resizeAnchor;
        this.resizeAnchor = null;

        this.restoreAllTopItems();
        this.restoreAllBottomItems();
        super.endResize();

        if (!this.domCollection.length) {
            return;
        }

        this.organizeItems(this.domCollection);
        this.recomputeVirtualTotalHeight();

        // The browser may have already silently clamped the real scroll position by now (e.g. CSS flex-wrap
        // re-wrapping figures at their old width as soon as the container got wider/narrower, before any of our
        // JS ran) — currentScrollTop can no longer be trusted to reflect where the user actually was. Use the
        // anchor-derived target instead, so the re-trim below operates on consistent data with where we're about
        // to scroll, rather than a stale/corrupted value.
        const anchorNewTop = anchor ? this.getItemTop(anchor.item) : null;
        const targetTop = anchor && anchorNewTop !== null ? Math.max(0, anchorNewTop + anchor.offset) : null;
        if (targetTop !== null) {
            this.currentScrollTop = targetTop;
        }

        // Re-trim immediately instead of leaving everything mounted until the next scroll event
        if (this.currentViewportHeight > 0) {
            this.trimTopRows();
            this.trimBottomRows();
        }

        if (targetTop !== null) {
            this.applyScrollPosition(targetTop);
        }
    }

    /**
     * Recompute total height of the whole domCollection (used by endResize() and addRows())
     */
    protected recomputeVirtualTotalHeight(): void {
        this.virtualTotalHeight = 0;
        let lastRow = -1;
        for (const item of this._domCollection) {
            if (item.row !== lastRow) {
                this.virtualTotalHeight += item.height + this.options.gap;
                lastRow = item.row;
            }
        }
    }

    /**
     * Absolute top offset of given item's row, or null if item is not part of domCollection
     */
    protected getItemTop(item: Item<Model>): number | null {
        let top = this.elementRef.offsetTop;
        let lastRow = -1;
        let lastRowHeight = 0;
        for (const current of this._domCollection) {
            if (current.row !== lastRow) {
                if (lastRow !== -1) {
                    top += lastRowHeight + this.options.gap;
                }
                lastRow = current.row;
            }
            if (current === item) {
                return top;
            }
            lastRowHeight = current.height;
        }
        return null;
    }

    /**
     * First item of whichever row currently spans currentScrollTop. Used to re-anchor scroll position across a
     * resize, so the same content stays visible instead of drifting to the top.
     */
    private findAnchorItem(): Item<Model> | null {
        let top = this.elementRef.offsetTop;
        let i = 0;
        const n = this._domCollection.length;
        while (i < n) {
            const rowStart = i;
            const row = this._domCollection[i].row;
            const rowHeight = this._domCollection[i].height;
            while (i < n && this._domCollection[i].row === row) {
                i++;
            }
            if (top + rowHeight >= this.currentScrollTop || i >= n) {
                return this._domCollection[rowStart];
            }
            top += rowHeight + this.options.gap;
        }
        return null;
    }

    protected empty(): void {
        this.virtualHiddenFromTopCount = 0;
        this.virtualTopPadding = 0;
        this.virtualHiddenFromBottomCount = 0;
        this.virtualBottomPadding = 0;
        this.virtualTotalHeight = 0;
        this.bodyElementRef.style.paddingTop = '0';
        this.bodyElementRef.style.paddingBottom = '0';
        super.empty();
    }

    private trimTopRows(): void {
        const overscan = this.currentViewportHeight;
        const galleryTop = this.elementRef.offsetTop;

        while (this.virtualHiddenFromTopCount + this.virtualHiddenFromBottomCount < this._domCollection.length) {
            const firstVisibleIdx = this.virtualHiddenFromTopCount;
            const firstRow = this._domCollection[firstVisibleIdx].row;

            let endIdx = firstVisibleIdx;
            while (endIdx < this._domCollection.length && this._domCollection[endIdx].row === firstRow) {
                endIdx++;
            }

            const rowHeight = this._domCollection[firstVisibleIdx].height;
            const rowBottom = galleryTop + this.virtualTopPadding + rowHeight;

            if (this.currentScrollTop - rowBottom <= overscan) break;

            for (let i = firstVisibleIdx; i < endIdx; i++) {
                this._domCollection[i].remove();
            }
            this.virtualTopPadding += rowHeight + this.options.gap;
            this.virtualHiddenFromTopCount = endIdx;
            this.bodyElementRef.style.paddingTop = this.virtualTopPadding + 'px';
        }
    }

    private restoreTopRows(): void {
        const overscan = this.currentViewportHeight;
        const galleryTop = this.elementRef.offsetTop;

        while (this.virtualHiddenFromTopCount > 0) {
            const hiddenContentBottom = galleryTop + this.virtualTopPadding;
            if (this.currentScrollTop - hiddenContentBottom > overscan) break;

            const prevLastIdx = this.virtualHiddenFromTopCount - 1;
            const prevRow = this._domCollection[prevLastIdx].row;

            let startIdx = prevLastIdx;
            while (startIdx > 0 && this._domCollection[startIdx - 1].row === prevRow) {
                startIdx--;
            }

            const rowHeight = this._domCollection[startIdx].height;
            const firstCurrentElement = this._domCollection[this.virtualHiddenFromTopCount]?.rootElement ?? null;

            for (let i = startIdx; i < this.virtualHiddenFromTopCount; i++) {
                this.bodyElementRef.insertBefore(this._domCollection[i].rootElement!, firstCurrentElement);
            }

            this.virtualTopPadding = Math.max(0, this.virtualTopPadding - rowHeight - this.options.gap);
            this.virtualHiddenFromTopCount = startIdx;
            this.bodyElementRef.style.paddingTop = this.virtualTopPadding + 'px';
        }
    }

    private trimBottomRows(): void {
        const overscan = this.currentViewportHeight;
        const galleryTop = this.elementRef.offsetTop;
        const viewportBottom = this.currentScrollTop + this.currentViewportHeight;

        while (this.virtualHiddenFromTopCount + this.virtualHiddenFromBottomCount < this._domCollection.length) {
            const contentBottom = galleryTop + this.virtualTotalHeight - this.virtualBottomPadding;
            if (contentBottom - viewportBottom <= overscan) break;

            const lastVisibleIdx = this._domCollection.length - this.virtualHiddenFromBottomCount - 1;
            const lastRow = this._domCollection[lastVisibleIdx].row;

            let startIdx = lastVisibleIdx;
            while (startIdx > this.virtualHiddenFromTopCount && this._domCollection[startIdx - 1].row === lastRow) {
                startIdx--;
            }

            const rowHeight = this._domCollection[startIdx].height;

            for (let i = startIdx; i <= lastVisibleIdx; i++) {
                this._domCollection[i].remove();
            }
            this.virtualBottomPadding += rowHeight + this.options.gap;
            this.virtualHiddenFromBottomCount += lastVisibleIdx - startIdx + 1;
            this.bodyElementRef.style.paddingBottom = this.virtualBottomPadding + 'px';
        }
    }

    private restoreBottomRows(): void {
        const overscan = this.currentViewportHeight;
        const galleryTop = this.elementRef.offsetTop;
        const viewportBottom = this.currentScrollTop + this.currentViewportHeight;

        while (this.virtualHiddenFromBottomCount > 0) {
            const hiddenRowTop = galleryTop + this.virtualTotalHeight - this.virtualBottomPadding;
            if (hiddenRowTop - viewportBottom > overscan) break;

            const firstHiddenIdx = this._domCollection.length - this.virtualHiddenFromBottomCount;
            const firstHiddenRow = this._domCollection[firstHiddenIdx].row;

            let endIdx = firstHiddenIdx;
            while (endIdx + 1 < this._domCollection.length && this._domCollection[endIdx + 1].row === firstHiddenRow) {
                endIdx++;
            }

            const rowHeight = this._domCollection[firstHiddenIdx].height;

            for (let i = firstHiddenIdx; i <= endIdx; i++) {
                this.bodyElementRef.appendChild(this._domCollection[i].rootElement!);
            }

            this.virtualBottomPadding = Math.max(0, this.virtualBottomPadding - rowHeight - this.options.gap);
            this.virtualHiddenFromBottomCount -= endIdx - firstHiddenIdx + 1;
            this.bodyElementRef.style.paddingBottom = this.virtualBottomPadding + 'px';
        }
    }

    private restoreAllTopItems(): void {
        if (this.virtualHiddenFromTopCount === 0) return;

        const firstCurrentElement = this._domCollection[this.virtualHiddenFromTopCount]?.rootElement ?? null;
        for (let i = 0; i < this.virtualHiddenFromTopCount; i++) {
            this.bodyElementRef.insertBefore(this._domCollection[i].rootElement!, firstCurrentElement);
        }

        this.virtualHiddenFromTopCount = 0;
        this.virtualTopPadding = 0;
        this.bodyElementRef.style.paddingTop = '0';
    }

    private restoreAllBottomItems(): void {
        if (this.virtualHiddenFromBottomCount === 0) return;

        const startIdx = this._domCollection.length - this.virtualHiddenFromBottomCount;
        for (let i = startIdx; i < this._domCollection.length; i++) {
            this.bodyElementRef.appendChild(this._domCollection[i].rootElement!);
        }

        this.virtualHiddenFromBottomCount = 0;
        this.virtualBottomPadding = 0;
        this.bodyElementRef.style.paddingBottom = '0';
    }
}
