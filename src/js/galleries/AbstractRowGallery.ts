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

    protected endResize(): void {
        this.restoreAllTopItems();
        this.restoreAllBottomItems();
        super.endResize();

        if (!this.domCollection.length) {
            return;
        }

        this.organizeItems(this.domCollection);

        this.virtualTotalHeight = 0;
        let lastRow = -1;
        for (const item of this._domCollection) {
            if (item.row !== lastRow) {
                this.virtualTotalHeight += item.height + this.options.gap;
                lastRow = item.row;
            }
        }
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
