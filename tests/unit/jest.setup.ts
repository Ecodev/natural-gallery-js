/* eslint-disable no-restricted-globals */
import {setViewport} from './utils';

Object.defineProperties(document.documentElement, {
    clientHeight: {value: 768, writable: true, configurable: true},
    clientWidth: {value: 1024, writable: true, configurable: true},
});
beforeEach(() => {
    setViewport(1024, 768);
});
