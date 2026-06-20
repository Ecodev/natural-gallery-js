import {expect, test} from '@playwright/test';
import {countItems, TestSetup, topVisibleImageSrc} from './setup-test';

test.describe('Square', () => {
    const setup = new TestSetup();

    test.beforeEach(async ({browser}) => {
        await setup.setup(browser);
        await setup.page.evaluate(() => {
            const gallery = new window.Square(document.getElementById('gallery'), {itemsPerRow: 4});

            gallery.addItems(window.images);
        });
    });

    test.afterEach(async () => {
        await setup.teardown();
    });

    test('should create gallery, init, scroll and resize', async () => {
        await expect(countItems(setup.page)).toHaveCount(16);

        // Scroll
        await setup.page.evaluate(() => window.scrollTo(0, 400));
        await expect(countItems(setup.page)).toHaveCount(20);

        // Scroll more
        await setup.page.evaluate(() => window.scrollTo(0, 800));
        await expect(countItems(setup.page)).toHaveCount(24);

        // Change viewport with to test resize
        await setup.page.setViewportSize({width: 1160, height: 800});
        await setup.page.waitForTimeout(600); // wait debounce from gallery
        await expect(countItems(setup.page)).toHaveCount(24);
    });

    test('should keep the same content anchored near the top across a resize', async () => {
        await expect(countItems(setup.page)).toHaveCount(16);

        await setup.page.evaluate(() => window.scrollTo(0, 400));
        await expect(countItems(setup.page)).toHaveCount(20);

        await setup.page.evaluate(() => window.scrollTo(0, 800));
        await expect(countItems(setup.page)).toHaveCount(24);
        const beforeResize = await topVisibleImageSrc(setup.page);
        expect(beforeResize).not.toBeNull();

        await setup.page.setViewportSize({width: 1160, height: 800});
        await setup.page.waitForTimeout(600);

        const scrollYAfterResize = await setup.page.evaluate(() => window.scrollY);
        expect(scrollYAfterResize).toBeGreaterThan(0);

        const afterResize = await topVisibleImageSrc(setup.page);
        expect(afterResize).toBe(beforeResize);
    });
});
