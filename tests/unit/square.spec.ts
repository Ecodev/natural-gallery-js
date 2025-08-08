import {ModelAttributes, Square} from '../../src';
import {describe, expect, it} from '@jest/globals';
import {getContainerElement, getSize} from './utils';
import {getBaseExpectedOptions, testGallery} from './abstract-gallery';

describe('Square Gallery', () => {
    testGallery(
        Square,
        {itemsPerRow: 4, gap: 4},
        {
            maxItemsInDom: 16,
            itemsAfterScroll: 20,
            itemsInFirstPage: 16,
            itemsInSecondPage: 24,
            options: {
                ...getBaseExpectedOptions(),
                itemsPerRow: 4,
            },
        },
    );

    it('should error with invalid column size', () => {
        const container = getContainerElement();
        expect(() => new Square(container, {itemsPerRow: -5})).toThrow('Option.itemsPerRow must be positive');
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
