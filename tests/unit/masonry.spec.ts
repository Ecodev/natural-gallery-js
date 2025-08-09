import {Masonry} from '../../src';
import {describe, expect, it} from '@jest/globals';
import {getContainerElement} from './utils';
import {getBaseExpectedOptions, testGallery} from './abstract-gallery';

describe('Masonry Gallery', () => {
    testGallery(
        Masonry,
        {
            columnWidth: 400,
            gap: 4,
            ratioLimit: {
                min: 0.6,
                max: 0.8,
            },
        },
        {
            options: {
                ...getBaseExpectedOptions(),
                columnWidth: 400,
                infiniteScrollOffset: -563.3333333333334,
                ratioLimit: {
                    min: 0.6,
                    max: 0.8,
                },
            },
        },
    );

    it('should error with invalid column size', () => {
        const container = getContainerElement();
        expect(() => new Masonry(container, {columnWidth: -123})).toThrow('Option.columnWidth must be positive');
    });
});
