import {Locator, Page, test} from '@playwright/test';

export function countItems(page: Page): Locator {
    return page.locator('#gallery .natural-gallery-body .figure');
}

test.beforeEach(async ({page}) => {
    await page.goto('/test');

    const signatures = await page.evaluate(() => {
        return {
            Square: {
                toString: window.Square.toString(),
                prototype: !!window.Square.prototype,
                name: window.Square.name,
                length: window.Square.length,
            },
            Masonry: {
                toString: window.Masonry.toString(),
                prototype: !!window.Masonry.prototype,
                name: window.Masonry.name,
                length: window.Masonry.length,
            },
        };
    });
    console.log('Function signatures:', JSON.stringify(signatures, null, 2));

    await page.evaluate(() => {
        const gallery = document.getElementById('gallery');
        if (gallery) {
            gallery.innerHTML = '';
        }
    });
});
