import {ModelAttributes, Natural, NaturalGalleryOptions} from '../../src';
import {Item, LabelVisibility} from '../../src/js/Item';
import * as domino from 'domino';
import {describe, expect, it} from '@jest/globals';
import {getContainerElement, getImages, setViewport} from './utils';

function getSize<T extends ModelAttributes>({width, height, row}: Item<T>): Pick<Item<T>, 'width' | 'height' | 'row'> {
    return {width, height, row};
}

describe('Natural Gallery', () => {
    it('should initialize DOM', () => {
        const element = document.createElement('div');
        const gallery = new Natural(element, {rowHeight: 123, gap: 4});
        expect(element.querySelector('.natural-gallery-body')).toBe(null);
        gallery.init();

        const expectedElement = document.createElement('div');
        expectedElement.className = 'natural-gallery-body';
        expectedElement.style.rowGap = '4px';
        expect(element.querySelector('.natural-gallery-body')).toEqual(expectedElement);

        expect(gallery.collectionLength).toBe(0);
        expect(element.querySelectorAll('.figure').length).toBe(0);
        expect(gallery.domCollectionLength).toBe(0);
    });

    it('options should be completed and overridden', () => {
        const result: NaturalGalleryOptions = {
            rowHeight: 123, // new attribute
            gap: 4, // overridden attribute
            rowsPerPage: 0,
            labelVisibility: LabelVisibility.HOVER,
            lightbox: false,
            minRowsAtStart: 2,
            selectable: false,
            activable: false,
            infiniteScrollOffset: 0,
            photoSwipeOptions: {
                loop: false,
            },
            photoSwipePluginsInitFn: null,
            ssr: {
                galleryWidth: 480,
            },
        };

        const gallery = new Natural(document.createElement('div'), {rowHeight: 123, gap: 4});
        expect(gallery.getOptions()).toEqual(result);
    });

    it('should add items before init, and render then', () => {
        const images = getImages(6);
        const container = document.createElement('div');
        const gallery = new Natural(container, {rowHeight: 123});

        gallery.addItems(images);
        expect(gallery.collectionLength).toEqual(6);
        expect(container.querySelectorAll('.figure').length).toBe(0);
        expect(gallery.domCollectionLength).toEqual(0);

        gallery.init();
        expect(gallery.collectionLength).toEqual(6);
        expect(container.querySelectorAll('.figure').length).toBe(6);
        expect(gallery.domCollectionLength).toEqual(6);
    });

    it('should add items after init', () => {
        const images = getImages(6);
        const container = document.createElement('div');
        const gallery = new Natural(container, {rowHeight: 123});
        gallery.init();

        gallery.addItems(images);
        expect(gallery.collectionLength).toEqual(6);
        expect(container.querySelectorAll('.figure').length).toBe(6);
        expect(gallery.domCollectionLength).toEqual(6);
    });

    it('should empty collection', () => {
        const images = getImages(6);
        const container = document.createElement('div');
        const gallery = new Natural(container, {rowHeight: 123});
        gallery.init();

        gallery.addItems(images);
        expect(gallery.collectionLength).toEqual(6);
        expect(gallery.domCollectionLength).toEqual(6);
        expect(container.querySelectorAll('.figure').length).toBe(6);

        gallery.clear();
        expect(gallery.collectionLength).toEqual(0);
        expect(gallery.domCollectionLength).toEqual(0);
        expect(container.querySelectorAll('.figure').length).toBe(0);
    });

    it('should replace existing list', () => {
        const collection1 = getImages(6);
        const collection2 = getImages(4);
        const container = document.createElement('div');
        const gallery = new Natural(container, {rowHeight: 123});
        gallery.init();

        gallery.addItems(collection1);
        expect(gallery.collectionLength).toEqual(6);
        expect(container.querySelectorAll('.figure').length).toBe(6);
        expect(gallery.domCollectionLength).toEqual(6);

        gallery.setItems(collection2);
        expect(gallery.collectionLength).toEqual(4);
        expect(container.querySelectorAll('.figure').length).toBe(4);
        expect(gallery.domCollectionLength).toEqual(4);
    });

    it('should not notify pagination before gallery init', () => {
        const container = getContainerElement();
        const gallery = new Natural(container, {rowHeight: 300, labelVisibility: LabelVisibility.HOVER});

        const spy = jest.fn();
        gallery.addEventListener('pagination', spy); // does not emit on the moment before init()
        expect(spy).toHaveBeenCalledTimes(0);

        gallery.init();
        expect(spy).toHaveBeenCalledTimes(1);
    });

    it('should notify pagination only after gallery initialization', () => {
        const container = getContainerElement();
        const gallery = new Natural(container, {rowHeight: 300, labelVisibility: LabelVisibility.HOVER});
        gallery.init();

        const spy = jest.fn();
        gallery.addEventListener('pagination', spy); // emit on the moment if after init()

        expect(spy).toHaveBeenCalledTimes(1);
    });

    it('should load some items and buffer the others, and load more on scroll', async () => {
        const paginationSpy = jest.fn();
        const displayedSpy = jest.fn();
        const container = getContainerElement();
        container.addEventListener('pagination', paginationSpy);
        container.addEventListener('item-displayed', displayedSpy);

        const collection = getImages(50);
        const gallery = new Natural(container, {rowHeight: 300});
        gallery.init();

        gallery.addItems(collection);
        expect(gallery.collectionLength).toEqual(50);
        expect(gallery.domCollectionLength).toEqual(8);
        expect(container.querySelectorAll('.figure').length).toBe(8);

        Object.defineProperty(document.documentElement, 'scrollTop', {value: 100, writable: true, configurable: true});
        document.dispatchEvent(new Event('scroll'));

        expect(gallery.collectionLength).toEqual(50);
        expect(gallery.domCollectionLength).toEqual(10);
        expect(container.querySelectorAll('.figure').length).toBe(10);

        Object.defineProperty(document.documentElement, 'scrollTop', {value: 200, writable: true, configurable: true});
        document.dispatchEvent(new Event('scroll'));

        expect(gallery.collectionLength).toEqual(50);
        expect(gallery.domCollectionLength).toEqual(12);
        expect(container.querySelectorAll('.figure').length).toBe(12);

        await new Promise(resolve => setTimeout(resolve, 600));
        expect(paginationSpy).toHaveBeenCalledTimes(2);
        expect(displayedSpy).toHaveBeenCalledTimes(12);
    });

    it('should throw exception when selecting not selectable gallery', () => {
        const container = getContainerElement();
        const gallery = new Natural(container, {rowHeight: 300});
        gallery.init();

        gallery.addItems(getImages(1));
        expect(() => gallery.selectDomCollection()).toThrow('Gallery is not selectable');
    });

    it('should select dom collection and unselect all', () => {
        const container = getContainerElement();

        const collection = getImages(20);
        const gallery = new Natural(container, {rowHeight: 300, selectable: true});
        gallery.init();
        gallery.addItems(collection);

        const selected = gallery.selectDomCollection();
        expect(selected.length).toBe(8);
        expect(gallery.domCollectionLength).toEqual(8);
        expect(container.querySelectorAll('.figure.selected').length).toBe(8);
        expect(container.querySelectorAll('.figure').length).toBe(8);

        gallery.unselectAllItems();
        expect(gallery.domCollectionLength).toEqual(8);
        expect(container.querySelectorAll('.figure').length).toBe(8);
        expect(container.querySelectorAll('.figure.selected').length).toBe(0);
    });

    it('should switch label hover status', () => {
        const container = getContainerElement();

        const collection = getImages(20);
        const gallery = new Natural(container, {rowHeight: 300, labelVisibility: LabelVisibility.HOVER});
        gallery.init();
        gallery.addItems(collection);

        expect(container.querySelectorAll('figcaption.hover').length).toBe(8);
        expect(gallery.domCollectionLength).toEqual(8);

        gallery.setLabelHover(false);
        expect(container.querySelectorAll('figcaption.hover').length).toBe(0);
    });

    it('should init with page size', () => {
        const container = getContainerElement();

        const collection = getImages(40);
        const gallery = new Natural(container, {rowHeight: 200, rowsPerPage: 4});
        gallery.init();
        gallery.addItems(collection);

        expect(gallery.domCollectionLength).toEqual(12);
        expect(container.querySelectorAll('.figure').length).toBe(12);

        gallery.addRows(2);
        expect(gallery.domCollectionLength).toEqual(18);
        expect(container.querySelectorAll('.figure').length).toBe(18);
    });

    it('should resize', async () => {
        const container = getContainerElement();
        const collection = getImages(60);
        const gallery = new Natural(container, {rowHeight: 300});
        gallery.init();

        gallery.addItems(collection);
        expect(gallery.domCollectionLength).toEqual(8);
        expect(container.querySelectorAll('.figure').length).toBe(8);

        const iframe = container.querySelector('iframe');
        expect(iframe).toBeDefined();

        Object.defineProperty(container, 'getBoundingClientRect', {value: () => ({width: 200})});
        setViewport(200);

        await new Promise(resolve => setTimeout(resolve, 100));
        iframe?.contentWindow?.dispatchEvent(new Event('resize'));
        (gallery as any).endResize();

        expect(gallery.domCollectionLength).toEqual(8);
        expect(container.querySelectorAll('figcaption').length).toBe(8);
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
        gallery.init();
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
        gallery.init();
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
        gallery.init();
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
