import { SizedModel } from './galleries/AbstractGallery';

export interface RatioLimits {
    min?: number;
    max?: number;
}

export function getIcon(name: string): SVGSVGElement {
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute('viewBox', '0 0 100 100');
    svg.innerHTML = '<use xlink:href="#' + name + '"></use>';
    return svg;
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
