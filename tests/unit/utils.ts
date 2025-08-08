import {ModelAttributes} from '../../src';

/* eslint-disable no-restricted-globals */

export function key(eventValue: string): KeyboardEvent {
    return new KeyboardEvent('keydown', {key: eventValue});
}

export function click(): MouseEvent {
    return new MouseEvent('click', {
        bubbles: true,
        cancelable: true,
    });
}

export function setViewport(width = 1024, height = 768): void {
    Object.defineProperties(window, {
        innerWidth: {value: width, writable: true, configurable: true},
        innerHeight: {value: height, writable: true, configurable: true},
        outerWidth: {value: width, writable: true, configurable: true},
        outerHeight: {value: height, writable: true, configurable: true},
    });

    Object.defineProperties(document.documentElement, {
        clientWidth: {value: width, writable: true, configurable: true},
        clientHeight: {value: height, writable: true, configurable: true},
        scrollWidth: {value: width, writable: true, configurable: true},
        scrollHeight: {value: height, writable: true, configurable: true},
    });

    Object.defineProperties(document.body, {
        clientWidth: {value: width, writable: true, configurable: true},
        clientHeight: {value: height, writable: true, configurable: true},
        scrollWidth: {value: width, writable: true, configurable: true},
        scrollHeight: {value: height, writable: true, configurable: true},
    });

    window.dispatchEvent(new Event('resize'));
}

export function getContainerElement(width: number | null = null): HTMLElement {
    const container = document.createElement('div');
    Object.defineProperty(container, 'getBoundingClientRect', {
        value: () => ({width: width ?? window.innerWidth}),
        writable: true,
        configurable: true,
    });
    Object.defineProperty(container, 'offsetHeight', {value: 0, writable: true, configurable: true});
    return container;
}

export function getImages(count: number): ModelAttributes[] {
    return Array.from({length: count}, (_, i) => ({
        thumbnailSrc: `thumbnailSrc-${i}`,
        enlargedSrc: `enlargedSrc-${i}`,
        enlargedWidth: 1920,
        enlargedHeight: 1080,
        title: `title ${i}`,
        color: `color-${i}`,
    }));
}
