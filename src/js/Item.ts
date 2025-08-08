import {ModelAttributes} from './galleries/AbstractGallery';
import {sanitizeHtml} from './Utility';

export enum LabelVisibility {
    HOVER = 'hover',
    NEVER = 'never',
    ALWAYS = 'always',
}

export declare interface ItemOptions {
    /**
     * Enables ability to zoom images in photoswipe
     */
    lightbox?: boolean;

    /**
     * Add a checkbox to select image
     */
    selectable?: boolean;

    /**
     * Activable emits 'activate' event when link is not provided. It takes place where the link used to be :
     * in caption or in image if lightbox is false
     */
    activable?: boolean;
    gap?: number;
    labelVisibility?: LabelVisibility;
}

export type ItemActivateEventDetail<Model extends ModelAttributes> = {
    event: MouseEvent | KeyboardEvent;
    item: Item<Model>;
};

export class Item<Model extends ModelAttributes> {
    /**
     * Cleaned title, used for label / button
     */
    public readonly sanitizedTitle: string;
    /**
     * Reference to the select button
     */
    private _checkbox: HTMLButtonElement | null = null;
    /**
     * Element referring the "button" containing the label
     */
    private figcaption: HTMLElement | null = null;

    /**
     *
     * @param model Contains the source data given for an item (e.g. object instance from database with id etc...)
     */
    public constructor(
        private readonly document: Document,
        private readonly options: ItemOptions,
        public readonly model: Model,
    ) {
        this.sanitizedTitle = sanitizeHtml(model.title);
    }

    /**
     * Actual row index in the list
     */
    private _row!: number;

    get row(): number {
        return this._row;
    }

    set row(value: number) {
        this._row = value;
    }

    /**
     * Computed size (real used size)
     */
    private _width!: number;

    get width(): number {
        return this._width;
    }

    set width(value: number) {
        this._width = value;
    }

    private _height!: number;

    get height(): number {
        return this._height;
    }

    set height(value: number) {
        this._height = value;
    }

    private _cropped = true;

    /* istanbul ignore next */
    get cropped(): boolean {
        return this._cropped;
    }

    set cropped(value: boolean) {
        this._cropped = value;
    }

    /**
     * Wherever item is selected or not
     */
    private _selected = false;

    /* istanbul ignore next */
    get selected(): boolean {
        return this._selected;
    }

    /**
     * Item root element reference (figure)
     */
    private _rootElement: HTMLElement | null = null;

    /* istanbul ignore next */
    get rootElement(): HTMLElement | null {
        return this._rootElement;
    }

    /* istanbul ignore next */
    get checkbox(): HTMLButtonElement | null {
        return this._checkbox;
    }

    /* istanbul ignore next */
    get enlargedWidth(): number {
        return this.model.enlargedWidth;
    }

    /* istanbul ignore next */
    get enlargedHeight(): number {
        return this.model.enlargedHeight;
    }

