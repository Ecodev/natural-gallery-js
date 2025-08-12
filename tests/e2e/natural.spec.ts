import {expect, test} from '@playwright/test';
import {countItems, TestSetup} from './setup-test';

test.describe('Natural', () => {
    const setup = new TestSetup();

    test.beforeEach(async ({browser}) => {
        await setup.setup(browser);

        await setup.page.evaluate(() => {
            const gallery = new window.Natural(document.getElementById('gallery'), {rowHeight: 400});

            gallery.addItems(window.images);
        });
    });

    test.afterEach(async () => {
        await setup.teardown();
    });

    test('should create gallery, init, scroll and resize', async () => {
        await expect(countItems(setup.page)).toHaveCount(9);

        // Scroll
        await setup.page.evaluate(() => window.scrollTo(0, 500));
        await expect(countItems(setup.page)).toHaveCount(12);

        // Scroll more
        await setup.page.evaluate(() => window.scrollTo(0, 1000));
        await expect(countItems(setup.page)).toHaveCount(14);

        // Change viewport with to test resize
        await setup.page.setViewportSize({width: 1200, height: 800});
        await setup.page.waitForTimeout(600); // wait debounce from gallery
        await expect(countItems(setup.page)).toHaveCount(17);
    });

    test('should not disappear on hover at different zoom levels (issue #101)', async () => {
        // Test the specific conditions mentioned in issue #101:
        // Gallery disappearing on hover at 75% zoom levels and specific window sizes
        
        // Set up conditions similar to issue #101 report
        await setup.page.setViewportSize({width: 1024, height: 768});
        
        // Test at 75% zoom level (mentioned in issue #101)
        await setup.page.evaluate(() => {
            document.body.style.zoom = '0.75';
        });
        
        // Wait for gallery to render
        await expect(countItems(setup.page)).toHaveCount(9);
        
        // Find a zoomable image to hover over
        const firstImage = setup.page.locator('.figure .image').first();
        await expect(firstImage).toBeVisible();
        
        // Check that the gallery is initially visible (not in resizing state)
        const galleryBody = setup.page.locator('.natural-gallery-js');
        const hasResizingClass = await galleryBody.evaluate(el => el.classList.contains('resizing'));
        expect(hasResizingClass).toBe(false);
        
        // Hover over the image to trigger the hover transform
        // CSS: .image.zoomable:hover { transform: rotate(1deg) scale(1.2); }
        await firstImage.hover();
        
        // Wait a moment for any potential resize detection to trigger
        await setup.page.waitForTimeout(100);
        
        // Verify the gallery is still visible (doesn't have resizing class)
        const hasResizingClassAfterHover = await galleryBody.evaluate(el => el.classList.contains('resizing'));
        expect(hasResizingClassAfterHover).toBe(false);
        
        // Verify items are still visible (gallery hasn't disappeared)
        await expect(countItems(setup.page)).toHaveCount(9);
        
        // Test at different zoom levels that might trigger the issue
        for (const zoom of ['0.5', '0.67', '0.9', '1.1', '1.25']) {
            await setup.page.evaluate((zoomLevel) => {
                document.body.style.zoom = zoomLevel;
            }, zoom);
            
            // Move mouse away and back to trigger hover again
            await setup.page.mouse.move(0, 0);
            await setup.page.waitForTimeout(50);
            await firstImage.hover();
            await setup.page.waitForTimeout(100);
            
            // Gallery should remain visible at all zoom levels
            const hasResizingAtZoom = await galleryBody.evaluate(el => el.classList.contains('resizing'));
            expect(hasResizingAtZoom).toBe(false);
            await expect(countItems(setup.page)).toHaveCount(9);
        }
        
        // Reset zoom
        await setup.page.evaluate(() => {
            document.body.style.zoom = '1';
        });
    });
});
