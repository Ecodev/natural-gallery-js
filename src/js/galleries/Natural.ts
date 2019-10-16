import { Item } from '../Item';
import { ModelAttributes } from './AbstractGallery';
import { AbstractResponsiveRowGallery, ResponsiveGalleryOptions } from './AbstractResponsiveRowGallery';

export interface NaturalGalleryOptions extends ResponsiveGalleryOptions {
}

export class Natural<Model extends ModelAttributes = any> extends AbstractResponsiveRowGallery {

    /**
     * Options after having been defaulted
     */
    protected options: NaturalGalleryOptions;

    constructor(protected elementRef: HTMLElement,
                options: NaturalGalleryOptions,
                protected photoswipeElementRef?: HTMLElement,
                protected scrollElementRef?: HTMLElement) {

        super(elementRef, options, photoswipeElementRef, scrollElementRef);
    }

    public static organizeItems(gallery: Natural,
                                items: Item[],
                                fromRow: number = 0,
                                toRow: number = null,
                                currentRow: number = null): void {

        if (!currentRow) {
            currentRow = fromRow ? fromRow : 0;
        }

        for (let chunkSize = 1; chunkSize <= items.length; chunkSize++) {
            let chunk = items.slice(0, chunkSize);
            let rowWidth = this.getRowWidth(gallery.options.rowHeight, gallery.options.gap, chunk);

            if (rowWidth >= gallery.width) {
                // if end of row

                this.computeSizes(chunk, gallery.width, gallery.options.gap, currentRow);

                const nextRow = currentRow + 1;
                if (toRow === null || nextRow <= toRow) {
                    Natural.organizeItems(gallery, items.slice(chunkSize), fromRow, toRow, nextRow);
                }

                break;
            } else if (chunkSize === items.length) {
                // if end of list
                // the width is not fixed as we have not enough items
                // size of images are indexed on max row height.
                this.computeSizes(chunk, null, gallery.options.gap, currentRow, gallery.options.rowHeight);
                break;
            }
        }
    }

    private static computeSizes(chunk: Item[],
                                containerWidth: number,
                                margin: number,
                                row: number,
                                maxRowHeight: number = null): void {

        let rowHeight = containerWidth ? this.getRowHeight(containerWidth, margin, chunk) : maxRowHeight;
        let rowWidth = this.getRowWidth(rowHeight, margin, chunk);

        let excess = containerWidth ? this.apportionExcess(chunk, containerWidth, rowWidth) : 0;
        let decimals = 0;

        for (let i = 0; i < chunk.length; i++) {
            let item = chunk[i];
            let width = this.getImageRatio(item) * rowHeight - excess;
            decimals += width - Math.floor(width);
            width = Math.floor(width);

            if (decimals >= 1 || i === chunk.length - 1 && Math.round(decimals) === 1) {
                width++;
                decimals--;
            }

            item.width = width;
            item.height = Math.floor(rowHeight);
            item.row = row;
            item.last = i === chunk.length - 1;
            item.style();
        }
    }

    private static getRowWidth(maxRowHeight: number, margin: number, items: Item[]): number {
        return margin * (items.length - 1) + this.getRatios(items) * maxRowHeight;
    }

    private static getRowHeight(containerWidth: number, margin: number, items: Item[]): number {
        return containerWidth / this.getRatios(items) + margin * (items.length - 1);
    }

    private static getRatios(items: Item[]): number {

        let totalWidth = 0;

        for (let i = 0; i < items.length; i++) {
            totalWidth += this.getImageRatio(items[i]);
        }

        return totalWidth;
    }

    private static getImageRatio(el: Item): number {
        return Number(el.enlargedWidth) / Number(el.enlargedHeight);
    }

    private static apportionExcess(items: Item[], containerWidth: number, rowWidth: number): number {
        let excess = rowWidth - containerWidth;
        return excess / items.length;
    }

    protected getEstimatedColumnsPerRow(): number {
        return Math.ceil((this.width + this.options.gap) / (this.options.rowHeight + this.options.gap));
    }

    protected getEstimatedRowsPerPage(): number {
        return Math.ceil(this.getGalleryVisibleHeight() / (this.options.rowHeight + this.options.gap)) + 1;
    }

    public organizeItems(items: Item[], fromRow?: number, toRow?: number): void {
        Natural.organizeItems(this, items, fromRow, toRow);
    }
}
