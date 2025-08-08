import {LabelVisibility, ModelAttributes, Natural, Square, SquareGalleryOptions} from '../../src';
import {describe, expect, it} from '@jest/globals';
import {getContainerElement, getImages, getSize} from './utils';

describe('Square Gallery', () => {
    it('Options should be completed and override', () => {
        const result: SquareGalleryOptions = {
            itemsPerRow: 5, // new attribute
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

        const gallery = new Square(getContainerElement(), {itemsPerRow: 5, gap: 4});
        expect(gallery.getOptions()).toEqual(result);
    });

    it('should error with invalid column size', () => {
        const container = getContainerElement();
        expect(() => new Square(container, {itemsPerRow: -5})).toThrow('Option.itemsPerRow must be positive');
    });

    it('should render items', () => {
        const images = getImages(6);
        const container = getContainerElement();
        const gallery = new Square(container, {itemsPerRow: 3});

        gallery.addItems(images);
        expect(gallery.collection.length).toEqual(6);
        expect(gallery.domCollection.length).toEqual(6);
        expect(container.querySelectorAll('.figure')?.length).toEqual(6);
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

        const container = getContainerElement();
        const gallery = new Square(container, {itemsPerRow: 4});

        gallery.addItems(images);
        gallery.organizeItems(gallery.collection);

        const result = [
            {width: 253, height: 253, row: 0},
            {width: 253, height: 253, row: 0},
        ];

        expect(gallery.collection.map(getSize)).toEqual(result);
    });

    it('should organize items that overflow line', () => {
        const images: ModelAttributes[] = [
            {
                thumbnailSrc: 'foo.jpg',
                enlargedWidth: 6000,
                enlargedHeight: 4000,
            },
            {
                thumbnailSrc: 'bar.jpg',
                enlargedWidth: 1356,
                enlargedHeight: 1234,
            },
            {
                thumbnailSrc: 'foobar.jpg',
                enlargedWidth: 3648,
                enlargedHeight: 5472,
            },
            {
                thumbnailSrc: 'barfoo.jpg',
                enlargedWidth: 3000,
                enlargedHeight: 2000,
            },
            {
                thumbnailSrc: 'barbar.jpg',
                enlargedWidth: 3000,
                enlargedHeight: 2000,
            },
        ];

        const container = getContainerElement();
        const gallery = new Square(container, {itemsPerRow: 4});

        gallery.addItems(images);
        gallery.organizeItems(gallery.collection);

        const result = [
            {width: 253, height: 253, row: 0},
            {width: 253, height: 253, row: 0},
            {width: 253, height: 253, row: 0},
            {width: 253, height: 253, row: 0},
            {width: 253, height: 253, row: 1},
        ];

        expect(gallery.collection.map(getSize)).toEqual(result);
    });
});
