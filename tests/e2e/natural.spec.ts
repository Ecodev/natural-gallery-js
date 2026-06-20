import {expect, test} from '@playwright/test';
import {countItems, TestSetup, topVisibleImageSrc} from './setup-test';

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

    test('should keep the same content anchored near the top across a resize', async () => {
        await expect(countItems(setup.page)).toHaveCount(9);

        await setup.page.evaluate(() => window.scrollTo(0, 500));
        await expect(countItems(setup.page)).toHaveCount(12);

        await setup.page.evaluate(() => window.scrollTo(0, 1000));
        await expect(countItems(setup.page)).toHaveCount(14);
        const beforeResize = await topVisibleImageSrc(setup.page);
        expect(beforeResize).not.toBeNull();

        await setup.page.setViewportSize({width: 1200, height: 800});
        await setup.page.waitForTimeout(600);

        const scrollYAfterResize = await setup.page.evaluate(() => window.scrollY);
        expect(scrollYAfterResize).toBeGreaterThan(0);

        const afterResize = await topVisibleImageSrc(setup.page);
        expect(afterResize).toBe(beforeResize);
    });
});
