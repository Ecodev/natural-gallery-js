import {Item, ModelAttributes, Natural} from '../../src';
import * as domino from 'domino';
import {describe, expect, it, vi} from 'vitest';
import {getContainerElement, getImages, getSize, scrollTo} from './utils';
import {getBaseExpectedOptions, testGallery} from './abstract-gallery';

describe('Natural Gallery', () => {
    testGallery(
        Natural,
        {
            rowHeight: 300, // new from default
            gap: 4, // different from default
            ratioLimit: {
                min: 0.6,
                max: 0.8,
            },
        },
        {
            itemsInFirstPage: 20,
            itemsInSecondPage: 40,
            options: {
                ...getBaseExpectedOptions(),
                rowHeight: 300,
                ratioLimit: {
                    min: 0.6,
                    max: 0.8,
                },
            },
        },
    );

    it('should error with invalid column size', () => {
        const container = getContainerElement();
        expect(() => new Natural(container, {rowHeight: -300})).toThrow('Option.rowHeight must be positive');
    });

    it('should neither touch the DOM nor emit pagination with an invalid option', () => {
        const container = getContainerElement();
        const paginationSpy = vi.fn();
        container.addEventListener('pagination', paginationSpy);

        expect(() => new Natural(container, {rowHeight: -300})).toThrow('Option.rowHeight must be positive');
        expect(paginationSpy).not.toHaveBeenCalled();
        expect(container.className).toBe('');
        expect(container.childNodes.length).toBe(0);
    });

    it('should estimate columns with ratioLimit.max but no min', () => {
        const container = getContainerElement(999);
        const gallery = new Natural(container, {rowHeight: 300, ratioLimit: {max: 2}});
        gallery.addItems(getImages(5));
        expect(gallery.collection.every(item => item.height > 0)).toBe(true);
    });

    it('should use zero height when containerWidth and maxRowHeight are both null', () => {
        const container = getContainerElement(999);
        const gallery = new Natural(container, {rowHeight: 400});
        gallery.addItems(getImages(2));

        Natural.computeSizes(gallery.collection, null, 0, 0, null);
        expect(gallery.collection[0].height).toBe(0);
        expect(gallery.collection[0].width).toBe(0);
    });

    it('should complete last incomplete row when new items fit alongside existing', () => {
        const container = getContainerElement(999);
        const gallery = new Natural(container, {rowHeight: 300, gap: 4});
        gallery.addItems(getImages(3)); // A,B → row 0; C → row 1 alone (incomplete)
        const [, , c] = gallery.collection;
        expect(c.row).toBe(1);
        const incompleteHeight = c.height;

        gallery.addItems(getImages(2)); // C and D → row 1, now complete; E → row 2
        const [, , , d, e] = gallery.collection;
        expect(d.row).toBe(1);
        expect(e.row).toBe(2);
        expect(c.height).toBeLessThan(incompleteHeight);
    });

    it('should scroll a custom scrollElementRef when provided, instead of the window', () => {
        const scrollElementRef = document.createElement('div');
        const scrollToSpy = vi.fn();
        Object.defineProperty(scrollElementRef, 'scrollTo', {value: scrollToSpy, writable: true, configurable: true});

        const windowScrollToSpy = vi.fn();
        Object.defineProperty(window, 'scrollTo', {value: windowScrollToSpy, writable: true, configurable: true});

        const container = getContainerElement();
        const gallery = new Natural(container, {rowHeight: 300}, scrollElementRef);
        gallery.addItems(getImages(5));

        gallery.scrollToItem(gallery.collection[0]);

        expect(scrollToSpy).toHaveBeenCalledTimes(1);
        expect(windowScrollToSpy).not.toHaveBeenCalled();
    });

    it('should anchor on the row crossing the top of the viewport when the next row is taller than the viewport', () => {
        scrollTo(0);

        // Each image fills a row on its own, 1706px high
        const gallery = new Natural(getContainerElement(1024), {rowHeight: 2000, gap: 4});
        gallery.addItems(getImages(5).map(image => ({...image, enlargedWidth: 1080, enlargedHeight: 1800})));

        scrollTo(500);
        const internal = gallery as unknown as {
            captureResizeAnchor: () => void;
            resizeAnchor: {item: Item} | null;
            currentViewportHeight: number;
        };
        internal.captureResizeAnchor();
        expect(internal.resizeAnchor?.item).toBe(gallery.collection[0]);

        // The first row starts at the top of the viewport, and no row crosses the top of the viewport
        scrollTo(0);
        internal.captureResizeAnchor();
        expect(internal.resizeAnchor?.item).toBe(gallery.collection[0]);

        // No anchor while the viewport height is unknown
        internal.currentViewportHeight = 0;
        internal.captureResizeAnchor();
        expect(internal.resizeAnchor).toBeNull();

        scrollTo(0);
    });

    it('should organize only up to the given row', () => {
        const gallery = new Natural(getContainerElement(999), {rowHeight: 300, gap: 4});
        gallery.addItems(getImages(6)); // Two images per row
        gallery.collection.forEach(item => (item.row = -1));

        Natural.organizeItems(gallery, gallery.collection, 0, 0);
        expect(gallery.collection.map(item => item.row)).toEqual([0, 0, -1, -1, -1, -1]);
    });

    it('should restore all items when all are virtually hidden from top', () => {
        const container = getContainerElement();
        const gallery = new Natural(container, {rowHeight: 300, gap: 4});
        gallery.addItems(getImages(10));

        const domCount = gallery.collection.length;

        // Simulate all dom items having been trimmed from the top
        (gallery as unknown as {virtualHiddenFromTopCount: number}).virtualHiddenFromTopCount = domCount;

        // endResize remounts the rows from their heights alone, whatever the previous hidden state was
        (gallery as unknown as {endResize: () => void}).endResize();

        expect(container.querySelectorAll('.figure').length).toBe(domCount);
    });

    it('should show the next button when a narrower width hides items', () => {
        let width = 1024;
        const container = getContainerElement();
        Object.defineProperty(container, 'getBoundingClientRect', {value: () => ({width, top: 0})});

        // Two images per row, so the four images fill the two rows of the first page
        const gallery = new Natural(container, {rowHeight: 300, rowsPerPage: 2});
        gallery.addItems(getImages(4));
        const nextButton = container.querySelector<HTMLElement>('.natural-gallery-next')!;
        expect(nextButton.style.display).toBe('none');

        // One image per row
        width = 400;
        (gallery as unknown as {endResize: () => void}).endResize();

        expect(container.querySelectorAll('.figure').length).toBe(2);
        expect(nextButton.style.display).toBe('block');
    });

    it('should show the pages up to the given item before scrolling to it', () => {
        const scrollToSpy = vi.fn();
        Object.defineProperty(window, 'scrollTo', {value: scrollToSpy, writable: true, configurable: true});

        // Two images per row, one row per page
        const container = getContainerElement(1024);
        const gallery = new Natural(container, {rowHeight: 300, rowsPerPage: 1});
        gallery.addItems(getImages(10));
        expect(container.querySelectorAll('.figure').length).toBe(2);

        gallery.scrollToItem(gallery.collection[6]);
        expect(container.querySelectorAll('.figure').length).toBe(8);
        expect(container.querySelector<HTMLElement>('.natural-gallery-next')!.style.display).toBe('block');
        expect(scrollToSpy).toHaveBeenCalledTimes(1);
        expect(scrollToSpy.mock.calls[0][0].top).toBeGreaterThan(0);

        // An item already shown does not show any more page
        gallery.scrollToItem(gallery.collection[0]);
        expect(container.querySelectorAll('.figure').length).toBe(8);
        expect(scrollToSpy).toHaveBeenCalledTimes(2);
    });

    it('should restore the top rows when no row is mounted any more', () => {
        scrollTo(0);

        const container = getContainerElement();
        const gallery = new Natural(container, {rowHeight: 300, gap: 4});
        gallery.addItems(getImages(30));

        const internal = gallery as unknown as {
            currentScrollTop: number;
            virtualTopPadding: number;
            virtualHiddenFromTopCount: number;
            virtualHiddenFromBottomCount: number;
            mountItem: (item: Item) => HTMLElement;
            trimTopRows: (galleryTop: number) => void;
            restoreTopRows: (galleryTop: number) => void;
        };

        // The first item hidden at the bottom has an element, out of the document
        const firstHiddenFromBottom =
            gallery.collection[gallery.collection.length - internal.virtualHiddenFromBottomCount];
        internal.mountItem(firstHiddenFromBottom);

        // Every mounted row is trimmed from the top
        internal.currentScrollTop = 100000;
        internal.trimTopRows(0);
        expect(container.querySelectorAll('.figure').length).toBe(0);

        internal.currentScrollTop = internal.virtualTopPadding;
        expect(() => internal.restoreTopRows(0)).not.toThrow();
        expect(container.querySelectorAll('.figure').length).toBeGreaterThan(0);
        expect(internal.virtualHiddenFromTopCount).toBeLessThan(gallery.collection.length);
    });

    it('should return row height', () => {
        const images = [
            {
                enlargedWidth: 6000,
                enlargedHeight: 4000,
            },
            {
                enlargedWidth: 3648,
                enlargedHeight: 5472,
            },
            {
                title: '2',
                enlargedWidth: 5472,
                enlargedHeight: 3648,
            },
        ];

        const rowHeight1 = Natural.getRowHeight(images, 1000, 0, {});
        expect(rowHeight1).toBe(272.72727272727275);

        const rowHeight2 = Natural.getRowHeight(images, 1000, 10, {});
        expect(rowHeight2).toBe(267.2727272727273);

        expect(rowHeight2).toBeLessThan(rowHeight1);
    });

    it('should read the gallery width once when organizing many rows', () => {
        const container = getContainerElement(999);
        const gallery = new Natural(container, {rowHeight: 100});
        gallery.addItems(getImages(100));

        const getBoundingClientRect = vi.spyOn(container, 'getBoundingClientRect');
        gallery.organizeItems(gallery.collection, 0);

        expect(new Set(gallery.collection.map(item => item.row)).size).toBeGreaterThan(10);
        expect(getBoundingClientRect).toHaveBeenCalledTimes(1);
    });

    it('should number rows from the given current row', () => {
        const container = getContainerElement(999);
        const gallery = new Natural(container, {rowHeight: 100});
        gallery.addItems(getImages(30));

        Natural.organizeItems(gallery, gallery.collection, 0, null, 5);

        expect(gallery.collection[0].row).toBe(5);
        expect(gallery.collection[gallery.collection.length - 1].row).toBeGreaterThan(5);
    });

    it('should organize items that dont fill the line', () => {
        const images: ModelAttributes[] = [
            {
                thumbnailSrc: 'foo.jpg',
                enlargedWidth: 6000,
                enlargedHeight: 4000,
            },
            {
                thumbnailSrc: 'bar.jpg',
                enlargedWidth: 3648,
                enlargedHeight: 5472,
            },
        ];

        const container = getContainerElement(999);
        const gallery = new Natural(container, {rowHeight: 400});

        gallery.addItems(images);
        gallery.organizeItems(gallery.collection, 0);

        const result = [
            {width: 600, height: 400, row: 0},
            {width: 267, height: 400, row: 0},
        ];

        expect(gallery.collection.map(getSize)).toEqual(result);
    });

    it('should organize items that overflow first line with no gap', () => {
        const images: ModelAttributes[] = [
            {
                thumbnailSrc: 'foo.jpg',
                enlargedWidth: 6000,
                enlargedHeight: 4000,
            },
            {
                thumbnailSrc: 'bar.jpg',
                enlargedWidth: 3648,
                enlargedHeight: 5472,
            },
            {
                thumbnailSrc: 'foo 2.jpg',
                title: '2',
                enlargedWidth: 5472,
                enlargedHeight: 3648,
            },
            {
                thumbnailSrc: 'foo 3.jpg',
                title: '3',
                enlargedWidth: 3456,
                enlargedHeight: 5184,
            },
            {
                thumbnailSrc: 'foo 4.jpg',
                title: '4',
                enlargedWidth: 3264,
                enlargedHeight: 4894,
            },
        ];

        const container = getContainerElement(999);
        const gallery = new Natural(container, {rowHeight: 400, gap: 0});

        gallery.addItems(images);
        gallery.organizeItems(gallery.collection, 0);

        const result = [
            {width: 408, height: 272, row: 0},
            {width: 182, height: 272, row: 0},
            {width: 409, height: 272, row: 0},
            {width: 266, height: 400, row: 1},
            {width: 267, height: 400, row: 1},
        ];

        expect(gallery.collection.map(getSize)).toEqual(result);
    });

    it('should organize items that overflow first line with gap Angular', () => {
        const images: ModelAttributes[] = [
            {
                thumbnailSrc: 'foo.jpg',
                enlargedWidth: 6000,
                enlargedHeight: 4000,
            },
            {
                thumbnailSrc: 'bar.jpg',
                enlargedWidth: 3648,
                enlargedHeight: 5472,
            },
            {
                thumbnailSrc: 'foo 2.jpg',
                title: '2',
                enlargedWidth: 5472,
                enlargedHeight: 3648,
            },
            {
                thumbnailSrc: 'foo 3.jpg',
                title: '3',
                enlargedWidth: 3456,
                enlargedHeight: 5184,
            },
            {
                thumbnailSrc: 'foo 4.jpg',
                title: '4',
                enlargedWidth: 3264,
                enlargedHeight: 4894,
            },
        ];

        const container = getContainerElement(999);
        const gallery = new Natural(container, {rowHeight: 400, gap: 20});

        gallery.addItems(images);
        gallery.organizeItems(gallery.collection, 0);

        const result = [
            {width: 392, height: 261, row: 0},
            {width: 174, height: 261, row: 0},
            {width: 393, height: 261, row: 0},
            {width: 266, height: 400, row: 1},
            {width: 267, height: 400, row: 1},
        ];

        expect(gallery.collection.map(getSize)).toEqual(result);
    });

    it('should be compatible with Angular SSR', () => {
        const images: ModelAttributes[] = [
            {
                thumbnailSrc: 'foo.jpg',
                enlargedWidth: 6000,
                enlargedHeight: 4000,
            },
            {
                thumbnailSrc: 'bar.jpg',
                enlargedWidth: 3648,
                enlargedHeight: 5472,
            },
            {
                thumbnailSrc: 'foo 2.jpg',
                title: '2',
                enlargedWidth: 5472,
                enlargedHeight: 3648,
            },
            {
                thumbnailSrc: 'foo 3.jpg',
                title: '3',
                enlargedWidth: 3456,
                enlargedHeight: 5184,
            },
            {
                thumbnailSrc: 'foo 4.jpg',
                title: '4',
                enlargedWidth: 3264,
                enlargedHeight: 4894,
            },
        ];

        const window = domino.createWindow('<h1>Hello world</h1>', 'http://example.com');

        const container = window.document.createElement('div');
        const gallery = new Natural(container, {rowHeight: 400, gap: 20, selectable: true});
        gallery.addItems(images);
        gallery.organizeItems(gallery.collection, 0);

        const result = [
            {width: 480, height: 320, row: 0},
            {width: 141, height: 212, row: 1},
            {width: 319, height: 212, row: 1},
            {width: 229, height: 344, row: 2},
            {width: 231, height: 344, row: 2},
        ];

        expect(gallery.collection.map(getSize)).toEqual(result);
    });
});
