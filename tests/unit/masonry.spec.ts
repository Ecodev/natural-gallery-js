import {Item, Masonry} from '../../src';
import {Column} from '../../src/js/Column';
import {describe, expect, it, vi} from 'vitest';
import {getContainerElement, getImages, scrollTo} from './utils';
import {getBaseExpectedOptions, testGallery} from './abstract-gallery';

describe('Masonry Gallery', () => {
    testGallery(
        Masonry,
        {
            columnWidth: 400,
            gap: 4,
            ratioLimit: {
                min: 0.6,
                max: 0.8,
            },
        },
        {
            itemsInFirstPage: 12, // 4 rows per page × 3 columns
            itemsInSecondPage: 24,
            options: {
                ...getBaseExpectedOptions(),
                columnWidth: 400,
                infiniteScrollOffset: -563.3333333333334,
                ratioLimit: {
                    min: 0.6,
                    max: 0.8,
                },
            },
        },
    );

    it('should error with invalid column size', () => {
        const container = getContainerElement();
        expect(() => new Masonry(container, {columnWidth: -123})).toThrow('Option.columnWidth must be positive');
    });

    it('should neither touch the DOM nor emit pagination with an invalid option', () => {
        const container = getContainerElement();
        const paginationSpy = vi.fn();
        container.addEventListener('pagination', paginationSpy);

        expect(() => new Masonry(container, {columnWidth: -123})).toThrow('Option.columnWidth must be positive');
        expect(paginationSpy).not.toHaveBeenCalled();
        expect(container.className).toBe('');
        expect(container.childNodes.length).toBe(0);
    });

    it('should initialize with ratioLimit.max but no min', () => {
        const container = getContainerElement();
        const gallery = new Masonry(container, {columnWidth: 400, ratioLimit: {max: 0.8}});
        gallery.addItems(getImages(5));
        expect(gallery.collection.every(item => item.height > 0)).toBe(true);
    });

    it('should put a new item in the column with the smallest total height', () => {
        const container = getContainerElement();
        const gallery = new Masonry(container, {columnWidth: 400});
        const images = getImages(4);
        images[0].enlargedHeight = 3000;
        images[1].enlargedHeight = 500;
        images[2].enlargedHeight = 2000;

        gallery.addItems(images.slice(0, 3)); // One item per column
        gallery.addItems(images.slice(3));

        const columns = (gallery as unknown as {columns: Column<never>[]}).columns;
        expect(columns[1].items).toContain(gallery.collection[3]);
    });

    it('should do nothing when scrollToItem target belongs to no column', () => {
        const container = getContainerElement();
        const gallery = new Masonry(container, {columnWidth: 400});
        gallery.addItems(getImages(5));

        const scrollToSpy = vi.fn();
        Object.defineProperty(window, 'scrollTo', {value: scrollToSpy, writable: true, configurable: true});

        const foreignItem = {} as unknown as import('../../src/js/Item').Item<never>;
        gallery.scrollToItem(foreignItem);

        expect(scrollToSpy).not.toHaveBeenCalled();
    });

    it('should keep the first column candidate when a later column ties on position', () => {
        const container = getContainerElement();
        const gallery = new Masonry(container, {columnWidth: 400});

        type ItemMock = import('../../src/js/Item').Item<never>;
        const itemA = {height: 100, rootElement: document.createElement('div')} as unknown as ItemMock;
        const itemB = {height: 100, rootElement: document.createElement('div')} as unknown as ItemMock;
        const columnA = new Column<never>(document, {width: 400, gap: 4});
        const columnB = new Column<never>(document, {width: 400, gap: 4});
        columnA.addItem(itemA);
        columnB.addItem(itemB);

        // Two same-height columns: their candidate item at a given scroll position sits at the exact same top.
        // findAnchorItem() must keep the first one it found rather than swapping for an equally-good later one.
        const internal = gallery as unknown as {
            columns: Column<never>[];
            currentScrollTop: number;
            currentViewportHeight: number;
            captureResizeAnchor: () => void;
            resizeAnchor: {item: ItemMock; offset: number} | null;
        };
        internal.columns = [columnA, columnB];
        internal.currentViewportHeight = 800;
        internal.currentScrollTop = 50; // both items start at top=0 and end at 100, so both qualify at the same top

        internal.captureResizeAnchor();

        expect(internal.resizeAnchor?.item).toBe(itemA);
    });

    it('should anchor on the item of the first column crossing the top of the viewport when the next one is taller than the viewport', () => {
        scrollTo(0);

        // Every item is 1695px high, the first column holds items 0 and 3
        const gallery = new Masonry(getContainerElement(1024), {columnWidth: 400});
        gallery.addItems(getImages(4).map(image => ({...image, enlargedWidth: 1080, enlargedHeight: 5400})));

        scrollTo(500);
        const internal = gallery as unknown as {captureResizeAnchor: () => void; resizeAnchor: {item: Item} | null};
        internal.captureResizeAnchor();
        expect(internal.resizeAnchor?.item).toBe(gallery.collection[0]);

        scrollTo(0);
    });

    it('should not anchor without any column', () => {
        const gallery = new Masonry(getContainerElement(0), {columnWidth: 400});
        const internal = gallery as unknown as {
            captureResizeAnchor: () => void;
            resizeAnchor: {item: Item} | null;
            currentViewportHeight: number;
        };
        internal.currentViewportHeight = 768;

        internal.captureResizeAnchor();
        expect(internal.resizeAnchor).toBeNull();
    });

    it('should mount and see no item while the viewport height is unknown', () => {
        const container = getContainerElement();
        const gallery = new Masonry(container, {columnWidth: 400});
        gallery.addItems(getImages(5));

        const internal = gallery as unknown as {mountAroundViewport: () => void; currentViewportHeight: number};
        internal.currentViewportHeight = 0;
        internal.mountAroundViewport();

        expect(container.querySelectorAll('.figure').length).toBe(0);
        expect(gallery.getVisibleCollection()).toEqual([]);
    });

    it('should rebuild the columns on a resize while the collection is empty', () => {
        let width = 1024;
        const container = getContainerElement();
        Object.defineProperty(container, 'getBoundingClientRect', {value: () => ({width, top: 0})});

        const gallery = new Masonry(container, {columnWidth: 200});
        expect(container.querySelectorAll('.column').length).toBe(6);

        width = 400;
        (gallery as unknown as {endResize: () => void}).endResize();
        gallery.addItems(getImages(10));

        const columns = container.querySelectorAll<HTMLElement>('.column');
        expect(columns.length).toBe(2);
        expect(columns[0].style.width).toBe(gallery.collection[0].width + 'px');
    });

    it('should keep one column while the gallery has no width', () => {
        const container = getContainerElement(0);
        const gallery = new Masonry(container, {columnWidth: 200});

        expect(Number.isFinite(gallery.getOptions().infiniteScrollOffset)).toBe(true);
        expect(() => gallery.addItems(getImages(10))).not.toThrow();
        expect(container.querySelectorAll('.column').length).toBe(1);
    });
});

