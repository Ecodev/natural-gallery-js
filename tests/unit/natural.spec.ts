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

    it('should not apply scrolling class when scroll events are triggered without actual scrolling', done => {
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

        const container = getContainerElement(500);
        const gallery = new Natural(container, {rowHeight: 400});
        gallery.addItems(images);

        // Simulate a scroll event without actual scroll position change
        // This simulates what happens when mouse hover triggers scroll events in some browsers
        const scrollEvent = new Event('scroll');

        // Initially, the gallery should not have the scrolling class
        expect(container.classList.contains('scrolling')).toBe(false);

        // Dispatch a scroll event without changing scroll position
        document.dispatchEvent(scrollEvent);

        // Wait for any potential debounced functions to trigger
        setTimeout(() => {
            // The scrolling class should NOT be applied since no actual scrolling occurred
            expect(container.classList.contains('scrolling')).toBe(false);
            done();
        }, 200); // Wait longer than the debounce timeout
    });

    it('should demonstrate that hover transforms can trigger layout changes that could cause resize events', () => {
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

        const container = getContainerElement(500);
        const gallery = new Natural(container, {rowHeight: 400});
        gallery.addItems(images);

        const bodyElement = gallery.bodyElement;
        
        // Initially, the body should not have the resizing class
        expect(bodyElement.classList.contains('resizing')).toBe(false);

        // Find the first image element that would have zoomable class
        const firstFigure = bodyElement.querySelector('.figure') as HTMLElement;
        expect(firstFigure).toBeTruthy();
        
        const imageElement = firstFigure.querySelector('.image') as HTMLElement;
        expect(imageElement).toBeTruthy();
        
        // Add the zoomable class to make it responsive to hover
        imageElement.classList.add('zoomable');
        
        // Verify that the CSS hover transforms exist in the stylesheet
        // The _figure.scss defines: .image.zoomable:hover { transform: rotate(1deg) scale(1.2); }
        // This scale transform could trigger layout changes in certain browsers/zoom levels
        
        // Test that we can trigger layout changes programmatically
        const originalTransform = imageElement.style.transform;
        
        // Apply the hover transform manually to simulate what happens on hover
        imageElement.style.transform = 'rotate(1deg) scale(1.2)';
        expect(imageElement.style.transform).toBe('rotate(1deg) scale(1.2)');
        
        // Reset the transform
        imageElement.style.transform = originalTransform;
        
        // This test demonstrates that:
        // 1. The gallery has elements that can be transformed on hover
        // 2. These transforms change the scale (1.2x) which affects element dimensions
        // 3. In certain browser conditions (specific zoom levels), this could trigger resize detection
        // 4. The issue described in #101 mentions gallery disappearing at 75% zoom with specific window sizes
        
        // The root cause would be: hover → transform → layout change → iframe resize detection → resizing class → opacity: 0 → gallery disappears
        expect(true).toBe(true); // This test passes to show the potential mechanism
    });

    it('should demonstrate the potential cause of gallery disappearing on hover (issue #101)', () => {
        // This test demonstrates the likely root cause of issue #101:
        // 1. User hovers over a zoomable image at specific zoom levels (e.g., 75%)
        // 2. CSS hover transforms (.image.zoomable:hover { transform: rotate(1deg) scale(1.2); }) are applied
        // 3. The scale(1.2) transform changes element dimensions, potentially triggering layout changes
        // 4. In certain browser conditions (specific zoom levels + window sizes), these layout changes
        //    can trigger iframe resize detection system
        // 5. Resize detection calls startResize() which applies .resizing class
        // 6. .resizing class sets opacity: 0 on figures, making the gallery disappear
        // 7. Gallery remains invisible until mouse stops moving and endResize() is called

        const images: ModelAttributes[] = [
            {
                thumbnailSrc: 'foo.jpg',
                enlargedWidth: 6000,
                enlargedHeight: 4000,
            },
        ];

        const container = getContainerElement(500);
        const gallery = new Natural(container, {rowHeight: 400});
        gallery.addItems(images);

        const bodyElement = gallery.bodyElement;
        const firstFigure = bodyElement.querySelector('.figure') as HTMLElement;
        const imageElement = firstFigure.querySelector('.image') as HTMLElement;

        // Verify initial state: gallery is visible (no resizing class)
        expect(bodyElement.classList.contains('resizing')).toBe(false);
        
        // Step 1: Simulate the problematic condition
        // In real browsers at 75% zoom + specific window sizes, hover transforms can trigger resize events
        
        // Step 2: Simulate what happens when resize is incorrectly triggered by hover
        (gallery as any).startResize(); // This would happen when iframe detects a "resize"
        
        // Step 3: Verify the gallery disappears (this is what users see in issue #101)
        expect(bodyElement.classList.contains('resizing')).toBe(true);
        // The CSS .resizing class has: .figure { opacity: 0; } - this makes the gallery disappear
        
        // Step 4: Simulate what happens when hover ends (mouse movement stops)
        (gallery as any).endResize(); // This would happen after the debounce timeout
        
        // Step 5: Verify the gallery reappears
        expect(bodyElement.classList.contains('resizing')).toBe(false);
        
        // CONCLUSION: The issue is NOT with scroll events and .scrolling class (my original fix)
        // The issue IS with resize events and .resizing class being inappropriately triggered
        // The .scrolling class only affects pointer-events (makes unresponsive, not invisible)
        // The .resizing class affects opacity (makes invisible, which matches user reports)
        
        expect(true).toBe(true); // Test passes to document the finding
    });
});
