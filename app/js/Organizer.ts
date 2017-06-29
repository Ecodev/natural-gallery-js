/**
 * Based on http://blog.vjeux.com/2012/image/image-layout-algorithm-google-plus.html
 *
 * First, compute the number of pictures per row, based on target height (maxRowHeight).
 * Then compute the final height according to full container inner width
 *
 * Uses json, never read the dom, except to determine the size of parent container.
 *
 */
import {Gallery} from './Gallery';

export module Organizer {

    export function organize(gallery: Gallery) {

        if (gallery.options.format == 'natural') {
            this.organizeNatural(gallery.collection, gallery.bodyWidth, gallery.options.rowHeight, gallery.options.margin);
        } else if (gallery.options.format == 'square') {
            this.organizeSquare(gallery.collection, gallery.bodyWidth, gallery.options.imagesPerRow, gallery.options.margin);
        }

        gallery.style();
    }

    /**
     * Compute sizes for images with 1:1 ratio
     * @param elements«
     * @param containerWidth
     * @param nbPictPerRow
     * @param margin
     */
    export function organizeSquare(elements, containerWidth, nbPictPerRow, margin) {

        if (!margin) {
            margin = 0;
        }

        if (!nbPictPerRow) {
            nbPictPerRow = 4;// Should match the default value of imagesPerRow field from flexform
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
     * @param row
     */
    export function organizeNatural(elements, containerWidth, maxRowHeight, margin, row = null) {

        if (!row) {
            row = 0;
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
                this.computeSizes(chunk, containerWidth, margin, row);
                this.organizeNatural(elements.slice(chunkSize), containerWidth, maxRowHeight, margin, row + 1);
                break;
            } else if (chunkSize == elements.length) { // if end of list
                // the width is not fixed as we have not enough elements
                // size of images are indexed on max row height.
                this.computeSizes(chunk, null, margin, row, maxRowHeight);
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
            element.last = i == chunk.length - 1;
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
        return excessPerItem
    }

}