    /**
     * Create DOM elements according to element raw data (thumbnail and enlarged urls)
     * Also apply border-radius at this level because it never changed threw time
     *
     *
     * Base structure is always the same :
     *
     * <figure>
     *     <img>
     *     <figcaption>
     * </figure>
     *
     * But depending on settings, we can add <a> inside <figcaption> or wrap around <figure>
     */
    public init(): HTMLElement {
        // Sources
        const figure = this.getFigure();
        const caption = this.getEmptyCaption();
        const image = this.getImage(!!caption);

        // Prepare contextual containers
        let root = null;
        const link = this.getEmptyLinkOrButton();
        let zoomableElement: HTMLElement | null = null;

        // Define and assign roles for each situation
        if (this.options.lightbox && caption && link) {
            root = figure;
            zoomableElement = image;
            link.innerHTML = this.sanitizedTitle;
            figure.appendChild(image);
            caption.appendChild(link);
            caption.classList.add('link');
        } else if (this.options.lightbox && caption && !link) {
            root = figure;
            caption.innerHTML = this.sanitizedTitle;
            figure.appendChild(image);
            zoomableElement = figure;
        } else if (this.options.lightbox && !caption && link) {
            root = figure;
            zoomableElement = figure;
            figure.appendChild(image);
            console.warn(
                'Link or activation are ignored when lightbox is true and there is no caption because there is no element to support it',
            );
        } else if (this.options.lightbox && !caption && !link) {
            root = figure;
            zoomableElement = figure;
            figure.appendChild(image);
        } else if (!this.options.lightbox && caption && link) {
            root = figure;
            figure.appendChild(image);
            caption.appendChild(link);
            caption.classList.add('link');
            link.innerHTML = this.sanitizedTitle;
        } else if (!this.options.lightbox && caption && !link) {
            root = figure;
            figure.appendChild(image);
            caption.innerHTML = this.sanitizedTitle;
        } else if (!this.options.lightbox && !caption && link) {
            root = link;
            figure.appendChild(image);
            link.appendChild(figure);
        } else if (!this.options.lightbox && !caption && !link) {
            root = figure;
            figure.appendChild(image);
        }

        this._rootElement = root || figure;
        this._rootElement.setAttribute('role', 'group');
        this._rootElement.classList.add('root');

        const checkbox = this.getCheckbox();
        [caption, checkbox].filter(c => !!c).forEach(c => figure.appendChild(c));
        this.handleZoom(zoomableElement);
        this.style();

        return this._rootElement;
    }

    public setLabelHover(activate: boolean): void {
        const className = 'hover';
        if (activate) {
            this.options.labelVisibility = LabelVisibility.HOVER;
            this.figcaption?.classList.add(className);
        } else {
            this.options.labelVisibility = LabelVisibility.ALWAYS;
            this.figcaption?.classList.remove(className);
        }
    }

    /**
     * Use computed (organized) data to apply style (size and margin) to elements on DOM
     * Does not apply border-radius because is used to restyle data on browser resize, and border-radius don't change.
     */
    public style(): void {
        if (!this._rootElement) {
            return;
        }

        this._rootElement.style.width = String(this.width + 'px');
        this._rootElement.style.height = String(this.height + 'px');
    }

    private emitSelectEvent(): void {
        const event = new CustomEvent<Item<Model>>('select', {detail: this});
        this._rootElement?.dispatchEvent(event);
    }

    public toggleSelect(): void {
        if (this._selected) {
            this.unselect();
        } else {
            this.select();
        }
    }

    private throwNotSelectableError(): void {
        if (!this.options.selectable) {
            throw Error('Gallery is not selectable');
        }
    }

    public select(): void {
        this.throwNotSelectableError();
        this._selected = true;
        this._rootElement?.classList.add('selected');
        this.updateAriaSelectedStatus();
        this.emitSelectEvent();
    }

    public unselect(): void {
        this.throwNotSelectableError();
        this._selected = false;
        this._rootElement?.classList.remove('selected');
        this.updateAriaSelectedStatus();
        this.emitSelectEvent();
    }

    public remove(): void {
        this._rootElement?.parentNode?.removeChild(this._rootElement);
    }

    private updateAriaSelectedStatus(): void {
        this._checkbox?.setAttribute('aria-checked', String(this._selected));
        this._checkbox?.setAttribute('aria-label', this._selected ? 'Unselect' : 'Select');
    }

    private getEmptyLinkOrButton(): HTMLElement | HTMLButtonElement | null {
        if (this.model.link) {
            const link = this.document.createElement('a');
            link.setAttribute('href', this.model.link);

            if (this.model.linkTarget) {
                link.setAttribute('target', this.model.linkTarget);
            }

            return link;
        } else if (this.options.activable) {
            const button = this.document.createElement('button');
            button.classList.add('activation');
            button.setAttribute('tabindex', '0');
            this.handleActivation(button);

            return button;
        }

        return null;
    }

