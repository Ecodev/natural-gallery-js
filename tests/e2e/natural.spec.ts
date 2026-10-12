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

test.describe('Natural', () => {
    const setup = new TestSetup();

    test.beforeEach(async ({browser}) => {
        await setup.setup(browser);

        await setup.page.evaluate(() => {
            const gallery = new window.Natural(document.getElementById('gallery'), {rowHeight: 400});

            gallery.addItems(window.images);
            window.gallery = gallery;
        });
    });

    test.afterEach(async () => {
        await setup.teardown();
    });

    test('should create gallery, init, scroll and resize', async () => {
        await expect(countItems(setup.page)).toHaveCount(18);
        await expect.poll(() => countVisibleItems(setup.page)).toBe(9);
        await expectItemsInViewport(setup.page);
        await expectItemsAroundViewport(setup.page);

        // Scroll
        await setup.page.evaluate(() => window.scrollTo(0, 500));
        await expect(countItems(setup.page)).toHaveCount(23);
        await expect.poll(() => countVisibleItems(setup.page)).toBe(11);
        await expectItemsInViewport(setup.page);
        await expectItemsAroundViewport(setup.page);

        // Scroll more
        await setup.page.evaluate(() => window.scrollTo(0, 1000));
        await expect(countItems(setup.page)).toHaveCount(26);
        await expect.poll(() => countVisibleItems(setup.page)).toBe(11);
        await expectItemsInViewport(setup.page);
        await expectItemsAroundViewport(setup.page);

        // Change viewport with to test resize
        await setup.page.setViewportSize({width: 1200, height: 800});
        await setup.page.waitForTimeout(600); // wait debounce from gallery
        await expect(countItems(setup.page)).toHaveCount(25);
        await expect.poll(() => countVisibleItems(setup.page)).toBe(10);
        await expectItemsInViewport(setup.page);
        await expectItemsAroundViewport(setup.page);
    });

    test('should keep the same content anchored near the top across a resize', async () => {
        await expect(countItems(setup.page)).toHaveCount(18);

        await setup.page.evaluate(() => window.scrollTo(0, 500));
        await expect(countItems(setup.page)).toHaveCount(23);

        await setup.page.evaluate(() => window.scrollTo(0, 1000));
        await expect(countItems(setup.page)).toHaveCount(26);
        const beforeResize = await firstFullyVisibleImageSrc(setup.page);
        expect(beforeResize).not.toBeNull();
        const topBeforeResize = await figureTop(setup.page, beforeResize!);

        await setup.page.setViewportSize({width: 1200, height: 800});
        await setup.page.waitForTimeout(600);

        const scrollYAfterResize = await setup.page.evaluate(() => window.scrollY);
        expect(scrollYAfterResize).toBeGreaterThan(0);

        // The same image stays at the same place in the viewport, even when the layout around it changed
        const topAfterResize = await figureTop(setup.page, beforeResize!);
        expect(topAfterResize).not.toBeNull();
        expect(Math.abs(topAfterResize! - topBeforeResize!)).toBeLessThan(2);
    });
});
