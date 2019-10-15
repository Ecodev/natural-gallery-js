// https://itnext.io/testing-your-javascript-in-a-browser-with-jest-puppeteer-express-and-webpack-c998a37ef887
// https://itnext.io/getting-started-using-puppeteer-headless-chrome-for-end-to-end-testing-8487718e4d97
// https://www.synbioz.com/blog/tech/tests-e2e-avec-jest-et-puppeteer
// http://dsheiko.com/weblog/end-to-end-testing-with-puppeteer
// https://medium.com/better-programming/how-to-use-puppeteer-with-jest-typescript-530a139ffe40
// https://medium.com/touch4it/end-to-end-testing-with-puppeteer-and-jest-ec8198145321
// https://dev.to/aalises/dealing-with-asynchrony-when-writing-end-to-end-tests-with-puppeteer--jest-n37

describe('Natural', () => {

    it('should create gallery, init, scroll and resize"', async () => {

        await page.goto(PATH, {waitUntil: 'networkidle0'});

        // Init gallery and data
        await page.evaluate(() => {
            var gallery = new NaturalGallery.Natural(document.getElementById('root'), {rowHeight: 400});
            gallery.init();
            gallery.addItems(images);
        });
        let items = await page.$$('#root .natural-gallery-body .figure');
        expect(items.length).toBe(9);

        // Scroll
        await page.evaluate(() => window.scrollTo(0, 500));
        items = await page.$$('#root .natural-gallery-body .figure');
        expect(items.length).toBe(12);

        // Scroll more
        await page.evaluate(() => window.scrollTo(0, 1000));
        items = await page.$$('#root .natural-gallery-body .figure');
        expect(items.length).toBe(14);

        // Change viewport with to test resize
        await page.setViewport({width: 1200, height: page.viewport().height});
        await page.waitFor(600); // wait debounce from gallery
        items = await page.$$('#root .natural-gallery-body .figure');
        expect(items.length).toBe(17);

    }, 30000);

});

