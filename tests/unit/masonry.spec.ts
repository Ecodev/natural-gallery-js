import {LabelVisibility, Masonry, MasonryGalleryOptions} from '../../src';
import {describe, expect, it} from '@jest/globals';
import {getContainerElement, getImages, setViewport} from './utils';

describe('Masonry Gallery', () => {
    it('Options should be completed and overriden', () => {
        const result: MasonryGalleryOptions = {
            columnWidth: 400, // new attribute
            gap: 4, // overriden attribute
            rowsPerPage: 0,
            labelVisibility: LabelVisibility.HOVER,
            lightbox: false,
            minRowsAtStart: 2,
            selectable: false,
            activable: false,
            infiniteScrollOffset: -676,
            photoSwipeOptions: {
                loop: false,
            },
            photoSwipePluginsInitFn: null,
            ssr: {
                galleryWidth: 480,
            },
        };
        const gallery = new Masonry(getContainerElement(), {columnWidth: 400, gap: 4});
        expect(gallery.getOptions()).toEqual(result);
    });

    it('should add items, render and empty', () => {
        const container = getContainerElement();
        const gallery = new Masonry(container, {columnWidth: 123});
        gallery.addItems(getImages(6));
        expect(gallery.collectionLength).toEqual(6);
        expect(gallery.domCollectionLength).toEqual(6);
        expect(container.querySelectorAll('.figure').length).toBe(6);

        gallery.clear();
        expect(gallery.collectionLength).toEqual(0);
        expect(gallery.domCollectionLength).toEqual(0);
        expect(container.querySelectorAll('.figure').length).toBe(0);
    });

    it('should resize', async () => {
        const container = getContainerElement();

        const collection = getImages(60);
        const gallery = new Masonry(container, {columnWidth: 600});

        gallery.addItems(collection);
        expect(gallery.domCollectionLength).toEqual(60);
        expect(container.querySelectorAll('.figure').length).toBe(60);

        const iframe = container.querySelector('iframe');
        expect(iframe).toBeDefined();

        Object.defineProperty(container, 'getBoundingClientRect', {
            value: () => ({width: 200}),
        });
        setViewport(200);

        await new Promise(resolve => setTimeout(resolve, 100));
        iframe?.contentWindow?.dispatchEvent(new Event('resize'));
        (gallery as unknown as {endResize: () => void}).endResize();

        expect(gallery.domCollectionLength).toEqual(60);
        expect(container.querySelectorAll('figcaption').length).toBe(60);
    });
});