describe('Column', () => {
    it('should guard trimTopItem when no items exist', () => {
        const column = new Column(document, {width: 100, gap: 4});
        expect(() => column.trimTopItem()).not.toThrow();
    });

    it('should guard restoreTopItem when nothing is hidden', () => {
        const column = new Column(document, {width: 100, gap: 4});
        expect(() => column.restoreTopItem()).not.toThrow();
    });

    it('should guard trimBottomItem when item has no rootElement', () => {
        const column = new Column(document, {width: 100, gap: 4});
        // addItem with an uninitialized item (no rootElement)
        const mockItem = {height: 100, rootElement: null} as unknown as import('../../src/js/Item').Item<never>;
        column.addItem(mockItem);
        column.trimBottomItem(); // guard fires: !item?.rootElement → return
        expect(column.hiddenFromBottomCount).toBe(0);
    });

    it('should guard restoreBottomItem when nothing is hidden from bottom', () => {
        const column = new Column(document, {width: 100, gap: 4});
        column.restoreBottomItem(); // guard fires: hiddenFromBottomCount === 0 → return
        expect(column.hiddenFromBottomCount).toBe(0);
    });

    function mockItem(height: number): import('../../src/js/Item').Item<never> {
        return {
            height,
            rootElement: document.createElement('div'),
        } as unknown as import('../../src/js/Item').Item<never>;
    }

    it('should compute cumulative height before a given index', () => {
        const column = new Column(document, {width: 100, gap: 4});
        [100, 200, 300].forEach(h => column.addItem(mockItem(h)));

        expect(column.cumulativeHeightBefore(0)).toBe(0);
        expect(column.cumulativeHeightBefore(1)).toBe(104); // 100 + gap
        expect(column.cumulativeHeightBefore(2)).toBe(308); // 100+4 + 200+4
    });

    it('should mount only the visible window via mountVisibleWindow, with top and bottom spacers', () => {
        const column = new Column(document, {width: 100, gap: 4});
        [100, 100, 100, 100, 100].forEach(h => column.addItem(mockItem(h)));
        // Cumulative tops (gap=4): item0=0, item1=104, item2=208, item3=312, item4=416 (each height 100)

        // Window covering only item2 (208-308)
        column.mountVisibleWindow(250, 260, 0);

        expect(column.elementRef.children.length).toBe(1);
        expect(column.hiddenFromTopCount).toBe(2);
        expect(column.hiddenFromBottomCount).toBe(2);
        expect(column.topSpacerHeight).toBe(208); // 2 * (100 + 4)
        expect(column.bottomSpacerHeight).toBe(208);
    });

    it('should fold items below the window into the bottom spacer via mountVisibleWindow', () => {
        const column = new Column(document, {width: 100, gap: 4});
        [100, 100].forEach(h => column.addItem(mockItem(h)));

        // Window entirely above the column, e.g. after jumping back to the top of a page with a header
        column.mountVisibleWindow(-1000, -500, 0);

        expect(column.elementRef.children.length).toBe(0);
        expect(column.hiddenFromTopCount).toBe(0);
        expect(column.hiddenFromBottomCount).toBe(2);
        expect(column.topSpacerHeight).toBe(0);
        expect(column.bottomSpacerHeight).toBe(208);
    });

    it('should mount everything via mountVisibleWindow when the whole column fits in the window', () => {
        const column = new Column(document, {width: 100, gap: 4});
        [100, 100].forEach(h => column.addItem(mockItem(h)));

        column.mountVisibleWindow(-1000, 1000, 0);

        expect(column.elementRef.children.length).toBe(2);
        expect(column.hiddenFromTopCount).toBe(0);
        expect(column.hiddenFromBottomCount).toBe(0);
    });

    it('should restore the last item hidden from the top when no item is mounted', () => {
        const column = new Column(document, {width: 100, gap: 4});
        [100, 100].forEach(h => column.addItem(mockItem(h)));

        column.mountVisibleWindow(1000, 2000, 0); // Window below the column
        expect(column.hiddenFromTopCount).toBe(2);

        column.restoreTopItem();
        expect(column.elementRef.children.length).toBe(1);
    });
});
