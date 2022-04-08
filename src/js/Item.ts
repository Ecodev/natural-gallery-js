import {ModelAttributes} from './galleries/AbstractGallery';
import {getIcon} from './Utility';

export declare interface ItemOptions {
    lightbox?: boolean;
    selectable?: boolean;
    activable?: boolean;
    gap?: number;
    showLabels?: 'hover' | 'never' | 'always';
}

export interface ItemTitle {
    title: string;
    link: string;
    linkTarget: '_blank' | '_self' | '_parent' | '_top';
}

export type ItemActivateEventDetail<Model extends ModelAttributes> = {
    clickEvent: MouseEvent;
    item: Item<Model>
};

export class Item<Model extends ModelAttributes> {

    /**
     * Cleaned title, used for label / button
     */
    public readonly title: string;

    /**
     * Actual row index in the list
     */
    private _row!: number;

    /**
     * If is actually the last element of a row
     */
    private _last!: boolean;

    /**
     * Computed size (real used size)
     */
    private _width!: number;
    private _height!: number;

    /**
     * Wherever item is selected or not
     * @type {boolean}
     * @private
     */
    private _selected = false;

    /**
     * Item root element reference (figure)
     */
    private _element!: HTMLElement;

    /**
     * Image container reference (child div, containing the image)
     */
    private _image!: HTMLElement;

    /**
     * Reference to the select button
     */
    private _selectBtn!: HTMLElement;

    /**
     *
     * @param {ItemOptions} options
     * @param model Contains the source data given for an item (e.g object instance from database with id etc..)
     */
    public constructor(
        private readonly document: Document,
        private readonly options: ItemOptions,
        public readonly model: Model,
    ) {
        this.title = this.getTitleDetails(model.title);
    }

    /**
     * Cleans html, and returns only the text from all eventual tags
     * @param {string} term
     * @returns {ItemTitle}
     */
    private getTitleDetails(term: string | undefined): string {
        return term ? term.replace(/<(?!\s*br\s*\/?)[^>]+>/gi, '') : '';
    }

