import {test, expect} from '@playwright/test';
import {countItems} from './setup-test';

test.describe('Natural', () => {
    test.beforeEach(async ({page}) => {
        await page.evaluate(() => {
            const gallery = new window.Natural(document.getElementById('gallery'), {rowHeight: 400});
            gallery.init();
            gallery.addItems(window.images);
        });
    });

    test('should create gallery, init, scroll and resize', async ({page}) => {
        await expect(countItems(page)).toHaveCount(9);

        // Scroll
        await page.evaluate(() => window.scrollTo(0, 500));
        await expect(countItems(page)).toHaveCount(12);

        // Scroll more
        await page.evaluate(() => window.scrollTo(0, 1000));
        await expect(countItems(page)).toHaveCount(14);

        // Change viewport with to test resize
        await page.setViewportSize({width: 1200, height: 800});
        await page.waitForTimeout(600); // wait debounce from gallery
        await expect(countItems(page)).toHaveCount(17);
    });
});
