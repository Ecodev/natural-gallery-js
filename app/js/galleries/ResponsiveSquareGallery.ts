import { AbstractGallery } from './AbstractGallery';
import { ModelAttributes, ResponsiveSquareGalleryOptions } from '../types';
import { Item } from '../Item';

export class ResponsiveSquareGallery<Model extends ModelAttributes = any> extends AbstractGallery {

    protected defaultOptions: ResponsiveSquareGalleryOptions = {
        rowHeight: 400,
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

    protected options: ResponsiveSquareGalleryOptions;

    protected init(): void {
        super.init();
        this.elementRef.classList.add('responsive-square-gallery');
    }

    protected getEstimatedItemsPerRow(): number {
        return Math.ceil((this.width + this.options.gap) / (this.options.rowHeight + this.options.gap));
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
