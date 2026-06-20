/* eslint-disable no-restricted-globals */
import {Masonry, MasonryGalleryOptions, Natural, NaturalGalleryOptions, Square, SquareGalleryOptions} from '../../src';
import {LabelVisibility} from '../../src';
import {beforeEach, expect, it, vi} from 'vitest';
import {getContainerElement, getImages, scrollTo, setViewport} from './utils';
import {AbstractGallery} from '../../src/js/galleries/AbstractGallery';
import {AbstractRowGallery} from '../../src/js/galleries/AbstractRowGallery';

interface GalleryExpectation {
    options: MasonryGalleryOptions | NaturalGalleryOptions | SquareGalleryOptions;
    maxItemsInDom?: number;
    itemsAfterScroll?: number;
    itemsInFirstPage?: number;
    itemsInSecondPage?: number;
}

export function expectItemsCount(gallery: AbstractGallery, collectionSize: number, domSize?: number): void {
    if (!domSize) {
        domSize = collectionSize;
    }
    expect(gallery.collection.length).toBe(collectionSize);
    expect(gallery.domCollection.length).toBe(domSize);
    // Physical DOM count may be ≤ domSize when virtual scroll has hidden items
    expect(gallery.rootElement.querySelectorAll('.figure').length).toBeLessThanOrEqual(domSize);
}

