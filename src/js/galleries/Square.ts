import {Item} from '../Item';
import {GalleryOptions, ModelAttributes} from './AbstractGallery';
import {AbstractRowGallery} from './AbstractRowGallery';

export interface SquareGalleryOptions extends GalleryOptions {
    itemsPerRow: number;
}

export class Square<Model extends ModelAttributes = ModelAttributes> extends AbstractRowGallery<Model> {

    /**
     * Options after having been defaulted
     */
    protected declare options: Required<SquareGalleryOptions>;

    constructor(elementRef: HTMLElement,
                options: SquareGalleryOptions,
                scrollElementRef?: HTMLElement | null) {

        super(elementRef, options, scrollElementRef);

        if (!options.itemsPerRow || options.itemsPerRow <= 0) {
            throw new Error('Option.itemsPerRow must be positive');
        }
    }

    /**
     * Compute sides with 1:1 ratio
     */
    public static organizeItems<T extends ModelAttributes>(gallery: Square<T>, items: Item<T>[], firstRowIndex = 0, toRow: number | null = null): void {

        const sideSize = gallery.getItemSideSize();
        let lastIndex = toRow ? gallery.options.itemsPerRow * (toRow - firstRowIndex + 1) : items.length;
        lastIndex = lastIndex > items.length ? items.length : lastIndex;

        for (let i = 0; i < lastIndex; i++) {
            const item = items[i];
            item.width = Math.floor(sideSize);
            item.height = Math.floor(sideSize);
            item.cropped = true;
            item.last = i % gallery.options.itemsPerRow === gallery.options.itemsPerRow - 1;
            item.row = Math.floor(i / gallery.options.itemsPerRow) + firstRowIndex;
            item.style();
        }
    }

    protected getEstimatedColumnsPerRow(): number {
        return this.options.itemsPerRow;
    }

    protected getEstimatedRowsPerPage(): number {
        return Math.ceil(this.getGalleryVisibleHeight() / this.getItemSideSize());
    }

    /**
     * Return square side size
     */
    protected getItemSideSize(): number {
        const itemsPerRow = this.getEstimatedColumnsPerRow();
        return (this.width - (itemsPerRow - 1) * this.options.gap) / itemsPerRow;
    }

    public organizeItems(items: Item<Model>[], fromRow?: number, toRow?: number): void {
        Square.organizeItems(this, items, fromRow, toRow);
    }

}
