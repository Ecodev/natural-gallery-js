import {Browser, BrowserContext, Locator, Page} from '@playwright/test';

export function countItems(page: Page): Locator {
    return page.locator('#gallery .natural-gallery-body .figure');
}

export class TestSetup {
    context!: BrowserContext;
    page!: Page;

    public async setup(browser: Browser) {
        this.context = await browser.newContext();
        this.page = await this.context.newPage();
        await this.page.goto('/test');
        return this;
    }

    public async teardown() {
        await this.page?.close();
        await this.context?.close();
    }
}
