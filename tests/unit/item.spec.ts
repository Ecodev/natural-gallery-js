import {Item, ItemOptions} from '../../src/js/Item';
import {LabelVisibility} from '../../src';
import {afterEach, beforeEach, describe, expect, it} from '@jest/globals';
import {ModelAttributes} from '../../src';
import {click, key} from './utils';

type EventVariant = {click: boolean; enter: boolean; space: boolean};

// ES for Enter and Space keys
const NO_EVENT: EventVariant = {click: false, enter: false, space: false};
const CLICK: EventVariant = {click: true, enter: false, space: false};
const ALL_EVENTS: EventVariant = {click: true, enter: true, space: true};

type SemanticItem = {
    item: Item<ModelAttributes>;
    root: HTMLElement;
    image: HTMLElement;
    caption: HTMLElement | null;
    link: HTMLElement | HTMLButtonElement | null;
    select: HTMLElement | null;
};

type ItemExpectation = {
    warn: number;
    select: EventVariant | null;
    root: ElementExpectation;
    image: ElementExpectation;
    caption: ElementExpectation | null;
    link: ElementExpectation | null;
};

type ElementExpectation = {
    tag?: string;
    href?: string | null;
    linkTarget?: string | null;
    text?: string;
    alt?: string | null;
    ariaLabel: string | null;
    tabindex: string | null;
    zoom: EventVariant;
    activate: EventVariant;
};

function createItem(
    document: Document,
    model: Partial<ModelAttributes> = {},
    options: Partial<ItemOptions> = {},
): SemanticItem {
    const defaultModel = {
        thumbnailSrc: 'image.jpg',
        enlargedWidth: 600,
        enlargedHeight: 400,
        ...model,
    };

    const defaultOptions = {
        labelVisibility: LabelVisibility.NEVER,
        lightbox: false,
        ...options,
    };

    const item = new Item(document, defaultOptions, defaultModel);
    const root = item.init();

    return {
        item: item,
        root,
        image: root.querySelector('img')!,
        caption: root.querySelector('figcaption'),
        link: root.querySelector('a') ?? root.querySelector('figcaption button'),
        select: root.querySelector('.select-btn'),
    };
}

function testItem(item: SemanticItem, expected: ItemExpectation, warnSpy: jest.SpyInstance): void {
    expect(warnSpy).toHaveBeenCalledTimes(expected.warn);
    warnSpy.mockClear();

    testHTMLElement(item.root, expected.root, item.root);
    testHTMLElement(item.root, expected.image, item.image);

    if (expected.caption === null) {
        expect(item.caption).toBe(null);
    } else {
        testHTMLElement(item.root, expected.caption, item.caption);
    }

    if (expected.link === null) {
        expect(item.link).toBe(null);
    } else {
        testHTMLElement(item.root, expected.link, item.link);
    }

    if (expected.select === null) {
        expect(item.select).toBe(null);
    } else {
        expectEvent(item.root, click(), item.select!, 'select', expected.select.click);
        expectEvent(item.root, key('Enter'), item.select!, 'select', expected.select.enter);
        expectEvent(item.root, key(' '), item.select!, 'select', expected.select.space);
    }
}

function testHTMLElement(root: HTMLElement, expected: ElementExpectation, target?: HTMLElement | null): void {
    expect(target).toBeDefined();

    if (expected.tag !== undefined) {
        expect(target!.tagName).toBe(expected.tag);
    }
    if (expected.href !== undefined) {
        expect(target!.getAttribute('href')).toBe(expected.href);
    }
    if (expected.text !== undefined) {
        expect(target!.textContent).toBe(expected.text);
    }
    if (expected.alt !== undefined) {
        expect(target!.getAttribute('alt')).toBe(expected.alt);
    }

    expect(target!.getAttribute('aria-label')).toBe(expected.ariaLabel);
    expect(target!.getAttribute('tabindex')).toBe(expected.tabindex);

    expectEvent(root, click(), target!, 'zoom', expected.zoom.click);
    expectEvent(root, key('Enter'), target!, 'zoom', expected.zoom.enter);
    expectEvent(root, key(' '), target!, 'zoom', expected.zoom.space);

    expectEvent(root, click(), target!, 'activate', expected.activate.click);
    expectEvent(root, key('Enter'), target!, 'activate', expected.activate.enter);
    expectEvent(root, key(' '), target!, 'activate', expected.activate.space);
}

