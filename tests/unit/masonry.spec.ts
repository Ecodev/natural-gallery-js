import {Masonry} from '../../src';
import {Column} from '../../src/js/Column';
import {describe, expect, it} from 'vitest';
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
});
