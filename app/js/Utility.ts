export module Utility {

    export function getIcon(name: string): SVGSVGElement {
        const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        svg.setAttribute('viewBox', '0 0 100 100');
        svg.innerHTML = '<use xlink:href="#' + name + '"></use>';
        return svg;
    }

    export function defaults(dest, source) {
        for (const key in Object.keys(source)) {
            if (typeof dest[key] === 'undefined') {
                dest[key] = source[key];
            }
        }
    }

}
