/**
 * Based on http://blog.vjeux.com/2012/image/image-layout-algorithm-google-plus.html
 *
 * First, compute the number of pictures per row, based on target height (maxRowHeight).
 * Then compute the final height according to full container inner width
 *
 * Uses json, never read the dom, except to determine the size of parent container.
 *
 */
var natural_gallery_organizer = {

    organize: function(gallery) {

        var galleries = gallery ? [gallery] : naturalGalleries;

        for (var i = 0; i < galleries.length; i++) {

            var gallery = galleries[i];
            var elements = gallery.filtered ? gallery.selection : gallery.images;

            if (gallery.thumbnailFormat == 'natural') {
                this.organizeNatural(elements, gallery.bodyElementWidth, gallery.thumbnailMaximumHeight, gallery.margin);
            } else if (gallery.thumbnailFormat == 'square') {
                this.organizeSquare(elements, gallery.bodyElementWidth, gallery.imagesPerRow, gallery.margin);
            }

        }
    },

    /**
     * Compute sizes for images with 1:1 ratio
     * @param elements«
     * @param containerWidth
     * @param nbPictPerRow
     * @param margin
     */
    organizeSquare: function(elements, containerWidth, nbPictPerRow, margin) {

        if (!margin) {
            margin = 0;
        }

        if (!nbPictPerRow) {
            nbPictPerRow = 4;// Should match the default value of imagesPerRow field from flexform
        }

        var size = (containerWidth - (nbPictPerRow - 1) * margin) / nbPictPerRow;

        for (var i = 0; i < elements.length; i++) {
            var element = elements[i];
            element.width = Math.floor(size);
            element.height = Math.floor(size);
            element.last = i % nbPictPerRow === nbPictPerRow - 1;
            element.row = Math.floor(i / nbPictPerRow);
        }
    },

    /**
     * Compute sizes for images that keep the most their native proportion
     * @param elements
     * @param containerWidth
     * @param maxRowHeight
     * @param margin
     * @param row
     */
    organizeNatural: function(elements, containerWidth, maxRowHeight, margin, row) {

        if (!row) {
            row = 0;
        }

        if (!margin) {
            margin = 0;
        }

        if (!maxRowHeight) {
            maxRowHeight = 300; // Should match the default value of thumbnailMaximumHeight field from flexform
        }

        for (var chunkSize = 1; chunkSize <= elements.length; chunkSize++) {
            var chunk = elements.slice(0, chunkSize);
            var rowWidth = this.getRowWidth(maxRowHeight, margin, chunk);
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
    },

    computeSizes: function(chunk, containerWidth, margin, row, maxRowHeight) {
        var rowHeight = containerWidth ? this.getRowHeight(containerWidth, margin, chunk) : maxRowHeight;
        var rowWidth = this.getRowWidth(rowHeight, margin, chunk);

        var excess = containerWidth ? this.apportionExcess(chunk, containerWidth, rowWidth) : 0;
        var decimals = 0;

        for (var i = 0; i < chunk.length; i++) {
            var element = chunk[i];
            var width = this.getImageRatio(element) * rowHeight - excess;
            decimals += width - Math.floor(width);
            width = Math.floor(width);

            if (decimals >= 1 || i === chunk.length - 1 && Math.round(decimals) === 1) {
                width++;
                decimals--;
            }

            element.oldWidth = element.width;
            element.oldHeight = element.height;
            element.width = width;
            element.height = Math.floor(rowHeight);
            element.row = row;
            element.last = i == chunk.length - 1;
        }
    },

    getRowWidth: function(maxRowHeight, margin, elements) {
        return margin * (elements.length - 1) + this.getRatios(elements) * maxRowHeight;
    },

    getRowHeight: function(containerWidth, margin, elements) {
        return containerWidth / this.getRatios(elements) + margin * (elements.length - 1);
    },

    getRatios: function(elements) {

        var self = this;
        var totalWidth = 0;

        for (var i = 0; i < elements.length; i++) {
            totalWidth += self.getImageRatio(elements[i]);
        }

        return totalWidth;
    },

    getImageRatio: function(el) {
        return Number(el.tWidth) / Number(el.tHeight);
    },

    apportionExcess: function(elements, containerWidth, rowWidth) {
        var excess = rowWidth - containerWidth;
        var excessPerItem = excess / elements.length;
        return excessPerItem
    }
};
