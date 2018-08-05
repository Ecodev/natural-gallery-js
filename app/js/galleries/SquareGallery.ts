import { AbstractGallery } from './AbstractGallery';
import { ModelAttributes, SquareGalleryOptions } from '../types';
import { Item } from '../Item';

export class SquareGallery<Model extends ModelAttributes = any> extends AbstractGallery {

    protected defaultOptions: SquareGalleryOptions = {
        itemsPerRow: 4,
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

    protected options: SquareGalleryOptions;

    protected init(): void {
        super.init();
        this.elementRef.classList.add('square-gallery');
    }

    protected getEstimatedItemsPerRow() {
        return this.options.itemsPerRow;
    }

    protected getEstimatedRowsPerPage(): number {
        let nbRows = Math.ceil(this.getFreeViewportSpace() / this.getItemSideSize());
        return nbRows < this.options.minRowsAtStart ? this.options.minRowsAtStart : nbRows;
    }

    /**
     * Compute sides with 1:1 ratio
     * @param items
     * @param firstRowIndex
     * @param toRow
     */
    protected organizeItems(items: Item[], firstRowIndex: number = 0, toRow: number = null): void {

        let sideSize = this.getItemSideSize();
        let lastIndex = toRow ? this.options.itemsPerRow * (toRow - firstRowIndex + 1) : items.length;
        lastIndex = lastIndex > items.length ? items.length : lastIndex;

        for (let i = 0; i < lastIndex; i++) {
            let item = items[i];
            item.width = Math.floor(sideSize);
            item.height = Math.floor(sideSize);
            item.last = i % this.options.itemsPerRow === this.options.itemsPerRow - 1;
            item.row = Math.floor(i / this.options.itemsPerRow) + firstRowIndex;
        }
    }

    /**
     * Return square side size
     */
    private getItemSideSize(): number {
        const itemsPerRow = this.getEstimatedItemsPerRow();
        return (this.width - (itemsPerRow - 1) * this.options.gap) / itemsPerRow;
    }

}
