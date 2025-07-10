import {getIcon, getImageRatio, sanitizeHtml, getImageRatioAndIfCropped} from '../../src/js/Utility';
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

describe('sanitizeHtml', () => {
    test('should not touch plain text and <br>', () => {
        expect(sanitizeHtml('')).toBe('');
        expect(sanitizeHtml(' ')).toBe(' ');
        expect(sanitizeHtml('foo')).toBe('foo');
        expect(sanitizeHtml('one > two > three')).toBe('one > two > three');
        expect(sanitizeHtml('foo <br/>bar')).toBe('foo <br/>bar');
        expect(sanitizeHtml('foo <br />bar')).toBe('foo <br />bar');
        expect(sanitizeHtml('foo <br>bar')).toBe('foo <br>bar');
        expect(sanitizeHtml('foo <BR>bar')).toBe('foo <BR>bar');
        expect(sanitizeHtml('foo <br >bar')).toBe('foo <br >bar');
    });

    test('should remove most HTML tag', () => {
        expect(sanitizeHtml('<strong>')).toBe('');
        expect(sanitizeHtml('<strong></strong>')).toBe('');
        expect(sanitizeHtml('foo <strong>bar</strong> baz')).toBe('foo bar baz');
        expect(sanitizeHtml('foo <unknown-tag>bar</unknown-tag> baz')).toBe('foo bar baz');
        expect(sanitizeHtml('foo <unknown-tag attr="val">bar</unknown-tag> baz')).toBe('foo bar baz');
        expect(sanitizeHtml('foo <unknown-tag \n attr="val">bar</unknown-tag> baz')).toBe('foo bar baz');
        expect(sanitizeHtml('foo \n<unknown-tag \nattr="val">bar\n</unknown-tag> \nbaz')).toBe('foo \nbar\n \nbaz');
        expect(sanitizeHtml('<STRONG>foo<STRONG> <strong>bar</strong> <em>baz</em>')).toBe('foo bar baz');
        expect(sanitizeHtml('<strong>one</strong> > two > three')).toBe('one > two > three');
        expect(sanitizeHtml('<scrip<script>is removed</script>t>alert(123)</script>')).toBe('is removedt>alert(123)'); // Broken but safe HTML
        expect(sanitizeHtml('<!<!--- comment --->>')).toBe('>'); // Broken but safe HTML
        expect(sanitizeHtml('a<>b')).toBe('ab');
        expect(sanitizeHtml('a</>b')).toBe('ab');
        expect(sanitizeHtml('a<>b</>c')).toBe('abc');
        expect(
            sanitizeHtml(`<div
        >foo</
        div>`),
        ).toBe('foo');
    });

    test('sanitizeHtml should handle undefined and null', () => {
        expect(sanitizeHtml(undefined)).toBe('');
        // @ts-expect-error: Testing sanitizeHtml with null input
        expect(sanitizeHtml(null)).toBe('');
    });

    test('sanitizeHtml should keep <br> but remove other tags', () => {
        expect(sanitizeHtml('foo<br>bar')).toBe('foo<br>bar');
        expect(sanitizeHtml('foo<br/>bar')).toBe('foo<br/>bar');
        expect(sanitizeHtml('foo<strong>bar</strong>baz')).toBe('foobarbaz');
    });
});

describe('getImageRatioAndIfCropped', () => {
    it('should return correct ratio and cropped=false when within limits', () => {
        const result = getImageRatioAndIfCropped({enlargedWidth: 400, enlargedHeight: 200}, {min: 1, max: 3});
        expect(result).toEqual({ratio: 2, cropped: false});
    });

    it('should crop to min if ratio is too low', () => {
        const result = getImageRatioAndIfCropped({enlargedWidth: 100, enlargedHeight: 200}, {min: 1});
        expect(result).toEqual({ratio: 1, cropped: true});
    });

    it('should crop to max if ratio is too high', () => {
        const result = getImageRatioAndIfCropped({enlargedWidth: 400, enlargedHeight: 100}, {max: 2});
        expect(result).toEqual({ratio: 2, cropped: true});
    });
});
