import { Item } from '../Item';
import { AbstractResponsiveRowGallery, ResponsiveSquareGalleryOptions } from './AbstractResponsiveRowGallery';
import { ModelAttributes } from './AbstractGallery';

export class ResponsiveSquare<Model extends ModelAttributes = any> extends AbstractResponsiveRowGallery {

    protected defaultOptions: ResponsiveSquareGalleryOptions = {
        rowHeight: 400,
        gap: 3,
        rowsPerPage: 0,
        showLabels: 'hover',
        lightbox: false,
        minRowsAtStart: 2,
        selectable: false,
        activable: false,
        infiniteScrollOffset: 0,
        photoSwipeOptions: null,
        cover: false
    };

    protected options: ResponsiveSquareGalleryOptions;

    protected getEstimatedItemsPerRow(): number {
        return Math.ceil((this.width + this.options.gap) / (this.options.rowHeight + this.options.gap));
    }

    /**
     * Compute sides with 1:1 ratio
     * @param items
     * @param firstRowIndex
     * @param toRow
     */
    protected organizeItems(items: Item[], firstRowIndex: number = 0, toRow: number = null): void {

        let itemsPerRow = this.getEstimatedItemsPerRow();

        // Compute sideSize of pictures
        let sideSize = this.getItemSideSize();

        // Compute overflow of given images per row. This number affect the width of the last item of the row
        let diff = this.width - itemsPerRow * sideSize - (itemsPerRow - 1) * this.options.gap;

        let lastIndex = toRow ? itemsPerRow * (toRow - firstRowIndex + 1) : items.length;
        lastIndex = lastIndex > items.length ? items.length : lastIndex;

        for (let i = 0; i < lastIndex; i++) {
            const item = items[i];
            item.last = i % itemsPerRow === itemsPerRow - 1;
            item.row = Math.floor(i / itemsPerRow) + firstRowIndex;
            item.width = Math.floor(sideSize);
            item.height = Math.floor(sideSize);
            if (item.last) {
                item.width = Math.floor(sideSize + diff);
            }
            item.style();
        }
    }

    protected getItemSideSize(): number {
        const itemsPerRow = this.getEstimatedItemsPerRow();
        return (this.width - (itemsPerRow - 1) * this.options.gap) / itemsPerRow;
    }

    protected getEstimatedRowsPerPage(): number {
        return Math.ceil(this.getGalleryVisibleHeight() / this.getItemSideSize());
    }

}
