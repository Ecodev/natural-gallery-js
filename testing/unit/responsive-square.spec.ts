import { ResponsiveSquare, ResponsiveSquareGalleryOptions } from '../../src';

const imageModel = {
    'thumbnailSrc': 'thumbnailSrc',
    'enlargedSrc': 'enlargedSrc',
    'enlargedWidth': 1980,
    'enlargedHeight': 1080,
    'title': 'title 1',
    'color': 'color',
};

fdescribe('Responsive Square Gallery', () => {

    test('Options should be completed and overriden', () => {

        const result: ResponsiveSquareGalleryOptions = {
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

        let gallery = new ResponsiveSquare(null, {rowHeight: 123, gap: 4});
        expect(gallery.getOptions()).toEqual(result);

    });

    test('should add items before creation and not render them', () => {

        const images = [imageModel, imageModel, imageModel, imageModel, imageModel, imageModel];
        let gallery = new ResponsiveSquare(null, {rowHeight: 123});
        gallery.addItems(images);

        expect(gallery.collection.length).toEqual(6);
        expect(gallery.visibleCollection.length).toEqual(0);

    });
});

