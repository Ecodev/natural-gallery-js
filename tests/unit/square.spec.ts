import {LabelVisibility, Square, SquareGalleryOptions} from '../../src';
import {describe, expect, it} from '@jest/globals';
import {getContainerElement, getImages} from './utils';

describe('Square Gallery', () => {
    it('Options should be completed and override', () => {
        const result: SquareGalleryOptions = {
            itemsPerRow: 123, // new attribute
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

        const gallery = new Square(getContainerElement(), {itemsPerRow: 123, gap: 4});
        expect(gallery.getOptions()).toEqual(result);
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
});
