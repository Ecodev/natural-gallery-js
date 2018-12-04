import { Item } from '../Item';
import { AbstractResponsiveRowGallery } from './AbstractResponsiveRowGallery';
import { GalleryOptions, ModelAttributes } from './AbstractGallery';

export interface NaturalGalleryOptions extends GalleryOptions {
    rowHeight: number;
}

export class Natural<Model extends ModelAttributes = any> extends AbstractResponsiveRowGallery {

    protected defaultOptions: NaturalGalleryOptions = {
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

    protected options: NaturalGalleryOptions;

    protected getEstimatedItemsPerRow(): number {
        return Math.ceil((this.width + this.options.gap) / (this.options.rowHeight + this.options.gap));
    }

    protected getEstimatedRowsPerPage(): number {
        return Math.ceil(this.getGalleryVisibleHeight() / (this.options.rowHeight + this.options.gap)) + 1;
    }

    /**
     *
     * @param items
     * @param fromRow
     * @param toRow
     * @param currentRow
     */
    protected organizeItems(items: Item[], fromRow: number = 0, toRow: number = null, currentRow: number = null): void {

        if (!currentRow) {
            currentRow = fromRow ? fromRow : 0;
        }

        for (let chunkSize = 1; chunkSize <= items.length; chunkSize++) {
            let chunk = items.slice(0, chunkSize);
            let rowWidth = this.getRowWidth(this.options.rowHeight, this.options.gap, chunk);
            if (rowWidth >= this.width) { // if end of row
                this.computeSizes(chunk, this.width, this.options.gap, currentRow);

                const nextRow = currentRow + 1;
                if (toRow === null || nextRow <= toRow) {
                    this.organizeItems(items.slice(chunkSize), fromRow, toRow, nextRow);
                }

                break;
            } else if (chunkSize === items.length) {
                // if end of list
                // the width is not fixed as we have not enough items
                // size of images are indexed on max row height.
                this.computeSizes(chunk, null, this.options.gap, currentRow, this.options.rowHeight);
                break;
            }
        }
    }

    private computeSizes(chunk: Item[], containerWidth: number, margin: number, row: number, maxRowHeight: number = null): void {
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

    private getRowWidth(maxRowHeight: number, margin: number, items: Item[]): number {
        return margin * (items.length - 1) + this.getRatios(items) * maxRowHeight;
    }

    private getRowHeight(containerWidth: number, margin: number, items: Item[]): number {
        return containerWidth / this.getRatios(items) + margin * (items.length - 1);
    }

    private getRatios(items: Item[]): number {

        const self = this;
        let totalWidth = 0;

        for (let i = 0; i < items.length; i++) {
            totalWidth += self.getImageRatio(items[i]);
        }

        return totalWidth;
    }

    private getImageRatio(el: Item): number {
        return Number(el.enlargedWidth) / Number(el.enlargedHeight);
    }

    private apportionExcess(items: Item[], containerWidth: number, rowWidth: number): number {
        let excess = rowWidth - containerWidth;
        return excess / items.length;
    }
}
