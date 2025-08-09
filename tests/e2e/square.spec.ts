import {expect, test} from '@playwright/test';
import {countItems, TestSetup} from './setup-test';

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
});
