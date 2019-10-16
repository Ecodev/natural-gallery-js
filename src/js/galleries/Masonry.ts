import { Column } from '../Column';
import { Item } from '../Item';
import { getImageRatio, RatioLimits } from '../Utility';
import { AbstractGallery, GalleryOptions, ModelAttributes } from './AbstractGallery';

export interface MasonryGalleryOptions extends GalleryOptions {
    columnWidth: number;
    ratioLimit?: RatioLimits
}

export class Masonry<Model extends ModelAttributes = any> extends AbstractGallery {

    /**
     * Options after having been defaulted
     */
    protected options: MasonryGalleryOptions;

    /**
     * Regroup the list of columns
     */
    protected columns: Column[];

    constructor(protected elementRef: HTMLElement,
                options: MasonryGalleryOptions,
                protected photoswipeElementRef?: HTMLElement,
                protected scrollElementRef?: HTMLElement) {

        super(elementRef, options, photoswipeElementRef, scrollElementRef);

        if (!options.columnWidth || options.columnWidth <= 0) {
            throw new Error('Option.columnWidth must be positive');
        }

    }

    /**
     * Compute sides with 1:1 ratio
     */
    public static organizeItems(gallery: Masonry, items: Item[], fromIndex: number = 0, toIndex: number = null): void {

        let itemsPerRow = gallery.getEstimatedColumnsPerRow();

        // Compute columnWidth of pictures
        let columnWidth = gallery.getColumnWidth();

        let lastIndex = toIndex ? itemsPerRow * (toIndex - fromIndex + 1) : items.length;
        lastIndex = lastIndex > items.length ? items.length : lastIndex;

        for (let i = 0; i < lastIndex; i++) {
            const item = items[i];
            const ratio = getImageRatio(item.model, gallery.options.ratioLimit);

            item.last = true;
            item.width = Math.floor(columnWidth);
            item.height = item.width / ratio;
            item.style(); // todo : externalise to split dom manipulation and logic computing
        }
    }

    public init() {
        super.init();

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

            this.options.infiniteScrollOffset = -1 * columnWidth / ratio;
        }

    }

    public organizeItems(items: Item[], fromRow?: number, toRow?: number): void {
        Masonry.organizeItems(this, items, fromRow, toRow);
    }

    protected initItems(): void {
        this.addColumns();
        super.initItems();
    }

    protected onScroll(): void {
        this.addUntilFill();
    }

    protected onPageAdd(): void {
        this.addUntilFill();
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
    protected addUntilFill() {
        do {
            this.addItemsToDom(1);
        } while (this.viewPortIsNotFilled() && this.visibleCollection.length < this.collection.length);
    }

    protected addItemToDOM(item: Item<Model>, destination: HTMLElement = null): void {
        const shortestColumn = this.getShortestColumn();
        shortestColumn.addItem(item);
        super.addItemToDOM(item, shortestColumn.elementRef);
    }

    protected endResize() {

        super.endResize();

        if (!this.visibleCollection.length) {
            return;
        }

        // Compute with new width. Rows indexes may have change
        this.visibleCollection.length = 0;
        this.addColumns();
        this.addUntilFill();
    }

    protected addColumns() {
        this.bodyElementRef.innerHTML = '';
        this.columns = [];
        const columnWidth = this.getColumnWidth();
        for (let i = 0; i < this.getEstimatedColumnsPerRow(); i++) {
            const columnRef = new Column({width: columnWidth, gap: this.options.gap});
            this.columns.push(columnRef);
            this.bodyElementRef.appendChild(columnRef.init());
        }
    }

    protected empty() {
        super.empty();
        this.addColumns();
    }

    /**
     * Returns true if at least one columns doesn't overflow on the bottom of the viewport
     */
    private viewPortIsNotFilled(): boolean {
        return this.columns.some(c => c.elementRef.getBoundingClientRect().bottom < document.documentElement.clientHeight);
    }

    private addItemsToDom(nbItems: number) {

        let nbVisibleImages = this.visibleCollection.length;

        // Next row to add (first invisible row)
        const firstIndex = this.visibleCollection.length ? nbVisibleImages : 0;
        const lastWantedIndex = firstIndex + nbItems - 1;

        // Compute size only for elements we're going to add
        this.organizeItems(this.collection.slice(nbVisibleImages), firstIndex, lastWantedIndex);

        for (let i = nbVisibleImages; i < this.collection.length; i++) {
            let item = this.collection[i];
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

    private getShortestColumn() {
        return this.columns.reduce((shortestColumn, column) => {
            if (!shortestColumn) {
                return column;
            }

            return column.height < shortestColumn.height ? column : shortestColumn;
        });
    }

}
