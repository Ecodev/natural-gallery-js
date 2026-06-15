import {AbstractGallery, GalleryOptions, ModelAttributes} from './AbstractGallery';

export abstract class AbstractRowGallery<
    Model extends ModelAttributes = ModelAttributes,
> extends AbstractGallery<Model> {
    protected virtualHiddenFromTopCount = 0;
    protected virtualTopPadding = 0;

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
    }

    protected onScroll(): void {
        this.addRows(1);
    }

    protected onPageAdd(): void {
        this.addRows(this.getRowsPerPage());
    }

    /**
     * Add given number of rows to DOM
     * @param rows
     */
    protected addRows(rows: number): void {
        const nbVisibleImages = this.domCollection.length;

        // Next row to add (first invisible row)
        const nextRow = this.domCollection.length ? this.domCollection[nbVisibleImages - 1].row + 1 : 0;
        const lastWantedRow = nextRow + rows - 1;

        // Compute size only for elements we're going to add
        const bufferedItems = this.collection.slice(nbVisibleImages);
        this.organizeItems(bufferedItems, nextRow, lastWantedRow);

        const itemsToAdd = bufferedItems.filter(i => i.row <= lastWantedRow);
        itemsToAdd.forEach(i => this.addItemToDOM(i));

        this.flushBufferedItems();
        this.updateNextButtonVisibility();
    }

    protected endResize(): void {
        this.restoreAllTopItems();
        super.endResize();

        if (!this.domCollection.length) {
            return;
        }

        // Compute with new width. Rows indexes may have changed
        this.organizeItems(this.domCollection);
    }

    protected empty(): void {
        this.virtualHiddenFromTopCount = 0;
        this.virtualTopPadding = 0;
        this.bodyElementRef.style.paddingTop = '0';
        super.empty();
    }

    private trimTopRows(): void {
        const overscan = this.currentViewportHeight;
        const galleryTop = this.elementRef.offsetTop;

        while (this.virtualHiddenFromTopCount < this._domCollection.length) {
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
}
