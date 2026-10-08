/* eslint-disable no-restricted-globals */
import {beforeEach} from 'vitest';
import {setViewport} from './utils';

Object.defineProperties(document.documentElement, {
    clientHeight: {value: 768, writable: true, configurable: true},
    clientWidth: {value: 1024, writable: true, configurable: true},
});
// jsdom does not implement scrolling and logs "Not implemented: Window's scrollTo() method" whenever a gallery
// restores its scroll position. Tests that check scrolling replace window.scrollTo with a spy.
Object.defineProperty(window, 'scrollTo', {value: () => undefined, writable: true, configurable: true});

beforeEach(() => {
    setViewport(1024, 768);
});
