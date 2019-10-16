// await jestPuppeteer.debug();

describe('Masonry', () => {

    it('should create gallery, init, scroll and resize"', async () => {

        await page.goto(PATH, {waitUntil: 'networkidle0'});

        // Init gallery and data
        await page.evaluate(() => {
            var gallery = new NaturalGallery.Masonry(document.getElementById('root'), {columnWidth: 450});
            gallery.init();
            gallery.addItems(images);
        });

        let items = await page.$$('#root .natural-gallery-body .figure');
        expect(items.length).toBe(9);

        // Scroll
        await page.evaluate(() => window.scrollTo(0, 1600));
        items = await page.$$('#root .natural-gallery-body .figure');
        expect(items.length).toBe(13);

        // Scroll more
        await page.evaluate(() => window.scrollTo(0, 3200));
        items = await page.$$('#root .natural-gallery-body .figure');
        expect(items.length).toBe(17);

        // Change viewport with to test resize
        await page.setViewport({width: 1160, height: page.viewport().height});
        await page.waitFor(600); // wait debounce from gallery
        items = await page.$$('#root .natural-gallery-body .figure');
        expect(items.length).toBe(15);

    }, 30000);

});

