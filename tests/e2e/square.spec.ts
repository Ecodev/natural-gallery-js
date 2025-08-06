import {expect, test} from '@playwright/test';
import {countItems} from './setup-test';

test.describe('Square', () => {
    test.beforeEach(async ({page}) => {
        await page.evaluate(() => {
            const gallery = new window.Square(document.getElementById('gallery'), {itemsPerRow: 4});
            gallery.init();
            gallery.addItems(window.images);
        });
    });

    test('should create gallery, init, scroll and resize', async ({page}) => {
        await expect(countItems(page)).toHaveCount(16);

        // Scroll
        await page.evaluate(() => window.scrollTo(0, 400));
        await expect(countItems(page)).toHaveCount(20);

        // Scroll more
        await page.evaluate(() => window.scrollTo(0, 800));
        await expect(countItems(page)).toHaveCount(24);

        // Change viewport with to test resize
        await page.setViewportSize({width: 1160, height: 800});
        await page.waitForTimeout(600); // wait debounce from gallery
        await expect(countItems(page)).toHaveCount(24);
    });
});
