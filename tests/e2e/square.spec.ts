import {expect, test} from '@playwright/test';
import {
    countItems,
    countVisibleItems,
    expectItemsAroundViewport,
    expectItemsInViewport,
    figureTop,
    firstFullyVisibleImageSrc,
    TestSetup,
} from './setup-test';

test.describe('Square', () => {
    const setup = new TestSetup();

    test.beforeEach(async ({browser}) => {
        await setup.setup(browser);
        await setup.page.evaluate(() => {
            const gallery = new window.Square(document.getElementById('gallery'), {itemsPerRow: 4});

            gallery.addItems(window.images);
            window.gallery = gallery;
        });
    });

    test.afterEach(async () => {
        await setup.teardown();
    });

    test('should create gallery, init, scroll and resize', async () => {
        await expect(countItems(setup.page)).toHaveCount(28);
        await expect.poll(() => countVisibleItems(setup.page)).toBe(16);
        await expectItemsInViewport(setup.page);
        await expectItemsAroundViewport(setup.page);

        // Scroll
        await setup.page.evaluate(() => window.scrollTo(0, 400));
        await expect(countItems(setup.page)).toHaveCount(36);
        await expect.poll(() => countVisibleItems(setup.page)).toBe(20);
        await expectItemsInViewport(setup.page);
        await expectItemsAroundViewport(setup.page);

        // Scroll more
        await setup.page.evaluate(() => window.scrollTo(0, 800));
        await expect(countItems(setup.page)).toHaveCount(44);
        await expect.poll(() => countVisibleItems(setup.page)).toBe(16);
        await expectItemsInViewport(setup.page);
        await expectItemsAroundViewport(setup.page);

        // Change viewport with to test resize
        await setup.page.setViewportSize({width: 1160, height: 800});
        await setup.page.waitForTimeout(600); // wait debounce from gallery
        await expect(countItems(setup.page)).toHaveCount(40);
        await expect.poll(() => countVisibleItems(setup.page)).toBe(16);
        await expectItemsInViewport(setup.page);
        await expectItemsAroundViewport(setup.page);
    });

    test('should keep the same content anchored near the top across a resize', async () => {
        await expect(countItems(setup.page)).toHaveCount(28);

        await setup.page.evaluate(() => window.scrollTo(0, 400));
        await expect(countItems(setup.page)).toHaveCount(36);

        await setup.page.evaluate(() => window.scrollTo(0, 800));
        await expect(countItems(setup.page)).toHaveCount(44);
        const beforeResize = await firstFullyVisibleImageSrc(setup.page);
        expect(beforeResize).not.toBeNull();
        const topBeforeResize = await figureTop(setup.page, beforeResize!);

        await setup.page.setViewportSize({width: 1160, height: 800});
        await setup.page.waitForTimeout(600);

        const scrollYAfterResize = await setup.page.evaluate(() => window.scrollY);
        expect(scrollYAfterResize).toBeGreaterThan(0);

        // The same image stays at the same place in the viewport, even when the layout around it changed
        const topAfterResize = await figureTop(setup.page, beforeResize!);
        expect(topAfterResize).not.toBeNull();
        expect(Math.abs(topAfterResize! - topBeforeResize!)).toBeLessThan(2);
    });
});
