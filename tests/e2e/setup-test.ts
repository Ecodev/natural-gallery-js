export function countItems(page: Page): Locator {
    return page.locator('#gallery .natural-gallery-body .figure');
}

import {Locator, Page, test} from '@playwright/test';

test.beforeEach(async ({page}) => {
    await page.goto('/test');
    await page.waitForTimeout(5000);

    const result = await page.evaluate(() => {
        return {
            windowKeys: Object.keys(window).filter(k => k.includes('Square') || k.includes('Natural')),
            hasSquare: 'Square' in window,
            squareKeys: Object.keys(window.Square),
            squareValues: Object.values(window.Square),
            scripts: document.scripts.length,
            errors: document.querySelector('script[type="module"]') ? 'module found' : 'no module',
        };
    });

    console.log('Diagnostic:', result);
});
