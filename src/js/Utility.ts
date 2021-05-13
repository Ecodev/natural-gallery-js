import {SizedModel} from './galleries/AbstractGallery';

export interface RatioLimits {
    min?: number;
    max?: number;
}

export function getIcon(document: Document, name: string): SVGSVGElement {
    // Here we cannot use `SVGSVGElement.innerHTML`, because it is not available in SSR.
    // So instead we use `HTMLDivElement.innerHTML`, and get the SVG inside that div.
    // see: https://github.com/fgnass/domino/blob/12a5f67136a0ac10e3fa1649b8787ba3b309e9a7/lib/Element.js#L95
    const div = document.createElement('div');
    div.innerHTML = '<svg viewBox="0 0 100 100"><use xlink:href="#' + name + '"></use></svg>';
    return div.querySelector('svg');
}

export function getImageRatio(model: SizedModel, ratioLimits?: RatioLimits): number {
    let ratio = Number(model.enlargedWidth) / Number(model.enlargedHeight);

    if (ratioLimits) {
        if (ratioLimits.min && ratio < ratioLimits.min) {
            ratio = ratioLimits.min;
        } else if (ratioLimits.max && ratio > ratioLimits.max) {
            ratio = ratioLimits.max;
        }
    }

    return ratio;
}
