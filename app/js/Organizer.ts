/**
 * Based on http://blog.vjeux.com/2012/image/image-layout-algorithm-google-plus.html
 *
 * First, compute the number of pictures per row, based on target height (maxRowHeight).
 * Then compute the final height according to full container inner width
 *
 * Uses json, never read the dom, except to determine the size of parent container.
 *
 */
import { Gallery } from './Gallery';
import { Item } from './Item';

export module Organizer {

    export function organize(collection: Item[], gallery: Gallery, fromRow: number = null, toRow: number = null) {

        if (gallery.options.format === 'natural') {
            this.organizeNatural(collection, gallery.bodyWidth, gallery.options.rowHeight, gallery.options.margin, fromRow, toRow);
        } else if (gallery.options.format === 'square' && gallery.options.imagesPerRow) {
            this.organizeSquareByImagesPerRow(collection, gallery.bodyWidth, gallery.options.imagesPerRow, gallery.options.margin);
        } else if (gallery.options.format === 'square' && gallery.options.rowHeight) {
            this.organizeSquareByRowHeight(collection, gallery.bodyWidth, gallery.options.rowHeight, gallery.options.margin);
        }
    }

    export function simulatePagination(gallery: Gallery) {
        const margin = gallery.options.margin ? gallery.options.margin : 0;
        const imageWidth = Math.ceil(gallery.options.rowHeight * gallery.defaultImageRatio + margin);
        const nb = (gallery.bodyWidth + margin) / (imageWidth + margin);
        return Math.ceil(nb);
    }

    /**
     *
     * @param elements
     * @param containerWidth
     * @param maxRowHeight
     * @param margin
     */
    export function organizeSquareByRowHeight(elements, containerWidth, maxRowHeight, margin) {

        if (!margin) {
            margin = 0;
        }

        let nbPictPerRow = Math.ceil((containerWidth + margin) / (maxRowHeight + margin));

        // Compute size of pictures
        let size = Math.round((containerWidth + margin - nbPictPerRow * margin) / nbPictPerRow);

        // Compute overflow of given images per row. This number affect the width of the last item of the row
        let diff = containerWidth - nbPictPerRow * size - (nbPictPerRow - 1) * margin;

        for (let i = 0; i < elements.length; i++) {
            let element = elements[i];
            element.last = i % nbPictPerRow === nbPictPerRow - 1;
            element.row = Math.floor(i / nbPictPerRow);

            element.width = Math.floor(size);
            element.height = Math.floor(size);
            if (element.last) {
                element.width = Math.floor(size + diff);
            }
        }

    }

    /**
     * Compute sizes for images with 1:1 ratio
     * @param elements
     * @param containerWidth
     * @param nbPictPerRow
     * @param margin
     */
    export function organizeSquareByImagesPerRow(elements, containerWidth, nbPictPerRow, margin) {

        if (!margin) {
            margin = 0;
        }

        if (!nbPictPerRow) {
            nbPictPerRow = 4;
        }

        let size = (containerWidth - (nbPictPerRow - 1) * margin) / nbPictPerRow;

        for (let i = 0; i < elements.length; i++) {
            let element = elements[i];
            element.width = Math.floor(size);
            element.height = Math.floor(size);
            element.last = i % nbPictPerRow === nbPictPerRow - 1;
            element.row = Math.floor(i / nbPictPerRow);
        }
    }

    /**
     * Compute sizes for images that keep the most their native proportion
     * @param elements
     * @param containerWidth
     * @param maxRowHeight
     * @param margin
     * @param fromRow
     * @param toRow
     * @param currentRow
     */
    export function organizeNatural(elements,
                                    containerWidth,
                                    maxRowHeight,
                                    margin,
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

        for (let chunkSize = 1; chunkSize <= elements.length; chunkSize++) {
            let chunk = elements.slice(0, chunkSize);
            let rowWidth = this.getRowWidth(maxRowHeight, margin, chunk);
            if (rowWidth >= containerWidth) { // if end of row
                this.computeSizes(chunk, containerWidth, margin, currentRow);

                const nextRow = currentRow + 1;
                if (toRow === null || nextRow <= toRow) {
                    this.organizeNatural(elements.slice(chunkSize), containerWidth, maxRowHeight, margin, fromRow, toRow, nextRow);
                }

                break;
            } else if (chunkSize === elements.length) { // if end of list
                // the width is not fixed as we have not enough elements
                // size of images are indexed on max row height.
                this.computeSizes(chunk, null, margin, currentRow, maxRowHeight);
                break;
            }
        }
    }

    export function computeSizes(chunk, containerWidth, margin, row, maxRowHeight = null) {
        let rowHeight = containerWidth ? this.getRowHeight(containerWidth, margin, chunk) : maxRowHeight;
        let rowWidth = this.getRowWidth(rowHeight, margin, chunk);

        let excess = containerWidth ? this.apportionExcess(chunk, containerWidth, rowWidth) : 0;
        let decimals = 0;

        for (let i = 0; i < chunk.length; i++) {
            let element = chunk[i];
            let width = this.getImageRatio(element) * rowHeight - excess;
            decimals += width - Math.floor(width);
            width = Math.floor(width);

            if (decimals >= 1 || i === chunk.length - 1 && Math.round(decimals) === 1) {
                width++;
                decimals--;
            }

            element.width = width;
            element.height = Math.floor(rowHeight);
            element.row = row;
            element.last = i === chunk.length - 1;
        }
    }

    export function getRowWidth(maxRowHeight, margin, elements) {
        return margin * (elements.length - 1) + this.getRatios(elements) * maxRowHeight;
    }

    export function getRowHeight(containerWidth, margin, elements) {
        return containerWidth / this.getRatios(elements) + margin * (elements.length - 1);
    }

    export function getRatios(elements) {

        const self = this;
        let totalWidth = 0;

        for (let i = 0; i < elements.length; i++) {
            totalWidth += self.getImageRatio(elements[i]);
        }

        return totalWidth;
    }

    export function getImageRatio(el) {
        return Number(el.tWidth) / Number(el.tHeight);
    }

    export function apportionExcess(elements, containerWidth, rowWidth) {
        let excess = rowWidth - containerWidth;
        let excessPerItem = excess / elements.length;
        return excessPerItem;
    }

}
