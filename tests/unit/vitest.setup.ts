/* eslint-disable no-restricted-globals */
import {beforeEach} from 'vitest';
import {setViewport} from './utils';

Object.defineProperties(document.documentElement, {
    clientHeight: {value: 768, writable: true, configurable: true},
    clientWidth: {value: 1024, writable: true, configurable: true},
});
// jsdom does not implement scrolling and logs "Not implemented: Window's scrollTo() method" whenever a gallery
// restores its scroll position, and "Not implemented: Window's scrollBy() method" whenever a selection drag scrolls
// the gallery. Tests that check scrolling replace window.scrollTo or window.scrollBy with a spy.
Object.defineProperty(window, 'scrollTo', {value: () => undefined, writable: true, configurable: true});
Object.defineProperty(window, 'scrollBy', {value: () => undefined, writable: true, configurable: true});

beforeEach(() => {
    setViewport(1024, 768);
});