function expectEvent(
    root: HTMLElement,
    triggerEvent: Event,
    eventTarget: HTMLElement,
    outputEvent: string,
    expected: boolean,
): void {
    const eventSpy = jest.fn();
    root.addEventListener(outputEvent, eventSpy);
    eventTarget.dispatchEvent(triggerEvent);
    if (expected) {
        expect(eventSpy).toHaveBeenCalled();
    } else {
        expect(eventSpy).not.toHaveBeenCalled();
    }
    root.removeEventListener(outputEvent, eventSpy);
}

describe('Item', () => {
    let mockDocument: Document;
    let consoleWarnSpy: jest.SpyInstance;

    afterEach(() => consoleWarnSpy.mockRestore());
    beforeEach(() => {
        mockDocument = document;
        consoleWarnSpy = jest.spyOn(console, 'warn').mockImplementation();
    });

    it('should setup link target', () => {
        const item = createItem(mockDocument, {title: 'My title', link: 'https://example.com', linkTarget: '_blank'});
        testItem(
            item,
            {
                warn: 0,
                select: null,
                root: {
                    tag: 'A',
                    ariaLabel: null,
                    alt: null,
                    tabindex: null,
                    href: 'https://example.com',
                    linkTarget: '_blank',
                    zoom: NO_EVENT,
                    activate: NO_EVENT,
                },
                image: {
                    ariaLabel: null,
                    alt: 'My title',
                    tabindex: null,
                    href: null,
                    zoom: NO_EVENT,
                    activate: NO_EVENT,
                },
                caption: null,
                link: null,
            },
            consoleWarnSpy,
        );
    });

    it('should have hoverable link', () => {
        const item = createItem(mockDocument, {title: 'My title'}, {labelVisibility: LabelVisibility.HOVER});
        expect(item.caption?.classList.contains('hover')).toBe(true);

        item.item.setLabelHover(false);
        expect(item.caption?.classList.contains('hover')).toBe(false);
        item.item.setLabelHover(true);
        expect(item.caption?.classList.contains('hover')).toBe(true);
    });

    it('should remove item from DOM', () => {
        const item = createItem(mockDocument, {title: 'My title'}, {labelVisibility: LabelVisibility.HOVER});

        mockDocument.body.appendChild(item.root);
        expect(item.root.parentNode).toBe(mockDocument.body);
        item.item.remove();
        expect(item.root.parentNode).toBe(null);
    });

    it('should should set transparent background color', () => {
        const item = createItem(mockDocument, {title: 'My title', color: '#ffffff'});
        expect(item.root.style.backgroundColor).toEqual('rgba(255, 255, 255, 0.067)');
    });

    it('should initialize item unchecked', () => {
        const item = createItem(mockDocument, {title: 'My title'}, {selectable: true});
        expect(item.select?.getAttribute('aria-checked')).toBe('false');
    });

    it('should initialize item checked', () => {
        const item = createItem(mockDocument, {title: 'My title', selected: true}, {selectable: true});
        expect(item.select?.getAttribute('aria-checked')).toBe('true');
    });

    it('should reflect selected status to aria', () => {
        const item = createItem(mockDocument, {title: 'My title'}, {selectable: true});
        expect(item.select?.getAttribute('aria-checked')).toBe('false');
        item.select?.click();
        expect(item.select?.getAttribute('aria-checked')).toBe('true');
        item.select?.click();
        expect(item.select?.getAttribute('aria-checked')).toBe('false');
    });

    const testWithSelectable = (selectable: boolean, events: EventVariant | null) => {
        const suffix = selectable ? ', selectable' : '';

        it('should render image with alt and no interaction' + suffix, () => {
            const item = createItem(mockDocument, {title: 'My title'}, {selectable});
            testItem(
                item,
                {
                    warn: 0,
                    select: events,
                    root: {
                        tag: 'FIGURE',
                        ariaLabel: null,
                        tabindex: null,
                        href: null,
                        zoom: NO_EVENT,
                        activate: NO_EVENT,
                    },
                    image: {
                        ariaLabel: null,
                        alt: 'My title',
                        tabindex: null,
                        href: null,
                        zoom: NO_EVENT,
                        activate: NO_EVENT,
                    },
                    caption: null,
                    link: null,
                },
                consoleWarnSpy,
            );
        });

        it('should render caption + no interaction' + suffix, () => {
            const item = createItem(
                mockDocument,
                {title: 'My title'},
                {labelVisibility: LabelVisibility.ALWAYS, selectable},
            );
            testItem(
                item,
                {
                    warn: 0,
                    select: events,
                    root: {
                        tag: 'FIGURE',
                        ariaLabel: null,
                        tabindex: null,
                        href: null,
                        zoom: NO_EVENT,
                        activate: NO_EVENT,
                    },
                    image: {ariaLabel: null, alt: null, tabindex: null, href: null, zoom: NO_EVENT, activate: NO_EVENT},
                    caption: {
                        ariaLabel: null,
                        text: 'My title',
                        tabindex: null,
                        href: null,
                        zoom: NO_EVENT,
                        activate: NO_EVENT,
                    },
                    link: null,
                },
                consoleWarnSpy,
            );
        });

        it('should render caption + meaningful alt + no interaction' + suffix, () => {
            const item = createItem(
                mockDocument,
                {title: 'My title', alt: 'My alt'},
                {labelVisibility: LabelVisibility.ALWAYS, selectable},
            );

            testItem(
                item,
                {
                    warn: 0,
                    select: events,
                    root: {
                        tag: 'FIGURE',
                        ariaLabel: null,
                        tabindex: null,
                        href: null,
                        zoom: NO_EVENT,
                        activate: NO_EVENT,
                    },
                    image: {
                        ariaLabel: null,
                        alt: 'My alt',
                        tabindex: null,
                        href: null,
                        zoom: NO_EVENT,
                        activate: NO_EVENT,
                    },
                    caption: {
                        ariaLabel: null,
                        text: 'My title',
                        tabindex: null,
                        href: null,
                        zoom: NO_EVENT,
                        activate: NO_EVENT,
                    },
                    link: null,
                },
                consoleWarnSpy,
            );
        });

        it('should render caption + no identical alt + no interaction' + suffix, () => {
            const item = createItem(
                mockDocument,
                {title: 'My title', alt: 'My title'},
                {labelVisibility: LabelVisibility.ALWAYS, selectable},
            );
            testItem(
                item,
                {
                    warn: 0,
                    select: events,
                    root: {
                        tag: 'FIGURE',
                        ariaLabel: null,
                        tabindex: null,
                        href: null,
                        zoom: NO_EVENT,
                        activate: NO_EVENT,
                    },
                    image: {ariaLabel: null, alt: null, tabindex: null, href: null, zoom: NO_EVENT, activate: NO_EVENT},
                    caption: {
                        ariaLabel: null,
                        text: 'My title',
                        tabindex: null,
                        href: null,
                        zoom: NO_EVENT,
                        activate: NO_EVENT,
                    },
                    link: null,
                },
                consoleWarnSpy,
            );
        });

        it('should zoom' + suffix, () => {
            const item = createItem(mockDocument, {title: 'My title'}, {selectable, lightbox: true});
            testItem(
                item,
                {
                    warn: 0,
                    select: events,
                    root: {
                        tag: 'FIGURE',
                        ariaLabel: 'zoom',
                        tabindex: '0',
                        href: null,
                        zoom: ALL_EVENTS,
                        activate: NO_EVENT,
                    },
                    image: {
                        ariaLabel: null,
                        alt: 'My title',
                        tabindex: null,
                        href: null,
                        zoom: CLICK,
                        activate: NO_EVENT,
                    },
                    caption: null,
                    link: null,
                },
                consoleWarnSpy,
            );
        });

        it('should render caption + zoom' + suffix, () => {
            const item = createItem(
                mockDocument,
                {title: 'My title'},
                {labelVisibility: LabelVisibility.ALWAYS, selectable, lightbox: true},
            );
            testItem(
                item,
                {
                    warn: 0,
                    select: events,
                    root: {
                        tag: 'FIGURE',
                        ariaLabel: 'zoom',
                        tabindex: '0',
                        href: null,
                        zoom: ALL_EVENTS,
                        activate: NO_EVENT,
                    },
                    image: {ariaLabel: null, alt: null, tabindex: null, href: null, zoom: CLICK, activate: NO_EVENT},
                    caption: {
                        ariaLabel: null,
                        text: 'My title',
                        tabindex: null,
                        href: null,
                        zoom: CLICK,
                        activate: NO_EVENT,
                    },
                    link: null,
                },
                consoleWarnSpy,
            );
        });

        it('should render caption + zoom + meaningful alt' + suffix, () => {
            const item = createItem(
                mockDocument,
                {title: 'My title', alt: 'My alt'},
                {labelVisibility: LabelVisibility.ALWAYS, selectable, lightbox: true},
            );
            testItem(
                item,
                {
                    warn: 0,
                    select: events,
                    root: {
                        tag: 'FIGURE',
                        ariaLabel: 'zoom',
                        tabindex: '0',
                        href: null,
                        zoom: ALL_EVENTS,
                        activate: NO_EVENT,
                    },
                    image: {
                        ariaLabel: null,
                        alt: 'My alt',
                        tabindex: null,
                        href: null,
                        zoom: CLICK,
                        activate: NO_EVENT,
                    },
                    caption: {
                        ariaLabel: null,
                        text: 'My title',
                        tabindex: null,
                        href: null,
                        zoom: CLICK,
                        activate: NO_EVENT,
                    },
                    link: null,
                },
                consoleWarnSpy,
            );
        });

        it('should render caption + zoom + ignore identical alt' + suffix, () => {
            const item = createItem(
                mockDocument,
                {title: 'My title', alt: 'My title'},
                {labelVisibility: LabelVisibility.ALWAYS, selectable, lightbox: true},
            );
            testItem(
                item,
                {
                    warn: 0,
                    select: events,
                    root: {
                        tag: 'FIGURE',
                        ariaLabel: 'zoom',
                        tabindex: '0',
                        href: null,
                        zoom: ALL_EVENTS,
                        activate: NO_EVENT,
                    },
                    image: {ariaLabel: null, alt: null, tabindex: null, href: null, zoom: CLICK, activate: NO_EVENT},
                    caption: {
                        ariaLabel: null,
                        text: 'My title',
                        tabindex: null,
                        href: null,
                        zoom: CLICK,
                        activate: NO_EVENT,
                    },
                    link: null,
                },
                consoleWarnSpy,
            );
        });

        it('should render ignored link + zoom + alt' + suffix, () => {
            // Specific case, link is ignored
            const item = createItem(
                mockDocument,
                {alt: 'My alt', link: 'https://example.com'},
                {labelVisibility: LabelVisibility.ALWAYS, selectable, lightbox: true},
            );
            testItem(
                item,
                {
                    warn: 1,
                    select: events,
                    root: {
                        tag: 'FIGURE',
                        ariaLabel: 'zoom',
                        tabindex: '0',
                        href: null,
                        zoom: ALL_EVENTS,
                        activate: NO_EVENT,
                    },
                    image: {
                        ariaLabel: null,
                        alt: 'My alt',
                        tabindex: null,
                        href: null,
                        zoom: CLICK,
                        activate: NO_EVENT,
                    },
                    caption: null,
                    link: null,
                },
                consoleWarnSpy,
            );
        });

        it('should render link + caption + zoom' + suffix, () => {
            const item = createItem(
                mockDocument,
                {title: 'My title', link: 'https://example.com'},
                {labelVisibility: LabelVisibility.ALWAYS, selectable, lightbox: true},
            );
            testItem(
                item,
                {
                    warn: 0,
                    select: events,
                    root: {
                        tag: 'FIGURE',
                        ariaLabel: null,
                        tabindex: null,
                        href: null,
                        zoom: NO_EVENT,
                        activate: NO_EVENT,
                    },
                    image: {
                        ariaLabel: 'zoom',
                        alt: null,
                        tabindex: '0',
                        href: null,
                        zoom: ALL_EVENTS,
                        activate: NO_EVENT,
                    },
                    caption: {
                        ariaLabel: null,
                        text: 'My title',
                        tabindex: null,
                        href: null,
                        zoom: NO_EVENT,
                        activate: NO_EVENT,
                    },
                    link: {
                        ariaLabel: null,
                        text: 'My title',
                        tabindex: null,
                        href: 'https://example.com',
                        zoom: NO_EVENT,
                        activate: NO_EVENT,
                    },
                },
                consoleWarnSpy,
            );
        });

        it('should render link + caption + zoom + meaningful alt' + suffix, () => {
            const item = createItem(
                mockDocument,
                {title: 'My title', alt: 'My alt', link: 'https://example.com'},
                {labelVisibility: LabelVisibility.ALWAYS, selectable, lightbox: true},
            );
            testItem(
                item,
                {
                    warn: 0,
                    select: events,
                    root: {
                        tag: 'FIGURE',
                        ariaLabel: null,
                        tabindex: null,
                        href: null,
                        zoom: NO_EVENT,
                        activate: NO_EVENT,
                    },
                    image: {
                        ariaLabel: 'zoom',
                        alt: 'My alt',
                        tabindex: '0',
                        href: null,
                        zoom: ALL_EVENTS,
                        activate: NO_EVENT,
                    },
                    caption: {
                        ariaLabel: null,
                        text: 'My title',
                        tabindex: null,
                        href: null,
                        zoom: NO_EVENT,
                        activate: NO_EVENT,
                    },
                    link: {
                        ariaLabel: null,
                        text: 'My title',
                        tabindex: null,
                        href: 'https://example.com',
                        zoom: NO_EVENT,
                        activate: NO_EVENT,
                    },
                },
                consoleWarnSpy,
            );
        });

        it('should render link + caption + zoom + ignore identical alt' + suffix, () => {
            const item = createItem(
                mockDocument,
                {title: 'My title', alt: 'My title', link: 'https://example.com'},
                {labelVisibility: LabelVisibility.ALWAYS, selectable, lightbox: true},
            );
            testItem(
                item,
                {
                    warn: 0,
                    select: events,
                    root: {
                        tag: 'FIGURE',
                        ariaLabel: null,
                        tabindex: null,
                        href: null,
                        zoom: NO_EVENT,
                        activate: NO_EVENT,
                    },
                    image: {
                        ariaLabel: 'zoom',
                        alt: null,
                        tabindex: '0',
                        href: null,
                        zoom: ALL_EVENTS,
                        activate: NO_EVENT,
                    },
                    caption: {
                        ariaLabel: null,
                        text: 'My title',
                        tabindex: null,
                        href: null,
                        zoom: NO_EVENT,
                        activate: NO_EVENT,
                    },
                    link: {
                        ariaLabel: null,
                        text: 'My title',
                        tabindex: null,
                        href: 'https://example.com',
                        zoom: NO_EVENT,
                        activate: NO_EVENT,
                    },
                },
                consoleWarnSpy,
            );
        });

        /**
         * Activable
         */
        const activeLink: ElementExpectation = {
            tag: 'a',
            ariaLabel: 'activate item',
            text: 'My title',
            tabindex: '0',
            href: null,
            zoom: NO_EVENT,
            activate: ALL_EVENTS,
        };

        it('should render image with alt and activable' + suffix, () => {
            const item = createItem(mockDocument, {title: 'My title'}, {selectable, activable: true});
            testItem(
                item,
                {
                    warn: 0,
                    select: events,
                    root: {
                        tag: 'BUTTON',
                        ariaLabel: 'activate item',
                        tabindex: '0',
                        href: null,
                        zoom: NO_EVENT,
                        activate: ALL_EVENTS,
                    },
                    image: {
                        ariaLabel: null,
                        alt: 'My title',
                        tabindex: null,
                        href: null,
                        zoom: NO_EVENT,
                        activate: CLICK,
                    },
                    caption: null,
                    link: null,
                },
                consoleWarnSpy,
            );
        });

        it('should render caption + activable' + suffix, () => {
            const item = createItem(
                mockDocument,
                {title: 'My title'},
                {labelVisibility: LabelVisibility.ALWAYS, selectable, activable: true},
            );
            testItem(
                item,
                {
                    warn: 0,
                    select: events,
                    root: {
                        tag: 'FIGURE',
                        ariaLabel: null,
                        tabindex: null,
                        href: null,
                        zoom: NO_EVENT,
                        activate: NO_EVENT,
                    },
                    image: {ariaLabel: null, alt: null, tabindex: null, href: null, zoom: NO_EVENT, activate: NO_EVENT},
                    caption: {
                        ariaLabel: null,
                        text: 'My title',
                        tabindex: null,
                        href: null,
                        zoom: NO_EVENT,
                        activate: NO_EVENT,
                    },
                    link: {...activeLink, tag: 'BUTTON'},
                },
                consoleWarnSpy,
            );
        });

        it('should render caption + meaningful alt + activable' + suffix, () => {
            const item = createItem(
                mockDocument,
                {title: 'My title', alt: 'My alt'},
                {labelVisibility: LabelVisibility.ALWAYS, selectable, activable: true},
            );

            testItem(
                item,
                {
                    warn: 0,
                    select: events,
                    root: {
                        tag: 'FIGURE',
                        ariaLabel: null,
                        tabindex: null,
                        href: null,
                        zoom: NO_EVENT,
                        activate: NO_EVENT,
                    },
                    image: {
                        ariaLabel: null,
                        alt: 'My alt',
                        tabindex: null,
                        href: null,
                        zoom: NO_EVENT,
                        activate: NO_EVENT,
                    },
                    caption: {
                        ariaLabel: null,
                        text: 'My title',
                        tabindex: null,
                        href: null,
                        zoom: NO_EVENT,
                        activate: NO_EVENT,
                    },
                    link: {...activeLink, tag: 'BUTTON'},
                },
                consoleWarnSpy,
            );
        });

        it('should render caption + no identical alt + activable' + suffix, () => {
            const item = createItem(
                mockDocument,
                {title: 'My title', alt: 'My title'},
                {labelVisibility: LabelVisibility.ALWAYS, selectable, activable: true},
            );
            testItem(
                item,
                {
                    warn: 0,
                    select: events,
                    root: {
                        tag: 'FIGURE',
                        ariaLabel: null,
                        tabindex: null,
                        href: null,
                        zoom: NO_EVENT,
                        activate: NO_EVENT,
                    },
                    image: {ariaLabel: null, alt: null, tabindex: null, href: null, zoom: NO_EVENT, activate: NO_EVENT},
                    caption: {
                        ariaLabel: null,
                        text: 'My title',
                        tabindex: null,
                        href: null,
                        zoom: NO_EVENT,
                        activate: NO_EVENT,
                    },
                    link: {...activeLink, tag: 'BUTTON'},
                },
                consoleWarnSpy,
            );
        });

        it('should zoom, activable' + suffix, () => {
            const item = createItem(mockDocument, {title: 'My title'}, {selectable, activable: true, lightbox: true});
            testItem(
                item,
                {
                    warn: 1,
                    select: events,
                    root: {
                        tag: 'FIGURE',
                        ariaLabel: 'zoom',
                        tabindex: '0',
                        href: null,
                        zoom: ALL_EVENTS,
                        activate: NO_EVENT,
                    },
                    image: {
                        ariaLabel: null,
                        alt: 'My title',
                        tabindex: null,
                        href: null,
                        zoom: CLICK,
                        activate: NO_EVENT,
                    },
                    caption: null,
                    link: null,
                },
                consoleWarnSpy,
            );
        });

        it('should render caption + zoom, activable' + suffix, () => {
            const item = createItem(
                mockDocument,
                {title: 'My title'},
                {labelVisibility: LabelVisibility.ALWAYS, selectable, activable: true, lightbox: true},
            );
            testItem(
                item,
                {
                    warn: 0,
                    select: events,
                    root: {
                        tag: 'FIGURE',
                        ariaLabel: null,
                        tabindex: null,
                        href: null,
                        zoom: NO_EVENT,
                        activate: NO_EVENT,
                    },
                    image: {
                        ariaLabel: 'zoom',
                        alt: null,
                        tabindex: '0',
                        href: null,
                        zoom: ALL_EVENTS,
                        activate: NO_EVENT,
                    },
                    caption: {
                        ariaLabel: null,
                        text: 'My title',
                        tabindex: null,
                        href: null,
                        zoom: NO_EVENT,
                        activate: NO_EVENT,
                    },
                    link: {...activeLink, tag: 'BUTTON'},
                },
                consoleWarnSpy,
            );
        });

        it('should render caption + zoom + meaningful alt, activable' + suffix, () => {
            const item = createItem(
                mockDocument,
                {title: 'My title', alt: 'My alt'},
                {labelVisibility: LabelVisibility.ALWAYS, selectable, activable: true, lightbox: true},
            );
            testItem(
                item,
                {
                    warn: 0,
                    select: events,
                    root: {
                        tag: 'FIGURE',
                        ariaLabel: null,
                        tabindex: null,
                        href: null,
                        zoom: NO_EVENT,
                        activate: NO_EVENT,
                    },
                    image: {
                        ariaLabel: 'zoom',
                        alt: 'My alt',
                        tabindex: '0',
                        href: null,
                        zoom: ALL_EVENTS,
                        activate: NO_EVENT,
                    },
                    caption: {
                        ariaLabel: null,
                        text: 'My title',
                        tabindex: null,
                        href: null,
                        zoom: NO_EVENT,
                        activate: NO_EVENT,
                    },
                    link: {...activeLink, tag: 'BUTTON'},
                },
                consoleWarnSpy,
            );
        });

        it('should render caption + zoom + ignore identical alt, activable' + suffix, () => {
            const item = createItem(
                mockDocument,
                {title: 'My title', alt: 'My title'},
                {labelVisibility: LabelVisibility.ALWAYS, selectable, activable: true, lightbox: true},
            );
            testItem(
                item,
                {
                    warn: 0,
                    select: events,
                    root: {
                        tag: 'FIGURE',
                        ariaLabel: null,
                        tabindex: null,
                        href: null,
                        zoom: NO_EVENT,
                        activate: NO_EVENT,
                    },
                    image: {
                        ariaLabel: 'zoom',
                        alt: null,
                        tabindex: '0',
                        href: null,
                        zoom: ALL_EVENTS,
                        activate: NO_EVENT,
                    },
                    caption: {
                        ariaLabel: null,
                        text: 'My title',
                        tabindex: null,
                        href: null,
                        zoom: NO_EVENT,
                        activate: NO_EVENT,
                    },
                    link: {...activeLink, tag: 'BUTTON'},
                },
                consoleWarnSpy,
            );
        });

        it('should render ignored link + zoom + alt, activable' + suffix, () => {
            // Specific case, link is ignored
            const item = createItem(
                mockDocument,
                {alt: 'My alt', link: 'https://example.com'},
                {labelVisibility: LabelVisibility.ALWAYS, selectable, activable: true, lightbox: true},
            );
            testItem(
                item,
                {
                    warn: 1,
                    select: events,
                    root: {
                        tag: 'FIGURE',
                        ariaLabel: 'zoom',
                        tabindex: '0',
                        href: null,
                        zoom: ALL_EVENTS,
                        activate: NO_EVENT,
                    },
                    image: {
                        ariaLabel: null,
                        alt: 'My alt',
                        tabindex: null,
                        href: null,
                        zoom: CLICK,
                        activate: NO_EVENT,
                    },
                    caption: null,
                    link: null,
                },
                consoleWarnSpy,
            );
        });

        it('should render link + caption + zoom, activable' + suffix, () => {
            const item = createItem(
                mockDocument,
                {title: 'My title', link: 'https://example.com'},
                {labelVisibility: LabelVisibility.ALWAYS, selectable, activable: true, lightbox: true},
            );
            testItem(
                item,
                {
                    warn: 0,
                    select: events,
                    root: {
                        tag: 'FIGURE',
                        ariaLabel: null,
                        tabindex: null,
                        href: null,
                        zoom: NO_EVENT,
                        activate: NO_EVENT,
                    },
                    image: {
                        ariaLabel: 'zoom',
                        alt: null,
                        tabindex: '0',
                        href: null,
                        zoom: ALL_EVENTS,
                        activate: NO_EVENT,
                    },
                    caption: {
                        ariaLabel: null,
                        text: 'My title',
                        tabindex: null,
                        href: null,
                        zoom: NO_EVENT,
                        activate: NO_EVENT,
                    },
                    link: {
                        ariaLabel: null,
                        text: 'My title',
                        tabindex: null,
                        href: 'https://example.com',
                        zoom: NO_EVENT,
                        activate: NO_EVENT,
                    },
                },
                consoleWarnSpy,
            );
        });

        it('should render link + caption + zoom + meaningful alt, activable' + suffix, () => {
            const item = createItem(
                mockDocument,
                {title: 'My title', alt: 'My alt', link: 'https://example.com'},
                {labelVisibility: LabelVisibility.ALWAYS, selectable, activable: true, lightbox: true},
            );
            testItem(
                item,
                {
                    warn: 0,
                    select: events,
                    root: {
                        tag: 'FIGURE',
                        ariaLabel: null,
                        tabindex: null,
                        href: null,
                        zoom: NO_EVENT,
                        activate: NO_EVENT,
                    },
                    image: {
                        ariaLabel: 'zoom',
                        alt: 'My alt',
                        tabindex: '0',
                        href: null,
                        zoom: ALL_EVENTS,
                        activate: NO_EVENT,
                    },
                    caption: {
                        ariaLabel: null,
                        text: 'My title',
                        tabindex: null,
                        href: null,
                        zoom: NO_EVENT,
                        activate: NO_EVENT,
                    },
                    link: {
                        ariaLabel: null,
                        text: 'My title',
                        tabindex: null,
                        href: 'https://example.com',
                        zoom: NO_EVENT,
                        activate: NO_EVENT,
                    },
                },
                consoleWarnSpy,
            );
        });

        it('should render link + caption + zoom + ignore identical alt, activable' + suffix, () => {
            const item = createItem(
                mockDocument,
                {title: 'My title', alt: 'My title', link: 'https://example.com'},
                {labelVisibility: LabelVisibility.ALWAYS, selectable, activable: true, lightbox: true},
            );
            testItem(
                item,
                {
                    warn: 0,
                    select: events,
                    root: {
                        tag: 'FIGURE',
                        ariaLabel: null,
                        tabindex: null,
                        href: null,
                        zoom: NO_EVENT,
                        activate: NO_EVENT,
                    },
                    image: {
                        ariaLabel: 'zoom',
                        alt: null,
                        tabindex: '0',
                        href: null,
                        zoom: ALL_EVENTS,
                        activate: NO_EVENT,
                    },
                    caption: {
                        ariaLabel: null,
                        text: 'My title',
                        tabindex: null,
                        href: null,
                        zoom: NO_EVENT,
                        activate: NO_EVENT,
                    },
                    link: {
                        ariaLabel: null,
                        text: 'My title',
                        tabindex: null,
                        href: 'https://example.com',
                        zoom: NO_EVENT,
                        activate: NO_EVENT,
                    },
                },
                consoleWarnSpy,
            );
        });
    };

    testWithSelectable(false, null);
    testWithSelectable(true, ALL_EVENTS);
});