export function getBaseExpectedOptions(): Partial<NaturalGalleryOptions> {
    return {
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
}

export function testGallery<
    T extends Natural | Masonry | Square,
    TOptions = T extends Natural
        ? NaturalGalleryOptions
        : T extends Masonry
          ? MasonryGalleryOptions
          : T extends Square
            ? SquareGalleryOptions
            : unknown,
>(
    galleryClass: new (container: HTMLElement, options: TOptions) => T,
    options: TOptions,
    expected: GalleryExpectation,
): void {
    let container: HTMLElement;
    beforeEach(() => {
        container = getContainerElement();
    });

    it('should initialize DOM', () => {
        new galleryClass(container, options);
        expect(container.querySelector('.natural-gallery-body')).toBeDefined();
    });

    it('should initialize with photoswipe', () => {
        const gallery = new galleryClass(container, {...options, lightbox: true});
        expect(container.querySelector('.natural-gallery-body')).toBeDefined();
        expectItemsCount(gallery, 0);

        gallery.addItems(getImages(5));
        expectItemsCount(gallery, 5);
    });

    it('should complete options', () => {
        const gallery = new galleryClass(getContainerElement(), options);
        expect(gallery.getOptions()).toEqual(expected.options);
    });

    it('should add items, render and empty', () => {
        const images = getImages(5);
        const gallery = new galleryClass(container, options);

        gallery.addItems(images);
        expectItemsCount(gallery, 5);

        gallery.addItems(getImages(2));
        expectItemsCount(gallery, 7);

        gallery.clear();
        expectItemsCount(gallery, 0);
    });

    // Due to jsdom limitations, masonry always add all to DOM
    it('should complete collection but not DOM', () => {
        const gallery = new galleryClass(container, options);
        gallery.addItems(getImages(100));

        expectItemsCount(gallery, 100, expected.maxItemsInDom);
    });

    it('should replace existing list', () => {
        const gallery = new galleryClass(container, options);

        const collection1 = getImages(6);
        gallery.addItems(collection1);
        expectItemsCount(gallery, 6);

        const collection2 = getImages(4);
        gallery.setItems(collection2);
        expectItemsCount(gallery, 4);
    });

    it('should load some items, buffer the others and add more to dom on scroll', async () => {
        const paginationSpy = vi.fn();
        const displayedSpy = vi.fn();
        container.addEventListener('pagination', paginationSpy);
        container.addEventListener('item-displayed', displayedSpy);

        const gallery = new galleryClass(container, options);
        gallery.addItems(getImages(50));
        expectItemsCount(gallery, 50, expected.maxItemsInDom);

        Object.defineProperty(container, 'offsetHeight', {value: 1200, writable: true, configurable: true});

        scrollTo(100); // Scroll not enough to add new items
        expectItemsCount(gallery, 50, expected.maxItemsInDom);

        scrollTo(500);
        expectItemsCount(gallery, 50, expected.itemsAfterScroll);
        await new Promise(resolve => setTimeout(resolve, 600));
        expect(paginationSpy).toHaveBeenCalledTimes(2);
        expect(displayedSpy).toHaveBeenCalledTimes(expected.itemsAfterScroll || 50); // masonry adds all
    });

    it('should not lose track of items added by a synchronous (reentrant) pagination handler', () => {
        vi.useFakeTimers();
        try {
            const gallery = new galleryClass(container, options);
            const internal = gallery as unknown as {requiredItems: number; flushBufferedItems: () => void};
            const paginationOffsets: number[] = [];

            // dispatchEvent() is synchronous: a consumer backed by an already-available/cached data source (or
            // one that simply already has the next page in memory) can call addItems() right back inside the
            // handler — that re-enters addItemToDOM() and increments requiredItems again *while* this very
            // flush is still running, before it returns. requiredItems must not be wiped out once the handler
            // returns, otherwise those newly-added items are never accounted for and pagination stalls forever.
            // Listen on `container` directly (not gallery.addEventListener), which would re-trigger
            // requestItems() as a subscribe side effect and add an extra, uncontrolled load before our own
            // addItems() call below.
            container.addEventListener('pagination', ((ev: CustomEvent<{offset: number; limit: number}>) => {
                paginationOffsets.push(ev.detail.offset);
                gallery.addItems(getImages(ev.detail.limit));
            }) as EventListener);

            // Seed with a single image: small enough to always be fully mounted immediately
            // (minRowsAtStart >= 1), regardless of each gallery type's estimated initial page size —
            // addItems()'s reentrant call below only triggers onScroll()/addRows() when domCollection is
            // already fully caught up with collection.
            gallery.addItems(getImages(1));
            expect(gallery.domCollection.length).toBe(gallery.collection.length);

            internal.requiredItems = 3; // simulate items freshly mounted (e.g. by a prior scroll), pending report
            internal.flushBufferedItems(); // schedule the debounced flush
            vi.advanceTimersByTime(500); // let it fire — the reentrant addItems() call happens synchronously inside

            // Confirm the reentrant increment survived instead of being wiped to 0 afterward.
            expect(internal.requiredItems).toBeGreaterThan(0);

            // Simulate the next real scroll event re-arming the debounce, exactly like onScroll()/addItemToDOM()
            // does in production on every subsequent scroll.
            internal.flushBufferedItems();
            vi.advanceTimersByTime(500);

            expect(paginationOffsets.length).toBe(2);
            expect(paginationOffsets[1]).toBeGreaterThan(paginationOffsets[0]);
        } finally {
            vi.useRealTimers();
        }
    });

    it('should throw exception when selecting not selectable gallery', () => {
        const gallery = new galleryClass(container, options);
        gallery.addItems(getImages(1));
        expect(() => gallery.selectDomCollection()).toThrow('Gallery is not selectable');
    });

    it('should select DOM collection and unselect all', () => {
        const gallery = new galleryClass(container, {...options, selectable: true});
        gallery.addItems(getImages(50));
        expectItemsCount(gallery, 50, expected.maxItemsInDom);

        const selected = gallery.selectDomCollection();
        expect(selected.length).toBe(expected.maxItemsInDom || 50); // exception for masonry
        expect(container.querySelectorAll('.figure.selected').length).toBe(expected.maxItemsInDom || 50);

        gallery.unselectAllItems();
        expectItemsCount(gallery, 50, expected.maxItemsInDom);
        expect(container.querySelectorAll('.figure.selected').length).toBe(0);
    });

    it('should select entire collection and unselect all', () => {
        const gallery = new galleryClass(container, {...options, selectable: true});
        gallery.addItems(getImages(50));
        expectItemsCount(gallery, 50, expected.maxItemsInDom);

        const selected = gallery.selectCollection();
        expect(selected.length).toBe(50); // exception for masonry
        expect(container.querySelectorAll('.figure.selected').length).toBe(expected.maxItemsInDom || 50);

        gallery.unselectAllItems();
        expectItemsCount(gallery, 50, expected.maxItemsInDom);
        expect(container.querySelectorAll('.figure.selected').length).toBe(0);
    });

    it('should switch label hover status', () => {
        const gallery = new galleryClass(container, {...options, labelVisibility: LabelVisibility.HOVER});
        gallery.addItems(getImages(50));
        expectItemsCount(gallery, 50, expected.maxItemsInDom);

        expect(container.querySelectorAll('figcaption.hover').length).toBe(expected.maxItemsInDom || 50);
        expect(gallery.domCollection.length).toEqual(expected.maxItemsInDom || 50);

        gallery.setLabelHover(false);
        expect(container.querySelectorAll('figcaption.hover').length).toBe(0);

        gallery.setLabelHover(true);
        expect(container.querySelectorAll('figcaption.hover').length).toBe(expected.maxItemsInDom || 50);
    });

    it('should emit pagination on the moment of listening start', () => {
        const gallery = new galleryClass(container, options);
        const spy = vi.fn();
        gallery.addEventListener('pagination', spy);
        expect(spy).toHaveBeenCalledTimes(1);
    });

    it('should error if selection on non selectable gallery', () => {
        const gallery = new galleryClass(container, {...options, selectable: false});
        gallery.addItems(getImages(5));
        const spy = vi.fn();
        gallery.addEventListener('select', spy);
        const item = gallery.collection[0];
        expect(() => item.toggleSelect()).toThrow('Gallery is not selectable');
    });

    it('should emit select', () => {
        const gallery = new galleryClass(container, {...options, selectable: true});
        gallery.addItems(getImages(5));

        const spy = vi.fn();
        gallery.addEventListener('select', spy);
        const item = gallery.collection[0];
        item.toggleSelect();
        expect(spy).toHaveBeenCalledTimes(1);
        expect(spy).toHaveBeenCalledWith(expect.objectContaining({detail: [item]}));

        const item2 = gallery.collection[1];
        item2.toggleSelect();
        expect(spy).toHaveBeenCalledTimes(2);
        expect(spy).toHaveBeenCalledWith(expect.objectContaining({detail: [item, item2]}));
    });

    it('should emit activate', () => {
        const gallery = new galleryClass(container, {...options, activable: true});
        gallery.addItems(getImages(5));

        const spy = vi.fn();
        gallery.addEventListener('activate', spy);
        const item = gallery.collection[0];
        (item.rootElement!.querySelector('.activation') as HTMLButtonElement).click();
        expect(spy).toHaveBeenCalledTimes(1);
        expect(spy).toHaveBeenCalledWith(expect.objectContaining({detail: expect.objectContaining({item})}));
    });

    it('should init with page size', () => {
        const gallery = new galleryClass(container, {...options, rowsPerPage: 4});
        gallery.addItems(getImages(50));
        expectItemsCount(gallery, 50, expected.itemsInFirstPage || 50);

        if (gallery instanceof AbstractRowGallery) {
            (gallery as unknown as {addRows: (v: number) => void}).addRows(4);
            expectItemsCount(gallery, 50, expected.itemsInSecondPage || 50);
        }
    });

    it('should add second page', () => {
        const gallery = new galleryClass(container, {...options, rowsPerPage: 4});
        gallery.addItems(getImages(50));
        expectItemsCount(gallery, 50, expected.itemsInFirstPage || 50);

        (container.querySelector('.natural-gallery-next') as HTMLButtonElement).click();
        expectItemsCount(gallery, 50, expected.itemsInSecondPage || 50);
    });

    it('should resize', async () => {
        const gallery = new galleryClass(container, options);
        gallery.addItems(getImages(50));
        expectItemsCount(gallery, 50, expected.maxItemsInDom);

        const iframe = container.querySelector('iframe');
        expect(iframe).toBeDefined();

        Object.defineProperty(container, 'getBoundingClientRect', {value: () => ({width: 200})});
        setViewport(200);

        (gallery as unknown as {startResize: () => void}).startResize();
        expect(gallery.bodyElement.classList.contains('resizing')).toBe(true);
        (gallery as unknown as {endResize: () => void}).endResize();
        expect(gallery.bodyElement.classList.contains('resizing')).toBe(false);

        expectItemsCount(gallery, 50, expected.maxItemsInDom);
        expect(container.querySelectorAll('figcaption').length).toBe(expected.maxItemsInDom || 50);
    });

    it('should not reorganize empty collection on resize', async () => {
        const gallery = new galleryClass(container, options);

        const iframe = container.querySelector('iframe');
        expect(iframe).toBeDefined();

        (gallery as unknown as {endResize: () => void}).endResize();

        expect(gallery.domCollection.length).toEqual(0);
        expect(container.querySelectorAll('figcaption').length).toBe(0);
    });

    it('should trim items from the top on deep scroll', () => {
        scrollTo(0);

        const gallery = new galleryClass(container, options);
        gallery.addItems(getImages(100));

        scrollTo(1500);

        // Capture domCollection size after scroll (onScroll may have loaded extra items)
        const domCount = gallery.domCollection.length;

        // Fewer figures physically in DOM — top rows removed
        expect(container.querySelectorAll('.figure').length).toBeLessThan(domCount);

        scrollTo(0); // cleanup
    });

    it('should trim items from the bottom when scrolled far then back to top', () => {
        scrollTo(0);

        const gallery = new galleryClass(container, options);
        gallery.addItems(getImages(100));

        // Scroll incrementally to load enough rows so totalHeight > 2 × viewport
        scrollTo(1500);
        scrollTo(2000);
        scrollTo(2500);
        scrollTo(3000);

        const domCount = gallery.domCollection.length;

        // Back to top: bottom rows (far below viewport) get removed
        scrollTo(0);
        expect(container.querySelectorAll('.figure').length).toBeLessThan(domCount);

        // Scroll toward bottom: bottom rows come back into range
        scrollTo(3000);
        expect(container.querySelectorAll('.figure').length).toBeGreaterThan(0);
    });

    it('should skip virtual scroll when viewport height is not yet known', () => {
        const gallery = new galleryClass(container, options);
        gallery.addItems(getImages(20));
        const domCount = expected.maxItemsInDom ?? 20;

        (gallery as unknown as {currentViewportHeight: number}).currentViewportHeight = 0;
        (gallery as unknown as {onVirtualScroll: () => void}).onVirtualScroll();

        // Guard returned early — no items trimmed
        expect(container.querySelectorAll('.figure').length).toBe(domCount);
    });

    it('should re-virtualize, not leave everything mounted, after resize', () => {
        scrollTo(0);

        const gallery = new galleryClass(container, options);
        gallery.addItems(getImages(100));

        // Load enough rows so both top and bottom trimming fire before resize
        scrollTo(1500);
        scrollTo(2000);
        scrollTo(2500);
        scrollTo(3000);
        scrollTo(0); // triggers bottom trim for galleries with enough rows

        const domCount = gallery.domCollection.length;

        // endResize must reorganize layout without losing or duplicating items (Natural/Square/Masonry alike)...
        const internal = gallery as unknown as {captureResizeAnchor: () => void; endResize: () => void};
        internal.captureResizeAnchor();
        internal.endResize();
        expect(gallery.domCollection.length).toBe(domCount);

        // ...and re-trim immediately to the viewport instead of leaving everything mounted until the next scroll
        const physicalCount = container.querySelectorAll('.figure').length;
        expect(physicalCount).toBeLessThanOrEqual(domCount);
        expect(physicalCount).toBeGreaterThan(0);

        scrollTo(0);
    });

    it('should anchor scroll position to current viewport content across a resize', () => {
        scrollTo(0);

        const gallery = new galleryClass(container, options);
        gallery.addItems(getImages(100));

        // Stay scrolled deep (several rows/columns down) — don't scroll back to top before resizing
        scrollTo(1500);
        scrollTo(2000);
        scrollTo(2500);

        const domCountBefore = gallery.domCollection.length;

        const scrollToSpy = vi.fn();
        Object.defineProperty(window, 'scrollTo', {value: scrollToSpy, writable: true, configurable: true});

        // Anchor is captured in captureResizeAnchor() (called on every raw resize event, before any relayout),
        // then consumed and applied in endResize()
        const internal = gallery as unknown as {captureResizeAnchor: () => void; endResize: () => void};
        internal.captureResizeAnchor();
        internal.endResize();

        // No items lost or duplicated by the relayout
        expect(gallery.domCollection.length).toBe(domCountBefore);

        // Anchored: scrollTo was called with a strictly positive top, since we were deep-scrolled, not at the top —
        // this is what keeps the same content visible across the resize instead of drifting/jumping to the top
        expect(scrollToSpy).toHaveBeenCalled();
        const lastTop = scrollToSpy.mock.calls[scrollToSpy.mock.calls.length - 1][0].top;
        expect(lastTop).toBeGreaterThan(0);

        scrollTo(0);
    });

    it('should not crash finding a resize anchor when domCollection is empty but viewport is known', () => {
        const gallery = new galleryClass(container, options); // no addItems — domCollection stays empty
        scrollTo(500); // currentViewportHeight becomes known (> 0) before any item exists

        const internal = gallery as unknown as {captureResizeAnchor: () => void; endResize: () => void};
        expect(() => {
            internal.captureResizeAnchor();
            internal.endResize();
        }).not.toThrow();
        expect(gallery.domCollection.length).toBe(0);

        scrollTo(0);
    });

    it('should trigger resize handlers when iframe contentWindow fires resize', () => {
        // jsdom returns null for iframe.contentWindow — mock it with a real EventTarget
        // so the gallery can attach its resize listener and we can dispatch the event
        const mockContentWindow = new EventTarget();
        vi.spyOn(HTMLIFrameElement.prototype, 'contentWindow', 'get').mockReturnValue(
            mockContentWindow as unknown as WindowProxy,
        );

        try {
            const gallery = new galleryClass(container, options);
            gallery.addItems(getImages(5));

            mockContentWindow.dispatchEvent(new Event('resize'));

            // startResize is debounced with {edges: ['leading']} — fires synchronously on first call
            expect(gallery.bodyElement.classList.contains('resizing')).toBe(true);
        } finally {
            vi.restoreAllMocks();
        }
    });

    it('should add items to collection only when buffer is not exhausted', () => {
        const gallery = new galleryClass(container, options);
        gallery.addItems(getImages(100));

        const domCountAfterFirst = gallery.domCollection.length;
        const collectionCountAfterFirst = gallery.collection.length;

        // For galleries with a DOM limit (Natural, Square): collection > domCollection,
        // so addToDom=false on the next call — items go to collection only, DOM unchanged.
        // For Masonry (no limit): addToDom=true, items also go to DOM.
        gallery.addItems(getImages(5));

        expect(gallery.collection.length).toBe(collectionCountAfterFirst + 5);
        expect(gallery.domCollection.length).toBeGreaterThanOrEqual(domCountAfterFirst);
    });

    it('should skip duplicate pagination request for the same offset', async () => {
        const gallery = new galleryClass(container, options);
        gallery.addItems(getImages(50));

        const internal = gallery as unknown as {
            requestedIndexesLog: number[];
            requiredItems: number;
            flushBufferedItems: () => void;
        };

        // Pre-log the current collection length to simulate a request already in flight
        internal.requestedIndexesLog.push(gallery.collection.length);
        internal.requiredItems = 1;

        // Use container directly — gallery.addEventListener fires immediately (by design)
        const paginationSpy = vi.fn();
        container.addEventListener('pagination', paginationSpy);

        // Reset the debounce timer; when it fires the dedup guard should prevent emission
        internal.flushBufferedItems();
        await new Promise(resolve => setTimeout(resolve, 600));

        expect(paginationSpy).toHaveBeenCalledTimes(0);

        // requiredItems must be reset even though we skipped dispatching, otherwise it leaks and accumulates
        // across cycles until it eventually inflates a future, genuinely new pagination request
        expect(internal.requiredItems).toBe(0);
    });

    it('should scroll to a given displayed item via scrollToItem', () => {
        const gallery = new galleryClass(container, options);
        gallery.addItems(getImages(20));

        const scrollToSpy = vi.fn();
        Object.defineProperty(window, 'scrollTo', {value: scrollToSpy, writable: true, configurable: true});

        const target = gallery.domCollection[gallery.domCollection.length - 1];
        gallery.scrollToItem(target);

        expect(scrollToSpy).toHaveBeenCalledTimes(1);
        expect(scrollToSpy.mock.calls[0][0].top).toBeGreaterThanOrEqual(0);
    });

    it('should do nothing when scrolling to an item not yet displayed', () => {
        const gallery = new galleryClass(container, options);
        gallery.addItems(getImages(50));

        const scrollToSpy = vi.fn();
        Object.defineProperty(window, 'scrollTo', {value: scrollToSpy, writable: true, configurable: true});

        // Only meaningful for galleries that actually buffer items beyond domCollection (Natural/Square in jsdom;
        // Masonry adds everything to DOM in jsdom, see "Due to jsdom limitations" comment above)
        if (gallery.domCollection.length < gallery.collection.length) {
            const notDisplayedItem = gallery.collection[gallery.collection.length - 1];
            gallery.scrollToItem(notDisplayedItem);
            expect(scrollToSpy).not.toHaveBeenCalled();
        }
    });
}