    /**
     * Create DOM elements according to element raw data (thumbnail and enlarged urls)
     * Also apply border-radius at this level because it never changed threw time
     */
    public init(): HTMLElement {
        let showLabel = false;
        let label: HTMLElement | null = null;

        // Test if label should be added to dom
        const showLabelValues = ['always', 'hover'];
        if (this.title && this.options.showLabels && showLabelValues.includes(this.options.showLabels)) {
            showLabel = true;
        }

        const element = this.document.createElement('div') as HTMLElement;
        let image: HTMLElement = this.document.createElement('a');
        const link = this.getLinkElement();
        let zoomable: HTMLElement | null = null;

        // Activation is listened on label/button or on whole image if lightbox is off.
        // If label is not a button, it becomes a button
        let activable: HTMLElement | null = null;

        if (this.options.lightbox && showLabel && link) {
            label = link;
            label.classList.add('button');
            zoomable = image;
            activable = link;

        } else if (this.options.lightbox && showLabel && !link) {
            label = this.document.createElement('div');

            if (this.options.activable) {
                activable = label;
                label.classList.add('button');
                zoomable = image;
            } else {
                zoomable = element;
            }

        } else if (this.options.lightbox && !showLabel) {
            // Actually, lightbox has priority on the link that is ignored...
            zoomable = element;

            // May be dangerous to consider image as activation, because opening the lightbox is already an action and we could have two...
            // It's ok if activate event is used for tracking, but not if it's used to do an action.
            // In the doubt, for now it's not allowed
            // activable = element;

        } else if (!this.options.lightbox && showLabel && link) {
            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
            image = this.getLinkElement()!;
            label = link;
            label.classList.add('button');
            activable = element;

        } else if (!this.options.lightbox && showLabel && !link) {
            label = this.document.createElement('div');
            if (this.options.activable) {
                activable = element;
                label.classList.add('button');
            }

        } else if (!this.options.lightbox && !showLabel && link) {
            image = link;
            activable = link;
        }

        if (zoomable) {
            zoomable.classList.add('zoomable');

            zoomable.addEventListener('click', () => {
                const event = new CustomEvent<Item<Model>>('zoom', {detail: this});
                this._element.dispatchEvent(event);
            });
        }

        if (activable) {
            activable.classList.add('activable');
            activable.addEventListener('click', (ev) => {
                const data: ItemActivateEventDetail<Model> = {
                    item: this,
                    clickEvent: ev,
                };
                const activableEvent = new CustomEvent<ItemActivateEventDetail<Model>>('activate', {detail: data});
                this._element.dispatchEvent(activableEvent);
            });
        }

        image.style.backgroundSize = this.model.backgroundSize || 'cover';
        image.style.backgroundPosition = this.model.backgroundPosition || 'center';

        image.setAttribute('data-pswp-width', "" + this.model.enlargedWidth);
        image.setAttribute('data-pswp-height', "" + this.model.enlargedHeight);

        if (this.model.enlargedSrc)
            image.setAttribute('data-pswp-src', this.model.enlargedSrc);

        image.classList.add('image');
        element.classList.add('figure');
        element.appendChild(image);

        if (this.model.color) {
            element.style.backgroundColor = this.model.color + '11';
        }

        this._element = element;
        this._image = image;

        if (label) {
            label.innerHTML = this.title;
            label.classList.add('title');
            if (this.options.showLabels === 'hover') {
                label.classList.add('hover');
            }
            element.appendChild(label);
        }

        if (this.options.selectable) {
            if (this.model.selected) {
                this.select();
            }
            this._selectBtn = this.document.createElement('div');
            this._selectBtn.appendChild(getIcon(this.document, 'natural-gallery-icon-select'));
            this._selectBtn.classList.add('selectBtn');
            this._selectBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                this.toggleSelect();
                const event = new CustomEvent<Item<Model>>('select', {detail: this});
                this._element.dispatchEvent(event);
            });
            this._element.appendChild(this._selectBtn);
        }

        this.style();

        return element;
    }

    /**
     * Use computed (organized) data to apply style (size and margin) to elements on DOM
     * Does not apply border-radius because is used to restyle data on browser resize, and border-radius don't change.
     */
    public style(): void {

        if (!this._element) {
            return;
        }

        this._element.style.width = String(this.width + 'px');
        this._element.style.height = String(this.height + 'px');
        this._element.style.marginBottom = String(this.options.gap + 'px');

        if (this.last) {
            this._element.style.marginRight = '0';
        } else {
            this._element.style.marginRight = String(this.options.gap + 'px');
        }
    }

    /**
     * This function prepare loaded/loading status and return root element.
     * @returns {HTMLElement}
     */
    public loadImage(): void {

        const img = this.document.createElement('img');
        img.setAttribute('src', this.model.thumbnailSrc);

        this._image.appendChild(img);

        img.addEventListener('load', () => {
            this._element.classList.add('loaded');
        });

        // Detect errored images and hide them smartly
        img.addEventListener('error', () => {
            this._element.classList.add('errored');
        });
    }

    public toggleSelect(): void {
        if (this._selected) {
            this.unselect();
        } else {
            this.select();
        }
    }

    public select(): void {
        this._selected = true;
        this._element.classList.add('selected');
    }

    public unselect(): void {
        this._selected = false;
        this._element.classList.remove('selected');
    }

    private getLinkElement(): HTMLElement | null {

        if (this.model.link) {
            const link = this.document.createElement('a');
            link.setAttribute('href', this.model.link);
            link.classList.add('link');
            if (this.model.linkTarget) {
                link.setAttribute('target', this.model.linkTarget);
            }

            return link;
        }

        return null;
    }

    public remove(): void {
        if (this._element.parentNode) {
            this._element.parentNode.removeChild(this._element);
        }
    }

    get last(): boolean {
        return this._last;
    }

    set last(value: boolean) {
        this._last = value;
    }

    get row(): number {
        return this._row;
    }

    set row(value: number) {
        this._row = value;
    }

    get height(): number {
        return this._height;
    }

    set height(value: number) {
        this._height = value;
    }

    get width(): number {
        return this._width;
    }

    set width(value: number) {
        this._width = value;
    }

    get enlargedWidth(): number {
        return this.model.enlargedWidth;
    }

    get enlargedHeight(): number {
        return this.model.enlargedHeight;
    }

    get selected(): boolean {
        return this._selected;
    }

    get element(): HTMLElement {
        return this._element;
    }

}
