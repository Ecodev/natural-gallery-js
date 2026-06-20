import {expect, test} from '@playwright/test';
import {countItems, TestSetup, topVisibleImageSrc} from './setup-test';

test.describe('Masonry', () => {
    const setup = new TestSetup();

    test.beforeEach(async ({browser}) => {
        await setup.setup(browser);
        await setup.page.evaluate(() => {
            const gallery = new window.Masonry(document.getElementById('gallery'), {columnWidth: 450});

            gallery.addItems(window.images);
        });
    });

    test.afterEach(async () => {
        await setup.teardown();
    });

    test('should create gallery, init, scroll and resize', async () => {
        await expect(countItems(setup.page)).toHaveCount(9);

        // Scroll
        await setup.page.evaluate(() => window.scrollTo(0, 1600));
        await expect(countItems(setup.page)).toHaveCount(13);

        // Scroll more
        await setup.page.evaluate(() => window.scrollTo(0, 3200));
        await expect(countItems(setup.page)).toHaveCount(17);

        // Change viewport with to test resize
        await setup.page.setViewportSize({width: 1160, height: 800});
        await setup.page.waitForTimeout(600); // wait debounce from gallery
        await expect(countItems(setup.page)).toHaveCount(16);
    });

    test('should keep the same content anchored near the top across a resize', async () => {
        await expect(countItems(setup.page)).toHaveCount(9);

        await setup.page.evaluate(() => window.scrollTo(0, 1600));
        await expect(countItems(setup.page)).toHaveCount(13);

        await setup.page.evaluate(() => window.scrollTo(0, 3200));
        await expect(countItems(setup.page)).toHaveCount(17);
        const beforeResize = await topVisibleImageSrc(setup.page);
        expect(beforeResize).not.toBeNull();

        // Simulate a phone rotation: width and height swap
        await setup.page.setViewportSize({width: 1160, height: 800});
        await setup.page.waitForTimeout(600);

        // The page must not have been reset to the top
        const scrollYAfterResize = await setup.page.evaluate(() => window.scrollY);
        expect(scrollYAfterResize).toBeGreaterThan(0);

        // The same content (not images from the start of the collection) should still be visible near the top
        const afterResize = await topVisibleImageSrc(setup.page);
        expect(afterResize).toBe(beforeResize);
    });
});
