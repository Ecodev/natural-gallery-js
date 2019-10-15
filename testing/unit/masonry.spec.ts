import { Masonry, MasonryGalleryOptions } from '../../src';

fdescribe('Masonry Gallery', () => {

    test('Options should be completed and overriden', () => {

        const result: MasonryGalleryOptions = {
            columnWidth: 123, // new attribute
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

        let gallery = new Masonry(null, {columnWidth: 123, gap: 4});
        expect(gallery.getOptions()).toEqual(result);

    });
});

