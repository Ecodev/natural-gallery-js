import {LabelVisibility, Masonry, MasonryGalleryOptions, Natural} from '../../src';
import {describe, expect, it} from '@jest/globals';
import {getContainerElement, getImages, setViewport} from './utils';

describe('Masonry Gallery', () => {
    it('Options should be completed and overriden', () => {
        const result: MasonryGalleryOptions = {
            columnWidth: 123, // new attribute
            gap: 4, // overriden attribute
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
        const gallery = new Masonry(document.createElement('div'), {columnWidth: 123, gap: 4});
        expect(gallery.getOptions()).toEqual(result);
    });

    it('should add items before creation and not render them', () => {
        const images = getImages(6);
        const gallery = new Masonry(getContainerElement(), {columnWidth: 123});

        gallery.addItems(images);
        expect(gallery.collection.length).toEqual(6);
        expect(gallery.domCollection.length).toEqual(0);
    });

    it('should add items before init, and render then', () => {
        const images = getImages(6);
        const container = getContainerElement(999);
        const gallery = new Masonry(container, {columnWidth: 123});

        gallery.addItems(images);
        expect(gallery.collectionLength).toEqual(6);
        expect(container.querySelectorAll('.figure').length).toBe(0);
        expect(gallery.domCollectionLength).toEqual(0);

        gallery.init();
        expect(gallery.collectionLength).toEqual(6);
        expect(container.querySelectorAll('.figure').length).toBe(6);
        expect(gallery.domCollectionLength).toEqual(6);
    });

    it('should render items when adding them after init', () => {
        const images = getImages(6);
        const container = getContainerElement(999);
        const gallery = new Masonry(container, {columnWidth: 123});

        gallery.init();
        expect(gallery.collectionLength).toEqual(0);
        expect(container.querySelectorAll('.figure').length).toBe(0);
        expect(gallery.domCollectionLength).toEqual(0);

        gallery.addItems(images);
        expect(gallery.collectionLength).toEqual(6);
        expect(container.querySelectorAll('.figure').length).toBe(6);
        expect(gallery.domCollectionLength).toEqual(6);
    });

    it('should empty collection', () => {
        const images = getImages(6);
        const container = getContainerElement(999);
        const gallery = new Masonry(container, {columnWidth: 123});
        gallery.init();
        gallery.addItems(images);

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
        gallery.init();

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
        (gallery as any).endResize();

        expect(gallery.domCollectionLength).toEqual(60);
        expect(container.querySelectorAll('figcaption').length).toBe(60);
    });
});
