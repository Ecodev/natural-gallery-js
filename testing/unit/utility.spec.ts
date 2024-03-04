import {getIcon, getImageRatio} from '../../src/js/Utility';
import * as domino from 'domino';

describe('Utility', () => {
    test('should limit image ratio', () => {
        const ratios = getImageRatio({enlargedWidth: 6000, enlargedHeight: 4000}, {});
        expect(ratios).toBe(1.5);

        const ratios2 = getImageRatio({enlargedWidth: 6000, enlargedHeight: 4000}, {min: 2});
        expect(ratios2).toBe(2);

        const ratios3 = getImageRatio({enlargedWidth: 6000, enlargedHeight: 4000}, {max: 1});
        expect(ratios3).toBe(1);
    });

    test('should get svg', () => {
        const svg = getIcon(document, 'my-name');
        expect(svg.outerHTML).toBe('<svg viewBox="0 0 100 100"><use xlink:href="#my-name"></use></svg>');
    });

    test('should get svg with Angular SSR', () => {
        const window = domino.createWindow('<h1>Hello world</h1>', 'http://example.com');
        const document = window.document;

        const svg = getIcon(document, 'my-name');
        expect(svg.outerHTML).toBe('<svg viewBox="0 0 100 100"><use xlink:href="#my-name"></use></svg>');
    });
});
