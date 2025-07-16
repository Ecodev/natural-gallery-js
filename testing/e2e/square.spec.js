import {launch} from 'puppeteer';

describe('Square', () => {
    let browser, page;

    beforeAll(async () => {
        browser = await launch({
            headless: process.env.HEADLESS !== 'false',
            slowMo: 20,
            defaultViewport: {width: 960, height: 800},
            args: ['--window-size=1500,800', '--no-sandbox'],
        });
        page = await browser.newPage();
        await page.goto('http://localhost:4444', {waitUntil: 'networkidle0'});
    });

    afterAll(async () => {
        await browser.close();
    });

    it('should create gallery, init, scroll and resize"', async () => {
        await page.goto(PATH, {waitUntil: 'networkidle0'});

        // Init gallery and data
        await page.evaluate(() => {
            // `Square` is provider on `window` by `server.js`
            // eslint-disable-next-line no-undef
            var gallery = new Square(document.getElementById('root'), {itemsPerRow: 4});
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
        await new Promise(resolve => setTimeout(resolve, 600)); // wait debounce from gallery
        items = await page.$$('#root .natural-gallery-body .figure');
        expect(items.length).toBe(24);
    }, 30000);
});
