import {expect, test} from '@playwright/test';
import {countItems} from './setup-test';

test.describe('Square', () => {
    test.beforeEach(async ({page}) => {
        const importDebug = await page.evaluate(async () => {
            try {
                console.log("Tentative d'import...");
                const module = await import('/assets/natural-gallery-js/natural-gallery.js');
                console.log('Import réussi:', module);
                return {
                    success: true,
                    hasSquare: !!module.Square,
                    moduleKeys: Object.keys(module),
                };
            } catch (error) {
                console.log("Erreur d'import:", error);
                return {
                    success: false,
                    error: error.message,
                    stack: error.stack,
                };
            }
        });
        console.log('Import debug:', importDebug);

        await page.evaluate(() => {
            const gallery = new window.Square(document.getElementById('gallery'), {itemsPerRow: 4});
            gallery.init();
            gallery.addItems(window.images);
        });
    });

    test('should create gallery, init, scroll and resize', async ({page}) => {
        await expect(countItems(page)).toHaveCount(16);

        // Scroll
        await page.evaluate(() => window.scrollTo(0, 400));
        await expect(countItems(page)).toHaveCount(20);

        // Scroll more
        await page.evaluate(() => window.scrollTo(0, 800));
        await expect(countItems(page)).toHaveCount(24);

        // Change viewport with to test resize
        await page.setViewportSize({width: 1160, height: 800});
        await page.waitForTimeout(600); // wait debounce from gallery
        await expect(countItems(page)).toHaveCount(24);
    });
});
