/* eslint-disable no-restricted-globals */
import {Browser, BrowserContext, Locator, Page} from '@playwright/test';

export function countItems(page: Page): Locator {
    return page.locator('#gallery .natural-gallery-body .figure');
}

/**
 * Src of the topmost figure currently intersecting the viewport — used to verify that resizing/rotating the gallery
 * keeps the same content anchored near the top instead of jumping back to the start of the collection.
 *
 * Picks the geometrically topmost visible figure (smallest top among those with bottom > 0), not just the first one
 * in DOM order — for Masonry, DOM order is column-by-column, so the true topmost figure can live in any column.
 */
export function topVisibleImageSrc(page: Page): Promise<string | null> {
    return page.evaluate(() => {
        const figures = Array.from(document.querySelectorAll<HTMLElement>('#gallery .natural-gallery-body .figure'));
        const visible = figures
            .map(figure => figure.getBoundingClientRect())
            .map((rect, i) => ({rect, figure: figures[i]}))
            .filter(({rect}) => rect.bottom > 0)
            .sort((a, b) => a.rect.top - b.rect.top)[0]?.figure;
        return visible?.querySelector('img')?.getAttribute('src') ?? null;
    });
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
