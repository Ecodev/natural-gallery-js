import {Item} from '../Item';
import {getImageRatio, getImageRatioAndIfCropped, RatioLimits} from '../Utility';
import {GalleryOptions, ModelAttributes, SizedModel} from './AbstractGallery';
import {AbstractRowGallery} from './AbstractRowGallery';

export interface NaturalGalleryOptions extends GalleryOptions {
    rowHeight: number;
    ratioLimit?: RatioLimits;
}

export class Natural<Model extends ModelAttributes = ModelAttributes> extends AbstractRowGallery<Model> {
    /**
     * Options after having been defaulted
     */
    declare protected options: Required<NaturalGalleryOptions>;

    constructor(elementRef: HTMLElement, options: NaturalGalleryOptions, scrollElementRef?: HTMLElement | null) {
        super(elementRef, options, scrollElementRef);
    }

    public static organizeItems<T extends ModelAttributes>(
        gallery: Natural<T>,
        items: Item<T>[],
        fromRow = 0,
        toRow: number | null = null,
        currentRow: number | null = null,
    ): void {
        if (!currentRow) {
            currentRow = fromRow ? fromRow : 0;
        }

        const options = gallery.options;

        // Read once: each read forces a layout of all items styled by computeSizes() for the previous row
        const galleryWidth = gallery.width;

        let row = currentRow;
        let rowStart = 0;
        while (rowStart < items.length) {
            const remainingCount = items.length - rowStart;
            let nextRowStart: number | null = null;

            for (let chunkSize = 1; chunkSize <= remainingCount; chunkSize++) {
                const chunk = items.slice(rowStart, rowStart + chunkSize);
                const rowWidth = this.getRowWidth(
                    chunk.map(c => c.model),
                    options.rowHeight,
                    options.gap,
                    options.ratioLimit,
                );

                if (rowWidth >= galleryWidth) {
                    // if end of row

                    this.computeSizes(chunk, galleryWidth, options.gap, row, null, options.ratioLimit);

                    const nextRow = row + 1;
                    if (toRow === null || nextRow <= toRow) {
                        nextRowStart = rowStart + chunkSize;
                        row = nextRow;
                    }

                    break;
                } else if (chunkSize === remainingCount) {
                    // if end of list
                    // the width is not fixed as we have not enough items
                    // size of images are indexed on max row height.
                    this.computeSizes(chunk, null, options.gap, row, options.rowHeight, options.ratioLimit);
                    break;
                }
            }

            if (nextRowStart === null) {
                break;
            }

            rowStart = nextRowStart;
        }
    }

    /**
     * Compute sizes for given images to fit in given row width
     * Items are updated
     */
    public static computeSizes<T extends ModelAttributes>(
        chunk: Item<T>[],
        containerWidth: number | null,
        margin: number,
        row: number,
        maxRowHeight: number | null = null,
        ratioLimits?: RatioLimits,
    ): void {
        const chunkModels = chunk.map(c => c.model);
        const rowHeight = containerWidth
            ? this.getRowHeight(chunkModels, containerWidth, margin, ratioLimits)
            : (maxRowHeight ?? 0);
        const rowWidth = this.getRowWidth(chunkModels, rowHeight, margin, ratioLimits);

        // Overflowed pixels
        const apportion = (rowWidth - (containerWidth ?? 0)) / chunk.length;
        const excess = containerWidth ? apportion : 0;
        let decimals = 0;

        for (let i = 0; i < chunk.length; i++) {
            const item = chunk[i];
            const {ratio, cropped} = getImageRatioAndIfCropped(item.model, ratioLimits);
            let width = ratio * rowHeight - excess;
            decimals += width - Math.floor(width);
            width = Math.floor(width);

            if (decimals >= 1 || (i === chunk.length - 1 && Math.round(decimals) === 1)) {
                width++;
                decimals--;
            }

            item.width = width;
            item.height = Math.floor(rowHeight);
            item.cropped = cropped;
            item.row = row;
            item.style();
        }
    }

    public static getRowWidth(
        models: SizedModel[],
        maxRowHeight: number,
        margin: number,
        ratioLimits?: RatioLimits,
    ): number {
        return margin * (models.length - 1) + this.getRatios(models, ratioLimits) * maxRowHeight;
    }

    public static getRowHeight(
        models: SizedModel[],
        containerWidth: number,
        margin: number,
        ratioLimits?: RatioLimits,
    ): number {
        return (containerWidth - margin * (models.length - 1)) / this.getRatios(models, ratioLimits);
    }

    /**
     * Return the ratio format of models as if they were a single image
     */
    public static getRatios(models: SizedModel[], ratioLimits?: RatioLimits): number {
        return models.reduce((total, model) => total + getImageRatio(model, ratioLimits), 0);
    }

    public organizeItems(items: Item<Model>[], fromRow?: number, toRow?: number): void {
        Natural.organizeItems(this, items, fromRow, toRow);
    }

    protected getFormatName(): string {
        return 'format-natural';
    }

    protected validateOptions(): void {
        if (!this.options.rowHeight || this.options.rowHeight <= 0) {
            throw new Error('Option.rowHeight must be positive');
        }
    }

    protected getEstimatedColumnsPerRow(): number {
        let ratio = 1;

        // Better prediction using ratio if provided
        if (this.options.ratioLimit?.min) {
            ratio = this.options.ratioLimit.min;
        }

        return Math.ceil(((1 / ratio) * this.width + this.options.gap) / (this.options.rowHeight + this.options.gap));
    }

    protected getEstimatedRowsPerPage(): number {
        return Math.ceil(this.getGalleryVisibleHeight() / (this.options.rowHeight + this.options.gap)) + 1;
    }
}
