import {expect, test} from '@playwright/test';
import {countItems, TestSetup} from './setup-test';

test.describe('Natural', () => {
    const setup = new TestSetup();

    test.beforeEach(async ({browser}) => {
        await setup.setup(browser);

        await setup.page.evaluate(() => {
            const gallery = new window.Natural(document.getElementById('gallery'), {rowHeight: 400});
            gallery.init();
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
});
