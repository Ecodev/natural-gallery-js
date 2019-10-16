import { Item } from '../Item';
import { ModelAttributes, SizedModel } from './AbstractGallery';
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
            let rowWidth = this.getRowWidth(chunk.map(c => c.model), gallery.options.rowHeight, gallery.options.gap);

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

    /**
     * Compute sizes for given images to fit in given row width
     * Items are updated
     *
     * @param chunk
     * @param containerWidth
     * @param margin
     * @param row
     * @param maxRowHeight
     */
    public static computeSizes(chunk: Item[],
                               containerWidth: number,
                               margin: number,
                               row: number,
                               maxRowHeight: number = null): void {

        const chunkModels = chunk.map(c => c.model);
        let rowHeight = containerWidth ? this.getRowHeight(chunkModels, containerWidth, margin) : maxRowHeight;
        let rowWidth = this.getRowWidth(chunkModels, rowHeight, margin);

        // Overflowed pixels
        const apportion = (rowWidth - containerWidth) / chunk.length;
        let excess = containerWidth ? apportion : 0;
        let decimals = 0;

        for (let i = 0; i < chunk.length; i++) {
            let item = chunk[i];
            let width = this.getImageRatio(item.model) * rowHeight - excess;
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

    public static getRowWidth(models: SizedModel[], maxRowHeight: number, margin: number): number {
        return margin * (models.length - 1) + this.getRatios(models) * maxRowHeight;
    }

    public static getRowHeight(models: SizedModel[], containerWidth: number, margin: number): number {
        return containerWidth / this.getRatios(models) - margin * (models.length - 1);
    }

    /**
     * Return the ratio format of models as if they where a single image
     */
    public static getRatios(models: SizedModel[]): number {
        return models.reduce((total, model) => total + this.getImageRatio(model), 0);
    }

    private static getImageRatio(model: SizedModel): number {
        return Number(model.enlargedWidth) / Number(model.enlargedHeight);
    }

    public organizeItems(items: Item[], fromRow?: number, toRow?: number): void {
        Natural.organizeItems(this, items, fromRow, toRow);
    }

    protected getEstimatedColumnsPerRow(): number {
        return Math.ceil((this.width + this.options.gap) / (this.options.rowHeight + this.options.gap));
    }

    protected getEstimatedRowsPerPage(): number {
        return Math.ceil(this.getGalleryVisibleHeight() / (this.options.rowHeight + this.options.gap)) + 1;
    }
}
