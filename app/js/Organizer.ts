/**
 * Based on http://blog.vjeux.com/2012/image/image-layout-algorithm-google-plus.html
 *
 * First, compute the number of pictures per row, based on target height (maxRowHeight).
 * Then compute the final height according to full container inner width
 *
 * Uses json, never read the dom, except to determine the size of parent container.
 *
 */
import { Item } from './Item';
import { GalleryOptions } from './types';

export module Organizer {

    export function organize(collection: Item[], width: number, options: GalleryOptions, fromRow: number = null, toRow: number = null) {

        if (options.format === 'natural') {
            this.organizeNatural(collection, width, options.rowHeight, options.gap, fromRow, toRow);
        } else if (options.format === 'square' && options.imagesPerRow) {
            this.organizeSquareByImagesPerRow(collection, width, options.imagesPerRow, options.gap, fromRow, toRow);
        } else if (options.format === 'square' && options.rowHeight) {
            this.organizeSquareByRowHeight(collection, width, options.rowHeight, options.gap, fromRow, toRow);
        }
    }

    export function simulatePagination(width: number, defaultImageRatio: number, options: GalleryOptions) {
        const margin = options.gap ? options.gap : 0;
        const imageWidth = Math.ceil(options.rowHeight * defaultImageRatio + margin);
        const nb = (width + margin) / (imageWidth + margin);
        return Math.ceil(nb);
    }

    /**
     *
     * @param items
     * @param containerWidth
     * @param maxRowHeight
     * @param margin
     * @param firstRowIndex
     * @param toRow
     */
    export function organizeSquareByRowHeight(items: Item[],
                                              containerWidth: number,
                                              maxRowHeight: number,
                                              margin: number,
                                              firstRowIndex: number = 0,
                                              toRow: number = null) {

        if (!margin) {
            margin = 0;
        }

        let nbPictPerRow = Math.ceil((containerWidth + margin) / (maxRowHeight + margin));

        // Compute size of pictures
        let size = Math.round((containerWidth + margin - nbPictPerRow * margin) / nbPictPerRow);

        // Compute overflow of given images per row. This number affect the width of the last item of the row
        let diff = containerWidth - nbPictPerRow * size - (nbPictPerRow - 1) * margin;

        // const start = 0;
        // const end = items.length;
        let lastIndex = toRow ? nbPictPerRow * (toRow - firstRowIndex + 1) : items.length;
        lastIndex = lastIndex > items.length ? items.length : lastIndex;

        for (let i = 0; i < lastIndex; i++) {
            const item = items[i];
            item.last = i % nbPictPerRow === nbPictPerRow - 1;
            item.row = Math.floor(i / nbPictPerRow) + firstRowIndex;
            item.width = Math.floor(size);
            item.height = Math.floor(size);
            if (item.last) {
                item.width = Math.floor(size + diff);
            }
        }

    }

    /**
     * Compute sizes for images with 1:1 ratio
     * @param items
     * @param containerWidth
     * @param nbPictPerRow
     * @param margin
     * @param firstRowIndex
     * @param toRow
     */
    export function organizeSquareByImagesPerRow(items: Item[],
                                                 containerWidth: number,
                                                 nbPictPerRow: number,
                                                 margin: number,
                                                 firstRowIndex: number = 0,
                                                 toRow: number = null) {

        if (!margin) {
            margin = 0;
        }

        if (!nbPictPerRow) {
            nbPictPerRow = 4;
        }

        let size = (containerWidth - (nbPictPerRow - 1) * margin) / nbPictPerRow;

        let lastIndex = toRow ? nbPictPerRow * (toRow - firstRowIndex + 1) : items.length;
        lastIndex = lastIndex > items.length ? items.length : lastIndex;

        for (let i = 0; i < lastIndex; i++) {
            let item = items[i];
            item.width = Math.floor(size);
            item.height = Math.floor(size);
            item.last = i % nbPictPerRow === nbPictPerRow - 1;
            item.row = Math.floor(i / nbPictPerRow) + firstRowIndex;
        }
    }

    /**
     * Compute sizes for images that keep the most their native proportion
     * @param items
     * @param containerWidth
     * @param maxRowHeight
     * @param margin
     * @param fromRow
     * @param toRow
     * @param currentRow
     */
    export function organizeNatural(items: Item[],
                                    containerWidth: number,
                                    maxRowHeight: number,
                                    margin: number,
                                    fromRow: number = null,
                                    toRow: number = null,
                                    currentRow: number = null) {

        if (!currentRow) {
            currentRow = fromRow ? fromRow : 0;
        }

        if (!margin) {
            margin = 0;
        }

        if (!maxRowHeight) {
            maxRowHeight = 300; // Should match the default value of thumbnailMaximumHeight field from flexform
        }

        for (let chunkSize = 1; chunkSize <= items.length; chunkSize++) {
            let chunk = items.slice(0, chunkSize);
            let rowWidth = this.getRowWidth(maxRowHeight, margin, chunk);
            if (rowWidth >= containerWidth) { // if end of row
                this.computeSizes(chunk, containerWidth, margin, currentRow);

                const nextRow = currentRow + 1;
                if (toRow === null || nextRow <= toRow) {
                    this.organizeNatural(items.slice(chunkSize), containerWidth, maxRowHeight, margin, fromRow, toRow, nextRow);
                }

                break;
            } else if (chunkSize === items.length) {
                // if end of list
                // the width is not fixed as we have not enough items
                // size of images are indexed on max row height.
                this.computeSizes(chunk, null, margin, currentRow, maxRowHeight);
                break;
            }
        }
    }

    export function computeSizes(chunk: Item[], containerWidth: number, margin: number, row: number, maxRowHeight: number = null): void {
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
        }
    }

    export function getRowWidth(maxRowHeight: number, margin: number, items: Item[]): number {
        return margin * (items.length - 1) + this.getRatios(items) * maxRowHeight;
    }

    export function getRowHeight(containerWidth: number, margin: number, items: Item[]): number {
        return containerWidth / this.getRatios(items) + margin * (items.length - 1);
    }

    export function getRatios(items: Item[]): number {

        const self = this;
        let totalWidth = 0;

        for (let i = 0; i < items.length; i++) {
            totalWidth += self.getImageRatio(items[i]);
        }

        return totalWidth;
    }

    export function getImageRatio(el: Item): number {
        return Number(el.thumbnailWidth) / Number(el.thumbnailHeight);
    }

    export function apportionExcess(items: Item[], containerWidth: number, rowWidth: number): number {
        let excess = rowWidth - containerWidth;
        return excess / items.length;
    }

}
