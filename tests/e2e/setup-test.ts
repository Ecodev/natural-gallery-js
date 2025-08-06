export function countItems(page: Page): Locator {
    return page.locator('#gallery .natural-gallery-body .figure');
}

import {Locator, Page, test} from '@playwright/test';

test.beforeEach(async ({page}) => {
    await page.goto('/test');
});
