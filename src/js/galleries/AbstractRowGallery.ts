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
        const galleryTop = this.getGalleryTop();

        // A jump far from the mounted rows (scrollbar drag, Home/End keys, programmatic scroll) would otherwise
        // mount every row in between, one at a time, before trimming them on the next scroll event
        const overscan = this.currentViewportHeight;
        const windowTop = this.currentScrollTop - overscan;
        const windowBottom = this.currentScrollTop + this.currentViewportHeight + overscan;
        const mountedTop = galleryTop + this.virtualTopPadding;
        const mountedBottom = galleryTop + this.virtualTotalHeight - this.virtualBottomPadding;
        const hasMountedRows =
            this.virtualHiddenFromTopCount + this.virtualHiddenFromBottomCount < this.collection.length;
        if (!hasMountedRows || mountedBottom < windowTop || mountedTop > windowBottom) {
            this.mountVisibleWindow(windowTop, windowBottom, galleryTop);
            return;
        }

        this.trimTopRows(galleryTop);
        this.restoreTopRows(galleryTop);
        this.trimBottomRows(galleryTop);
        this.restoreBottomRows(galleryTop);
    }

    protected getContentHeight(): number {
        return this.virtualTotalHeight;
    }

    protected getShownItemCount(): number {
        if (!this.options.rowsPerPage) {
            return this.collection.length;
        }

        const shownRowCount = this.shownPageCount * this.options.rowsPerPage;
        const firstHiddenIndex = this.collection.findIndex(item => item.row >= shownRowCount);

        return firstHiddenIndex < 0 ? this.collection.length : firstHiddenIndex;
    }

    protected computeNewItemsSizes(firstNewIndex: number): void {
        if (firstNewIndex === this.collection.length) {
            return;
        }

        // The last row of the previous items may be incomplete, so it is organized again together with the new items
        let start = firstNewIndex;
        const lastRow = start ? this.collection[start - 1].row : 0;
        while (start > 0 && this.collection[start - 1].row === lastRow) {
            start--;
        }

        this.organizeItems(this.collection.slice(start), lastRow);
    }

    public getVisibleCollection(): Item<Model>[] {
        if (this.currentViewportHeight <= 0) {
            return [];
        }

        const viewportTop = this.currentScrollTop;
        const viewportBottom = this.currentScrollTop + this.currentViewportHeight;
        const visible: Item<Model>[] = [];

        // The viewport always lies within the mounted rows, so the rows hidden by the virtual scroll are skipped
        let rowTop = this.getGalleryTop() + this.virtualTopPadding;
        let i = this.virtualHiddenFromTopCount;
        const end = this.collection.length - this.virtualHiddenFromBottomCount;
        while (i < end && rowTop < viewportBottom) {
            const rowStart = i;
            const row = this.collection[i].row;
            const rowHeight = this.collection[i].height;
            while (i < end && this.collection[i].row === row) {
                i++;
            }

            if (rowTop + rowHeight > viewportTop) {
                visible.push(...this.collection.slice(rowStart, i));
            }

            rowTop += rowHeight + this.options.gap;
        }

        return visible;
    }

    /**
     * Capture the scroll anchor at the first resize event, from the scroll position and the gallery top read before
     * the resize, since the browser has already rearranged the figures at their old width by then
     */
    protected captureResizeAnchor(): void {
        const anchorItem = this.currentViewportHeight > 0 ? this.findAnchorItem() : null;
        const anchorTop = anchorItem ? this.getItemTop(anchorItem, this.currentGalleryTop) : null;
        this.resizeAnchor =
            anchorItem && anchorTop !== null ? {item: anchorItem, offset: this.currentScrollTop - anchorTop} : null;
    }

    protected endResize(): void {
        const anchor = this.resizeAnchor;
        this.resizeAnchor = null;

        super.endResize();

        if (!this.collection.length) {
            return;
        }

        this.organizeItems(this.collection);

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

        // Mount only the rows around the viewport, instead of mounting everything and trimming afterwards
        this.mountAroundViewport();

        if (targetTop !== null) {
            this.applyScrollPosition(targetTop);
        }
    }

    /**
     * Absolute top offset of given item's row, or null if item is not part of the collection
     */
    protected getItemTop(item: Item<Model>, galleryTop = this.getGalleryTop()): number | null {
        let top = galleryTop;
        let lastRow = -1;
        let lastRowHeight = 0;
        for (const current of this.collection) {
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
     * First item of the first row entirely within the viewport. When that row is taller than the viewport, first item
     * of the row crossing the top of the viewport instead. Used to re-anchor scroll position across a resize, so the
     * same content stays visible instead of drifting to the top.
     */
    private findAnchorItem(): Item<Model> | null {
        const viewportBottom = this.currentScrollTop + this.currentViewportHeight;
        let crossingTopItem: Item<Model> | null = null;
        let top = this.currentGalleryTop;
        let i = 0;
        const n = this.collection.length;
        while (i < n) {
            const rowStart = i;
            const row = this.collection[i].row;
            const rowHeight = this.collection[i].height;
            while (i < n && this.collection[i].row === row) {
                i++;
            }

            const bottom = top + rowHeight;
            if (top >= this.currentScrollTop) {
                return bottom <= viewportBottom
                    ? this.collection[rowStart]
                    : (crossingTopItem ?? this.collection[rowStart]);
            }

            if (bottom >= this.currentScrollTop || i >= n) {
                crossingTopItem = this.collection[rowStart];
            }

            top = bottom + this.options.gap;
        }

        return crossingTopItem;
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

    private trimTopRows(galleryTop: number): void {
        const overscan = this.currentViewportHeight;

        while (this.virtualHiddenFromTopCount + this.virtualHiddenFromBottomCount < this.collection.length) {
            const firstVisibleIdx = this.virtualHiddenFromTopCount;
            const firstRow = this.collection[firstVisibleIdx].row;

            let endIdx = firstVisibleIdx;
            while (endIdx < this.collection.length && this.collection[endIdx].row === firstRow) {
                endIdx++;
            }

            const rowHeight = this.collection[firstVisibleIdx].height;
            const rowBottom = galleryTop + this.virtualTopPadding + rowHeight;

            if (this.currentScrollTop - rowBottom <= overscan) break;

            for (let i = firstVisibleIdx; i < endIdx; i++) {
                this.collection[i].remove();
            }
            this.virtualTopPadding += rowHeight + this.options.gap;
            this.virtualHiddenFromTopCount = endIdx;
            this.bodyElementRef.style.paddingTop = this.virtualTopPadding + 'px';
        }
    }

    private restoreTopRows(galleryTop: number): void {
        const overscan = this.currentViewportHeight;

        while (this.virtualHiddenFromTopCount > 0) {
            const hiddenContentBottom = galleryTop + this.virtualTopPadding;
            if (this.currentScrollTop - hiddenContentBottom > overscan) break;

            const prevLastIdx = this.virtualHiddenFromTopCount - 1;
            const prevRow = this.collection[prevLastIdx].row;

            let startIdx = prevLastIdx;
            while (startIdx > 0 && this.collection[startIdx - 1].row === prevRow) {
                startIdx--;
            }

            const rowHeight = this.collection[startIdx].height;
            const firstCurrentElement = this.collection[this.virtualHiddenFromTopCount].rootElement;

            for (let i = startIdx; i < this.virtualHiddenFromTopCount; i++) {
                this.bodyElementRef.insertBefore(this.mountItem(this.collection[i]), firstCurrentElement);
            }

            this.virtualTopPadding = Math.max(0, this.virtualTopPadding - rowHeight - this.options.gap);
            this.virtualHiddenFromTopCount = startIdx;
            this.bodyElementRef.style.paddingTop = this.virtualTopPadding + 'px';
        }
    }

    private trimBottomRows(galleryTop: number): void {
        const overscan = this.currentViewportHeight;
        const viewportBottom = this.currentScrollTop + this.currentViewportHeight;

        while (this.virtualHiddenFromTopCount + this.virtualHiddenFromBottomCount < this.collection.length) {
            const contentBottom = galleryTop + this.virtualTotalHeight - this.virtualBottomPadding;
            if (contentBottom - viewportBottom <= overscan) break;

            const lastVisibleIdx = this.collection.length - this.virtualHiddenFromBottomCount - 1;
            const lastRow = this.collection[lastVisibleIdx].row;

            let startIdx = lastVisibleIdx;
            while (startIdx > this.virtualHiddenFromTopCount && this.collection[startIdx - 1].row === lastRow) {
                startIdx--;
            }

            const rowHeight = this.collection[startIdx].height;

            for (let i = startIdx; i <= lastVisibleIdx; i++) {
                this.collection[i].remove();
            }
            this.virtualBottomPadding += rowHeight + this.options.gap;
            this.virtualHiddenFromBottomCount += lastVisibleIdx - startIdx + 1;
            this.bodyElementRef.style.paddingBottom = this.virtualBottomPadding + 'px';
        }
    }

    private restoreBottomRows(galleryTop: number): void {
        const overscan = this.currentViewportHeight;
        const viewportBottom = this.currentScrollTop + this.currentViewportHeight;

        while (this.virtualHiddenFromBottomCount > 0) {
            const hiddenRowTop = galleryTop + this.virtualTotalHeight - this.virtualBottomPadding;
            if (hiddenRowTop - viewportBottom > overscan) break;

            const firstHiddenIdx = this.collection.length - this.virtualHiddenFromBottomCount;
            const firstHiddenRow = this.collection[firstHiddenIdx].row;

            let endIdx = firstHiddenIdx;
            while (endIdx + 1 < this.collection.length && this.collection[endIdx + 1].row === firstHiddenRow) {
                endIdx++;
            }

            const rowHeight = this.collection[firstHiddenIdx].height;

            for (let i = firstHiddenIdx; i <= endIdx; i++) {
                this.bodyElementRef.appendChild(this.mountItem(this.collection[i]));
            }

            this.virtualBottomPadding = Math.max(0, this.virtualBottomPadding - rowHeight - this.options.gap);
            this.virtualHiddenFromBottomCount -= endIdx - firstHiddenIdx + 1;
            this.bodyElementRef.style.paddingBottom = this.virtualBottomPadding + 'px';
        }
    }

    /**
     * Mount the rows within one viewport height above and below the viewport. While the viewport height is unknown,
     * as during server side rendering, no row is mounted and every row is folded into the bottom padding. With
     * rowsPerPage, there is no virtual scroll and the rows of the pages shown so far are mounted.
     */
    protected mountAroundViewport(): void {
        if (this.options.rowsPerPage) {
            this.mountShownRows();
        } else if (this.currentViewportHeight > 0) {
            const overscan = this.currentViewportHeight;
            this.mountVisibleWindow(
                this.currentScrollTop - overscan,
                this.currentScrollTop + this.currentViewportHeight + overscan,
                this.getGalleryTop(),
            );
        } else {
            this.mountVisibleWindow(-Infinity, -Infinity, 0);
        }
    }

    /**
     * With rowsPerPage, mount the rows of the pages shown so far. The following rows stay out of the DOM without any
     * padding, since they are hidden until the next button is clicked.
     */
    private mountShownRows(): void {
        const shownCount = this.getShownItemCount();
        let totalHeight = 0;
        let lastRow = -1;
        const shown: HTMLElement[] = [];
        for (let i = 0; i < shownCount; i++) {
            const item = this.collection[i];
            if (item.row !== lastRow) {
                totalHeight += item.height + this.options.gap;
                lastRow = item.row;
            }
            shown.push(this.mountItem(item));
        }

        this.virtualTotalHeight = totalHeight;
        this.virtualHiddenFromTopCount = 0;
        this.virtualTopPadding = 0;
        this.virtualHiddenFromBottomCount = this.collection.length - shownCount;
        this.virtualBottomPadding = 0;
        this.bodyElementRef.style.paddingTop = '0';
        this.bodyElementRef.style.paddingBottom = '0';
        this.bodyElementRef.innerHTML = '';
        shown.forEach(element => this.bodyElementRef.appendChild(element));
    }

    /**
     * Mount only the rows whose [top, bottom] intersects [windowTop, windowBottom], and fold every other row into
     * the top or bottom padding. Row positions come from the row heights alone, with no DOM read, and the DOM is
     * touched once at the end. Existing rootElement nodes are reused, so images neither reload nor flicker.
     */
    private mountVisibleWindow(windowTop: number, windowBottom: number, galleryTop: number): void {
        let cumulative = 0;
        let hiddenFromTopCount = 0;
        let topPadding = 0;
        let hiddenFromBottomCount = 0;
        let bottomPadding = 0;
        const visible: HTMLElement[] = [];

        let i = 0;
        const n = this.collection.length;
        while (i < n) {
            const rowStart = i;
            const row = this.collection[i].row;
            const rowHeight = this.collection[i].height;
            while (i < n && this.collection[i].row === row) {
                i++;
            }

            const rowTop = galleryTop + cumulative;
            const rowBottom = rowTop + rowHeight;
            cumulative += rowHeight + this.options.gap;

            if (rowBottom < windowTop) {
                hiddenFromTopCount = i;
                topPadding += rowHeight + this.options.gap;
            } else if (rowTop > windowBottom) {
                hiddenFromBottomCount += i - rowStart;
                bottomPadding += rowHeight + this.options.gap;
            } else {
                for (let j = rowStart; j < i; j++) {
                    visible.push(this.mountItem(this.collection[j]));
                }
            }
        }

        this.virtualTotalHeight = cumulative;
        this.virtualHiddenFromTopCount = hiddenFromTopCount;
        this.virtualTopPadding = topPadding;
        this.virtualHiddenFromBottomCount = hiddenFromBottomCount;
        this.virtualBottomPadding = bottomPadding;
        this.bodyElementRef.style.paddingTop = topPadding + 'px';
        this.bodyElementRef.style.paddingBottom = bottomPadding + 'px';
        this.bodyElementRef.innerHTML = '';
        visible.forEach(element => this.bodyElementRef.appendChild(element));
    }
}
