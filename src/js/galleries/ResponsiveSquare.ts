import { Item } from '../Item';
import { ModelAttributes } from './AbstractGallery';
import { AbstractResponsiveRowGallery, ResponsiveGalleryOptions } from './AbstractResponsiveRowGallery';

export interface ResponsiveSquareGalleryOptions extends ResponsiveGalleryOptions {
}

export class ResponsiveSquare<Model extends ModelAttributes = any> extends AbstractResponsiveRowGallery {

    /**
     * Options after having been defaulted
     */
    protected options: ResponsiveSquareGalleryOptions;

    constructor(protected elementRef: HTMLElement,
                options: ResponsiveSquareGalleryOptions,
                protected photoswipeElementRef?: HTMLElement,
                protected scrollElementRef?: HTMLElement) {

        super(elementRef, options, photoswipeElementRef, scrollElementRef);
    }

    /**
     * Compute sides with 1:1 ratio
     */
    public static organizeItems(gallery: ResponsiveSquare, items: Item[], fromRow: number = 0, toRow: number = null): void {

        let itemsPerRow = gallery.getEstimatedColumnsPerRow();

        // Compute sideSize of pictures
        let sideSize = gallery.getItemSideSize();

        // Compute overflow of given images per row. This number affect the width of the last item of the row
        let diff = gallery.width - itemsPerRow * sideSize - (itemsPerRow - 1) * gallery.options.gap;

        let lastIndex = toRow ? itemsPerRow * (toRow - fromRow + 1) : items.length;
        lastIndex = lastIndex > items.length ? items.length : lastIndex;

        for (let i = 0; i < lastIndex; i++) {
            const item = items[i];
            item.last = i % itemsPerRow === itemsPerRow - 1;
            item.row = Math.floor(i / itemsPerRow) + fromRow;
            item.width = Math.floor(sideSize);
            item.height = Math.floor(sideSize);
            if (item.last) {
                item.width = Math.floor(sideSize + diff);
            }
            item.style();
        }
    }

    protected getEstimatedColumnsPerRow(): number {
        return Math.ceil((this.width + this.options.gap) / (this.options.rowHeight + this.options.gap));
    }

    protected getEstimatedRowsPerPage(): number {
        return Math.ceil(this.getGalleryVisibleHeight() / this.getItemSideSize());
    }

    protected getItemSideSize(): number {
        const itemsPerRow = this.getEstimatedColumnsPerRow();
        return (this.width - (itemsPerRow - 1) * this.options.gap) / itemsPerRow;
    }

    public organizeItems(items: Item[], fromRow?: number, toRow?: number): void {
        ResponsiveSquare.organizeItems(this, items, fromRow, toRow);
    }

}
