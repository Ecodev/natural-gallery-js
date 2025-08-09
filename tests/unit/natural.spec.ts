import {ModelAttributes, Natural} from '../../src';
import * as domino from 'domino';
import {describe, expect, it} from '@jest/globals';
import {getContainerElement, getSize} from './utils';
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
            maxItemsInDom: 20,
            itemsAfterScroll: 25,
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
