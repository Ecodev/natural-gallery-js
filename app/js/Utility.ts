export module Utility {

    export function getIcon(name: string): SVGSVGElement {
        const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        svg.setAttribute('viewBox', '0 0 100 100');
        svg.innerHTML = '<use xlink:href="#' + name + '"></use>';
        return svg;
    }

    export function truncate(value: string, limit = 50, ellipsis = '...') {
        ellipsis = value.length > limit ? ellipsis : '';
        return `${value.substr(0, limit)}${ellipsis}`;
    }

}
