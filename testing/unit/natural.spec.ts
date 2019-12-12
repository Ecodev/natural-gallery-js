import { Natural, NaturalGalleryOptions } from '../../src';

const getSize = ({width, height, row}) => ({width, height, row});

const imageModel = {
    'thumbnailSrc': 'thumbnailSrc',
    'enlargedSrc': 'enlargedSrc',
    'enlargedWidth': 1980,
    'enlargedHeight': 1080,
    'title': 'title 1',
    'color': 'color',
};

describe('Natural Gallery', () => {

    test('options should be completed and overriden', () => {

        const result: NaturalGalleryOptions = {
            rowHeight: 123, // new attribute
            gap: 4, // overriden attribute
            rowsPerPage: 0,
            showLabels: 'hover',
            lightbox: false,
            minRowsAtStart: 2,
            selectable: false,
            activable: false,
            infiniteScrollOffset: 0,
            photoSwipeOptions: null,
            cover: true,
        };

        let gallery = new Natural(null, {rowHeight: 123, gap: 4});
        expect(gallery.getOptions()).toEqual(result);

    });

    test('should add items before creation and not render them', () => {

        const images = [imageModel, imageModel, imageModel, imageModel, imageModel, imageModel];
        let gallery = new Natural(null, {rowHeight: 123});
        gallery.addItems(images);

        expect(gallery.collection.length).toEqual(6);
        expect(gallery.visibleCollection.length).toEqual(0);
    });

    test('should return row height', () => {

        const images = [
            {
                'enlargedWidth': 6000,
                'enlargedHeight': 4000,
            },
            {
                'enlargedWidth': 3648,
                'enlargedHeight': 5472,
            },
            {
                'title': '2',
                'enlargedWidth': 5472,
                'enlargedHeight': 3648,
            },
        ];

        const rowHeight1 = Natural.getRowHeight(images, 1000, 0, {});
        expect(rowHeight1).toBe(272.72727272727275);

        const rowHeight2 = Natural.getRowHeight(images, 1000, 10, {});
        expect(rowHeight2).toBe(252.72727272727275);

        expect(rowHeight2).toBeLessThan(rowHeight1);

    });

    test('should organize items that dont fill the line', () => {

        const images = [
            {
                'enlargedWidth': 6000,
                'enlargedHeight': 4000,
            },
            {
                'enlargedWidth': 3648,
                'enlargedHeight': 5472,
            },
        ];

        const container = {getBoundingClientRect: () => ({width:999})} as HTMLElement;
        let gallery = new Natural(container, {rowHeight: 400});
        gallery.addItems(images);
        gallery.organizeItems(gallery.collection, 0, 999);

        const result = [
            {width: 600, height: 400, row: 0},
            {width: 267, height: 400, row: 0},
        ];

        expect(gallery.collection.map(getSize)).toEqual(result);
    });

    test('should organize items that overflow first line with no gap', () => {

        const images = [
            {
                'enlargedWidth': 6000,
                'enlargedHeight': 4000,
            },
            {
                'enlargedWidth': 3648,
                'enlargedHeight': 5472,
            },
            {
                'title': '2',
                'enlargedWidth': 5472,
                'enlargedHeight': 3648,
            },
            {
                'title': '3',
                'enlargedWidth': 3456,
                'enlargedHeight': 5184,
            },
            {
                'title': '4',
                'enlargedWidth': 3264,
                'enlargedHeight': 4894,
            },
        ];

        const container = {getBoundingClientRect: () => ({width:999})} as HTMLElement;
        let gallery = new Natural(container, {rowHeight: 400, gap: 0});
        gallery.addItems(images);
        gallery.organizeItems(gallery.collection, 0, 999);

        const result = [
            {width: 408, height: 272, row: 0},
            {width: 182, height: 272, row: 0},
            {width: 409, height: 272, row: 0},
            {width: 266, height: 400, row: 1},
            {width: 267, height: 400, row: 1},
        ];

        expect(gallery.collection.map(getSize)).toEqual(result);

    });

    test('should organize items that overflow first line with gap', () => {

        const images = [
            {
                'enlargedWidth': 6000,
                'enlargedHeight': 4000,
            },
            {
                'enlargedWidth': 3648,
                'enlargedHeight': 5472,
            },
            {
                'title': '2',
                'enlargedWidth': 5472,
                'enlargedHeight': 3648,
            },
            {
                'title': '3',
                'enlargedWidth': 3456,
                'enlargedHeight': 5184,
            },
            {
                'title': '4',
                'enlargedWidth': 3264,
                'enlargedHeight': 4894,
            },
        ];

        const container = {getBoundingClientRect: () => ({width:999})} as HTMLElement;
        let gallery = new Natural(container, {rowHeight: 400, gap: 20});
        gallery.addItems(images);
        gallery.organizeItems(gallery.collection, 0, 999);

        const result = [
            {width: 384, height: 232, row: 0},
            {width: 190, height: 232, row: 0},
            {width: 385, height: 232, row: 0},
            {width: 266, height: 400, row: 1},
            {width: 267, height: 400, row: 1},
        ];

        expect(gallery.collection.map(getSize)).toEqual(result);

    });

});
