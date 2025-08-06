import {test, expect} from '@playwright/test';
import {countItems} from './setup-test';

test.describe('Masonry', () => {
    test.beforeEach(async ({page}) => {
        await page.evaluate(() => {
            const gallery = new window.Masonry(document.getElementById('gallery'), {columnWidth: 450});
            gallery.init();
            gallery.addItems(window.images);
        });
    });

    test('should create gallery, init, scroll and resize', async ({page}) => {
        await expect(countItems(page)).toHaveCount(9);

        // Scroll
        await page.evaluate(() => window.scrollTo(0, 1600));
        await expect(countItems(page)).toHaveCount(13);

        // Scroll more
        await page.evaluate(() => window.scrollTo(0, 3200));
        await expect(countItems(page)).toHaveCount(17);

        // Change viewport with to test resize
        await page.setViewportSize({width: 1160, height: 800});
        await page.waitForTimeout(600); // wait debounce from gallery
        await expect(countItems(page)).toHaveCount(15);
    });
});
