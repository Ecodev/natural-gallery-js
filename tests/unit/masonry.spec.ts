import {Masonry} from '../../src';
import {Column} from '../../src/js/Column';
import {describe, expect, it, vi} from 'vitest';
import {getContainerElement, getImages} from './utils';
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

    it('should initialize with ratioLimit.max but no min', () => {
        const container = getContainerElement();
        const gallery = new Masonry(container, {columnWidth: 400, ratioLimit: {max: 0.8}});
        gallery.addItems(getImages(5));
        expect(gallery.domCollection.length).toBe(5);
    });

    it('should pick the shortest column when heights differ', () => {
        const container = getContainerElement();
        const gallery = new Masonry(container, {columnWidth: 400});
        gallery.addItems(getImages(3));

        // Give the second column a smaller height so it becomes the shortest
        const columnElements = container.querySelectorAll<HTMLElement>('.column');
        Object.defineProperty(columnElements[0], 'offsetHeight', {value: 200, configurable: true});
        Object.defineProperty(columnElements[1], 'offsetHeight', {value: 10, configurable: true});
        Object.defineProperty(columnElements[2], 'offsetHeight', {value: 300, configurable: true});

        const domCountBefore = gallery.domCollection.length;
        gallery.addItems(getImages(1));
        expect(gallery.domCollection.length).toBe(domCountBefore + 1);
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

    it('should mount all items with no hidden/spacer state via mountAll', () => {
        const column = new Column(document, {width: 100, gap: 4});
        [100, 200].forEach(h => column.addItem(mockItem(h)));

        column.mountAll();

        expect(column.hiddenFromTopCount).toBe(0);
        expect(column.hiddenFromBottomCount).toBe(0);
        expect(column.topSpacerHeight).toBe(0);
        expect(column.bottomSpacerHeight).toBe(0);
        expect(column.elementRef.children.length).toBe(2);
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

    it('should mount everything via mountVisibleWindow when the whole column fits in the window', () => {
        const column = new Column(document, {width: 100, gap: 4});
        [100, 100].forEach(h => column.addItem(mockItem(h)));

        column.mountVisibleWindow(-1000, 1000, 0);

        expect(column.elementRef.children.length).toBe(2);
        expect(column.hiddenFromTopCount).toBe(0);
        expect(column.hiddenFromBottomCount).toBe(0);
    });
});
