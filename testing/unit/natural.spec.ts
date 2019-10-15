import { Natural, NaturalGalleryOptions } from '../../src';

fdescribe('Natural Gallery', () => {

    test('Options should be completed and overriden', () => {

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
});

