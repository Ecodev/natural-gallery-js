import { Item } from '../Item';
import { AbstractRowGallery } from './AbstractRowGallery';
import { GalleryOptions, ModelAttributes } from './AbstractGallery';

export interface SquareGalleryOptions extends GalleryOptions {
    itemsPerRow: number;
}

export class Square<Model extends ModelAttributes = any> extends AbstractRowGallery {

    protected defaultOptions: SquareGalleryOptions = {
        itemsPerRow: 4,
        gap: 3,
        rowsPerPage: 0,
        showLabels: 'hover',
        lightbox: false,
        minRowsAtStart: 2,
        selectable: false,
        activable: false,
        infiniteScrollOffset: 0,
        photoSwipeOptions: null,
    };

    protected options: SquareGalleryOptions;

    protected getEstimatedItemsPerRow() {
        return this.options.itemsPerRow;
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
            item.style();
        }
    }

    protected getEstimatedRowsPerPage(): number {
        return Math.ceil(this.getGalleryVisibleHeight() / this.getItemSideSize());
    }

    /**
     * Return square side size
     */
    protected getItemSideSize(): number {
        const itemsPerRow = this.getEstimatedItemsPerRow();
        return (this.width - (itemsPerRow - 1) * this.options.gap) / itemsPerRow;
    }

}
