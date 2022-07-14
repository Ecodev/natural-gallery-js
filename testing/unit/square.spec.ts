import {Square, SquareGalleryOptions} from '../../src';
import {ModelAttributes} from '../../src/js/galleries/AbstractGallery';

const imageModel: ModelAttributes = {
    thumbnailSrc: 'thumbnailSrc',
    enlargedSrc: 'enlargedSrc',
    enlargedWidth: 1980,
    enlargedHeight: 1080,
    title: 'title 1',
    color: 'color',
};

describe('Square Gallery', () => {

    test('Options should be completed and overriden', () => {

        const result: SquareGalleryOptions = {
            itemsPerRow: 123, // new attribute
            gap: 4, // overriden attribute
            rowsPerPage: 0,
            showLabels: 'hover',
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

        const gallery = new Square(document.createElement('div'), {itemsPerRow: 123, gap: 4});
        expect(gallery.getOptions()).toEqual(result);

    });

    test('should add items before creation and not render them', () => {

        const images = [imageModel, imageModel, imageModel, imageModel, imageModel, imageModel];
        const gallery = new Square(document.createElement('div'), {itemsPerRow: 123});
        gallery.addItems(images);

        expect(gallery.collection.length).toEqual(6);
        expect(gallery.domCollection.length).toEqual(0);

    });
});