    /**
     * Label is visible if options mention hover or always
     * @private
     */
    private showLabel(): boolean {
        let showLabel = false;

        const showLabelValues = [LabelVisibility.ALWAYS, LabelVisibility.HOVER];
        if (
            this.sanitizedTitle &&
            this.options.labelVisibility &&
            showLabelValues.includes(this.options.labelVisibility)
        ) {
            showLabel = true;
        }

        return showLabel;
    }

    private getFigure(): HTMLElement {
        const figure = this.document.createElement('figure');
        figure.classList.add('figure');
        figure.setAttribute('role', 'group');

        if (this.model.color) {
            figure.style.backgroundColor = this.model.color + '11';
        }

        return figure;
    }

    private getImage(hasCaption: boolean): HTMLImageElement {
        const image = this.document.createElement('img');
        image.setAttribute('src', this.model.thumbnailSrc);
        image.style.objectFit = this.model.objectFit || 'cover';
        image.style.objectPosition = this.model.objectPosition || 'center';
        image.classList.add('image');
        image.setAttribute('loading', 'lazy');
        image.addEventListener('load', () => this._rootElement?.classList.add('loaded'));

        // If alt is provided and different from title, set it on mage
        // If title, but no alt neither caption, set title as alt attribute on image
        if (this.model.alt && this.model.alt !== this.sanitizedTitle) {
            image.setAttribute('alt', this.model.alt);
        } else if (!hasCaption && this.sanitizedTitle) {
            image.setAttribute('alt', this.sanitizedTitle);
        }

        return image;
    }

    private getEmptyCaption(): HTMLElement | null {
        if (!this.showLabel()) {
            return null;
        }

        const caption = this.document.createElement('figcaption');
        caption.classList.add('caption');
        caption.classList.add('title');

        if (this.options.labelVisibility === LabelVisibility.HOVER) {
            caption.classList.add('hover');
        }

        this.figcaption = caption;
        return caption;
    }

    private getCheckbox(): HTMLButtonElement | null {
        if (!this.options.selectable) {
            return null;
        }

        const checkbox = this.document.createElement('button') as HTMLButtonElement;
        checkbox.tabIndex = 0;
        checkbox.classList.add('select-btn');
        checkbox.setAttribute('role', 'checkbox');

        const marker = this.document.createElement('div');
        marker.classList.add('marker');
        checkbox.appendChild(marker);

        const handleCheckboxAction = (e: Event) => {
            e.stopPropagation();
            e.preventDefault();
            this.toggleSelect();
        };

        checkbox.addEventListener('click', handleCheckboxAction);
        checkbox.addEventListener('keydown', e => {
            if (e.key === 'Enter' || e.key === ' ') {
                handleCheckboxAction(e);
            }
        });
        this._checkbox = checkbox;
        this.updateAriaSelectedStatus();

        if (this.model.selected) {
            this.select();
        } else {
            this.unselect();
        }

        return checkbox;
    }

    private handleActivation(element: HTMLElement): void {
        element.setAttribute('aria-label', 'activate item');
        const activate = (ev: MouseEvent | KeyboardEvent) => {
            const data: ItemActivateEventDetail<Model> = {item: this, event: ev};
            const activableEvent = new CustomEvent<ItemActivateEventDetail<Model>>('activate', {detail: data});
            this._rootElement?.dispatchEvent(activableEvent);
        };
        element.addEventListener('click', activate);
        element.addEventListener('keydown', e => {
            if (e.key === 'Enter' || e.key === ' ') {
                activate(e);
            }
        });
    }

    private handleZoom(element: HTMLElement | null): void {
        if (!element) {
            return;
        }

        if (element) {
            element.tabIndex = 0;
            element.setAttribute('aria-label', 'zoom');
            element.setAttribute('role', 'button');
            element.classList.add('zoomable');
            const handleZoom = () => {
                const event = new CustomEvent<Item<Model>>('zoom', {detail: this});
                this._rootElement?.dispatchEvent(event);
            };

            element.addEventListener('click', handleZoom);
            element.addEventListener('keydown', e => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    handleZoom();
                }
            });
        }
    }
}
