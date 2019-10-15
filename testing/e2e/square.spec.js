// await jestPuppeteer.debug();

describe('Masonry', () => {

    it('should create gallery, init, scroll and resize"', async () => {

        await page.goto(PATH, {waitUntil: 'networkidle0'});

        // Init gallery and data
        await page.evaluate(() => {
            var gallery = new NaturalGallery.Square(document.getElementById('root'), {itemsPerRow: 4});
            gallery.init();
            gallery.addItems(images);
        });

        let items = await page.$$('#root .natural-gallery-body .figure');
        expect(items.length).toBe(16);

        // Scroll
        await page.evaluate(() => window.scrollTo(0, 400));
        items = await page.$$('#root .natural-gallery-body .figure');
        expect(items.length).toBe(20);

        // Scroll more
        await page.evaluate(() => window.scrollTo(0, 800));
        items = await page.$$('#root .natural-gallery-body .figure');
        expect(items.length).toBe(24);

        // Change viewport with to test resize
        await page.setViewport({width: 1160, height: page.viewport().height});
        await page.waitFor(600); // wait debounce from gallery
        items = await page.$$('#root .natural-gallery-body .figure');
        expect(items.length).toBe(24);

    }, 30000);

});

