import {ModelAttributes} from './galleries/AbstractGallery';
import {sanitizeHtml} from './Utility';

export declare interface ItemOptions {
    lightbox?: boolean;
    selectable?: boolean;
    activable?: boolean;
    gap?: number;
    showLabels?: 'hover' | 'never' | 'always';
}

export type ItemActivateEventDetail<Model extends ModelAttributes> = {
    clickEvent: MouseEvent;
    item: Item<Model>;
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

    private _cropped = true;

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
    private _selectBtn!: HTMLButtonElement;

    /**
     * Element referering the "button" containing the label
     */
    private label: HTMLElement | null = null;

    /**
     *
     * @param model Contains the source data given for an item (e.g object instance from database with id etc..)
     */
    public constructor(
        private readonly document: Document,
        private readonly options: ItemOptions,
        public readonly model: Model,
    ) {
        this.title = sanitizeHtml(model.title);
    }

    /**
     * Create DOM elements according to element raw data (thumbnail and enlarged urls)
     * Also apply border-radius at this level because it never changed threw time
     */
    public init(): HTMLElement {
        let showLabel = false;
        const showLabelValues = ['always', 'hover'];
        if (this.title && this.options.showLabels && showLabelValues.includes(this.options.showLabels)) {
            showLabel = true;
        }

        // Use <figure> as the root
        const element = this.document.createElement('figure');
        element.classList.add('figure');
        element.setAttribute('role', 'group');

        // Create <img>
        const image = this.document.createElement('img');
        // Accessibility logic for alt/caption
        const hasTitle = !!this.model.title;
        const hasCaption = !!this.model.caption;
        let altText = '';
        if (hasTitle) {
            altText = this.model.title ?? '';
        }

        image.alt = altText;
        image.classList.add('image');
        image.style.backgroundSize = this.model.backgroundSize || 'cover';
        image.style.backgroundPosition = this.model.backgroundPosition || 'center';

        // If model.link is present, wrap <img> in <a>
        let imageContainer: HTMLElement = image;
        let interactiveTarget: HTMLElement = image; // Default interactive target is the image
        if (this.model.link) {
            const link = this.document.createElement('a');
            link.setAttribute('href', this.model.link);
            link.classList.add('link');
            if (this.model.linkTarget) {
                link.setAttribute('target', this.model.linkTarget);
            }
            link.appendChild(image);
            imageContainer = link;
            interactiveTarget = link; // If link is present, interactive target is the link
        }

        // Add zoomable/activable classes and handlers (unchanged)
        if (this.options.lightbox) {
            interactiveTarget.classList.add('zoomable');
            interactiveTarget.tabIndex = 0;
            interactiveTarget.addEventListener('click', (e) => {
                const event = new CustomEvent<Item<Model>>('zoom', {detail: this});
                this._element.dispatchEvent(event);
            });
            interactiveTarget.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    interactiveTarget.click();
                }
            });
        }
        if (this.options.activable) {
            interactiveTarget.classList.add('activable');
            interactiveTarget.tabIndex = 0;
            interactiveTarget.setAttribute('role', 'button');
            interactiveTarget.setAttribute('aria-label', this.title);
            interactiveTarget.addEventListener('click', (ev) => {
                const data: ItemActivateEventDetail<Model> = {
                    item: this,
                    clickEvent: ev,
                };
                const activableEvent = new CustomEvent<ItemActivateEventDetail<Model>>('activate', {detail: data});
                this._element.dispatchEvent(activableEvent);
            });
            interactiveTarget.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    interactiveTarget.click();
                }
            });
        }

        element.appendChild(imageContainer);

        // Only add <figcaption> if BOTH title and caption exist
        if (hasTitle && hasCaption) {
            const figcaption = this.document.createElement('figcaption');
            figcaption.textContent = this.model.caption ?? null;
            figcaption.classList.add('caption');
            element.appendChild(figcaption);
        }

        // Add label if needed (unchanged)
        if (showLabel) {
            this.label = this.document.createElement('div');
            this.label.innerHTML = this.title;
            this.label.classList.add('title');
            if (this.options.showLabels === 'hover') {
                this.label.classList.add('hover');
            }
            element.appendChild(this.label);
        }

        // Select button (unchanged)
        if (this.options.selectable) {
            if (this.model.selected) {
                this.select();
            }
            this._selectBtn = this.document.createElement('button') as HTMLButtonElement;
            this._selectBtn.classList.add('selectBtn');
            this._selectBtn.setAttribute('aria-pressed', String(this._selected));
            this._selectBtn.setAttribute('aria-label', 'Select image');
            this._selectBtn.type = 'button';
            const marker = this.document.createElement('div');
            marker.classList.add('marker');
            this._selectBtn.appendChild(marker);
            this._selectBtn.addEventListener('click', e => {
                e.stopPropagation();
                this.toggleSelect();
                this._selectBtn.setAttribute('aria-pressed', String(this._selected));
                const event = new CustomEvent<Item<Model>>('select', {detail: this});
                this._element.dispatchEvent(event);
            });
            element.appendChild(this._selectBtn);
        }

        if (this.model.color) {
            element.style.backgroundColor = this.model.color + '11';
        }

        this._element = element;
        this._image = image;

        this.style();

        return element;
    }

    public setLabelHover(activate: boolean): void {
        if (activate) {
            this.options.showLabels = 'hover';
            this.label?.classList.add('hover');
        } else {
            this.options.showLabels = 'always';
            this.label?.classList.remove('hover');
        }
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
        this._image.setAttribute('src', this.model.thumbnailSrc);
        const altText = this.model.title || '';
        this._image.setAttribute('alt', altText);

        this._image.addEventListener('load', () => {
            this._element.classList.add('loaded');
        });

        // Detect errored images and hide them smartly
        this._image.addEventListener('error', () => {
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

    get cropped(): boolean {
        return this._cropped;
    }

    set cropped(value: boolean) {
        this._cropped = value;
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
