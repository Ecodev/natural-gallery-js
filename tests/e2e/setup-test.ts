/* eslint-disable no-restricted-globals */
import {Browser, BrowserContext, expect, Locator, Page} from '@playwright/test';

export function countItems(page: Page): Locator {
    return page.locator('#gallery .natural-gallery-body .figure');
}

/**
 * Src of the figure the gallery keeps in place across a resize: among the figures entirely within the viewport, the
 * leftmost, then the topmost. That is the first figure of the first entirely visible row for Natural and Square, and
 * the first entirely visible figure of the first column for Masonry.
 */
export function firstFullyVisibleImageSrc(page: Page): Promise<string | null> {
    return page.evaluate(() => {
        const figures = Array.from(document.querySelectorAll<HTMLElement>('#gallery .natural-gallery-body .figure'));
        const anchor = figures
            .map(figure => ({figure, rect: figure.getBoundingClientRect()}))
            .filter(({rect}) => rect.top >= 0 && rect.bottom <= window.innerHeight)
            .sort((a, b) => a.rect.left - b.rect.left || a.rect.top - b.rect.top)[0]?.figure;
        return anchor?.querySelector('img')?.getAttribute('src') ?? null;
    });
}

/**
 * Top of the figure showing the given image, relative to the viewport, or null when that figure is not in the DOM
 */
export function figureTop(page: Page, src: string): Promise<number | null> {
    return page.evaluate(imageSrc => {
        const image = document.querySelector<HTMLElement>(`#gallery .natural-gallery-body img[src="${imageSrc}"]`);
        return image?.closest('.figure')?.getBoundingClientRect().top ?? null;
    }, src);
}

/**
 * Number of items that the gallery reports as touching the viewport, even partially
 */
export function countVisibleItems(page: Page): Promise<number> {
    return page.evaluate(() => window.gallery.getVisibleCollection().length);
}

/**
 * Check that the items the gallery reports as visible are exactly the figures of the DOM touching the viewport, even
 * partially. Lists the images missing from the report, and the reported images that are not in the viewport.
 */
export async function expectItemsInViewport(page: Page): Promise<void> {
    await expect
        .poll(() =>
            page.evaluate(() => {
                const viewportHeight = document.documentElement.clientHeight;
                const inViewport = Array.from(
                    document.querySelectorAll<HTMLElement>('#gallery .natural-gallery-body .figure'),
                )
                    .filter(figure => {
                        const rect = figure.getBoundingClientRect();
                        return rect.bottom > 0 && rect.top < viewportHeight;
                    })
                    .map(figure => figure.querySelector('img')!.getAttribute('src')!);
                const reported = window.gallery.getVisibleCollection().map(item => item.model.thumbnailSrc);

                return {
                    missing: inViewport.filter(src => !reported.includes(src)),
                    notInViewport: reported.filter(src => !inViewport.includes(src)),
                };
            }),
        )
        .toEqual({missing: [], notInViewport: []});
}

/**
 * Check that the DOM holds exactly the figures around the viewport, the zone made of the viewport and one viewport
 * height above and below it:
 *   - every figure in the DOM touches that zone;
 *   - the figures in the DOM cover that zone without any hole, except where the gallery starts or ends, which is when
 *     no padding stands for hidden figures.
 * Masonry columns are checked one by one.
 */
export async function expectItemsAroundViewport(page: Page): Promise<void> {
    await expect
        .poll(() =>
            page.evaluate(() => {
                const tolerance = 10; // Gap between rows and rounding
                const viewportHeight = document.documentElement.clientHeight;
                const zoneTop = -viewportHeight;
                const zoneBottom = 2 * viewportHeight;
                const body = document.querySelector<HTMLElement>('#gallery .natural-gallery-body')!;
                const columns = Array.from(body.querySelectorAll<HTMLElement>('.column'));
                const containers = columns.length ? columns : [body];
                const errors: string[] = [];

                containers.forEach((container, index) => {
                    const name = columns.length ? `column ${index}` : 'gallery';
                    const rects = Array.from(container.querySelectorAll<HTMLElement>('.figure')).map(figure =>
                        figure.getBoundingClientRect(),
                    );

                    for (const rect of rects) {
                        if (rect.bottom < zoneTop - tolerance || rect.top > zoneBottom + tolerance) {
                            errors.push(`${name}: figure at ${Math.round(rect.top)}px is outside the zone`);
                        }
                    }

                    // One rect per row, the figures of a row share the same top
                    const rows = [...new Map(rects.map(rect => [Math.round(rect.top), rect])).values()].sort(
                        (a, b) => a.top - b.top,
                    );
                    if (!rows.length) {
                        return;
                    }

                    for (let i = 1; i < rows.length; i++) {
                        if (rows[i].top - rows[i - 1].bottom > tolerance) {
                            errors.push(
                                `${name}: hole between ${Math.round(rows[i - 1].bottom)}px and ${Math.round(rows[i].top)}px`,
                            );
                        }
                    }

                    const style = getComputedStyle(container);
                    if (parseFloat(style.paddingTop) > 0 && rows[0].top > zoneTop + tolerance) {
                        errors.push(
                            `${name}: figures hidden above the zone, first figure at ${Math.round(rows[0].top)}px`,
                        );
                    }

                    const lastRow = rows[rows.length - 1];
                    if (parseFloat(style.paddingBottom) > 0 && lastRow.bottom < zoneBottom - tolerance) {
                        errors.push(
                            `${name}: figures hidden below the zone, last figure ends at ${Math.round(lastRow.bottom)}px`,
                        );
                    }
                });

                return errors;
            }),
        )
        .toEqual([]);
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
