import { AbstractGallery } from './AbstractGallery';
import { MasonryGalleryOptions, ModelAttributes } from '../types';
import { Item } from '../Item';
import { Column } from '../Column';

export class MasonryGallery<Model extends ModelAttributes = any> extends AbstractGallery {

    protected defaultOptions: MasonryGalleryOptions = {
        columnWidth: 300,
        gap: 3,
        rowsPerPage: 0,
        showLabels: 'hover',
        lightbox: true,
        minRowsAtStart: 2,
        showCount: false,
        selectable: false,
        activable: false,
        infiniteScrollOffset: 0,
        events: null,
    };

    protected options: MasonryGalleryOptions;

    protected columnsRef: Column[];

    protected init(): void {
        super.init();
        this.elementRef.classList.add('masonry-gallery');
        this.addColumns();
    }

    protected getEstimatedItemsPerRow(): number {
        return Math.ceil((this.width - this.options.gap) / (this.options.columnWidth + this.options.gap));
    }

    protected getEstimatedRowsPerPage(): number {
        let nbRows = Math.floor(this.getFreeViewportSpace() / this.getColumnWidth() * 2);
        return nbRows < this.options.minRowsAtStart ? this.options.minRowsAtStart : nbRows;
    }

    protected addRows(rows: number): void {
        this.addImages(rows * this.getEstimatedRowsPerPage()); // here rows are in fact a number of items
    }

    private addImages(nbItems) {

        let nbVisibleImages = this.visibleCollection.length;

        // Next row to add (first invisible row)
        const firstIndex = this.visibleCollection.length ? nbVisibleImages : 0;
        const lastIndex = firstIndex + nbItems - 1;

        // Compute size only for elements we're going to add
        this.organizeItems(this.collection.slice(nbVisibleImages), firstIndex, lastIndex);

        for (let i = nbVisibleImages; i < this.collection.length; i++) {
            let item = this.collection[i];
            item.style();
            if (i <= lastIndex) {
                this.addItemToDOM(item);
            } else {
                break;
            }
        }

        this.showScrollBufferItems();
        this.updateNextButtonVisibility();
    }

    protected addItemToDOM(item: Item<Model>, destination: HTMLElement = null): void {
        const shortestColumn = this.getShortestColumn();
        shortestColumn.addItem(item);
        super.addItemToDOM(item, shortestColumn.elementRef);
    }

    public endResize() {

        this.bodyElementRef.classList.remove('resizing');

        if (!this.visibleCollection.length) {
            return;
        }

        // Compute with new width. Rows indexes may have change
        this.organizeItems(this.visibleCollection);
        const rowsToAdd = this.getMaximumItemsPerColumn();
        this.visibleCollection.length = 0;
        this.addColumns();
        this.addRows(rowsToAdd);

    }

    protected addColumns() {
        this.bodyElementRef.innerHTML = '';
        this.columnsRef = [];
        const columnWidth = this.getColumnWidth();
        for (let i = 0; i < this.getEstimatedItemsPerRow(); i++) {
            const columnRef = new Column({width: columnWidth, gap: this.options.gap});
            this.columnsRef.push(columnRef);
            this.bodyElementRef.appendChild(columnRef.init());
        }
    }

    /**
     * Compute sides with 1:1 ratio
     * @param items
     * @param fromIndex
     * @param toIndex
     */
    protected organizeItems(items: Item[], fromIndex: number = 0, toIndex: number = null): void {

        let itemsPerRow = this.getEstimatedItemsPerRow();

        // Compute columnWidth of pictures
        let columnWidth = this.getColumnWidth();

        let lastIndex = toIndex ? itemsPerRow * (toIndex - fromIndex + 1) : items.length;
        lastIndex = lastIndex > items.length ? items.length : lastIndex;

        for (let i = 0; i < lastIndex; i++) {
            const item = items[i];
            item.last = true;
            item.width = Math.floor(columnWidth);
            item.height = item.width * item.model.enlargedWidth / item.model.enlargedHeight;

        }
    }

    /**
     * Return square side size
     */
    private getColumnWidth(): number {
        const itemsPerRow = this.getEstimatedItemsPerRow();
        return Math.floor((this.width - (itemsPerRow - 1) * this.options.gap) / itemsPerRow);
    }

    private getShortestColumn() {
        return this.columnsRef.reduce((shortestColumn, column) => {
            if (!shortestColumn) {
                return column;
            }

            return column.height < shortestColumn.height ? column : shortestColumn;
        });
    }

    private getMaximumItemsPerColumn() {
        return Math.max(...this.columnsRef.map(column => column.length));
    }

}
