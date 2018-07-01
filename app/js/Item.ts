import { Utility } from './Utility';
import { ItemOptions, ItemTitle, ModelAttributes, PhotoswipeItem } from './types';

export class Item<Model extends ModelAttributes = any> {

    /**
     * Cleaned title, used for label / button
     */
    private readonly title: string;

    private binded: boolean = false;

    /**
     * Actual row index in the list
     */
    private _row: number;

    /**
     * If is actually the last element of a row
     */
    private _last: boolean;

    /**
     * Computed size (real used size)
     */
    private _width: number;
    private _height: number;

    /**
     * Wherever item is selected or not
     * @type {boolean}
     * @private
     */
    private _selected = false;

    /**
     * Item root element reference (figure)
     */
    private _element: HTMLElement;

    /**
     * Image container reference (child div, containing the image)
     */
    private _image: HTMLElement;

    /**
     * Reference to the select button
     */
    private _selectBtn: HTMLElement;

    /**
     *
     * @param {ItemOptions} options
     * @param model Contains the source data given for an item (e.g object instance from database with id etc..)
     */
    public constructor(private readonly options: ItemOptions, public readonly model: Model) {
        this.title = this.getTitleDetails(model.title);
    }

    /**
     * Cleans html, and returns only the texte from all eventual tags
     * @param {string} term
     * @returns {ItemTitle}
     */
    private getTitleDetails(term: string): string {
        let container = document.createElement('div');
        container.innerHTML = term;
        return container.textContent;
    }

    /**
     * Create DOM elements according to element raw data (thumbnail and enlarged urls)
     * Also apply border-radius at this level because it never changed threw time
     */
    public init() {

        let label = null;
        const showLabelValues = [
            'true',
            'hover',
        ];
        if (this.title && showLabelValues.indexOf(this.options.showLabels) > -1) {
            label = true;
        }

        let element = document.createElement('div') as HTMLElement;
        let image = document.createElement('div') as HTMLElement;
        let link = this.getLinkElement();
        let zoomable = null;

        if (this.options.lightbox && label && link) {
            label = link;
            label.classList.add('button');
            zoomable = image;

        } else if (this.options.lightbox && label && !link) {
            label = document.createElement('div');
            zoomable = element;

        } else if (this.options.lightbox && !label) {
            // Actually, lightbox has priority on the link that is ignored...
            zoomable = element;

        } else if (!this.options.lightbox && label && link) {
            element = link;
            label = document.createElement('div');
            label.classList.add('button');

        } else if (!this.options.lightbox && label && !link) {
            label = document.createElement('div');

        } else if (!this.options.lightbox && !label && link) {
            element = link;
            // Pointer cursor is shown, but additionnal effect could be even better.
        }

        if (zoomable) {
            zoomable.classList.add('zoomable');
            if (this.options.zoomRotation) {
                zoomable.classList.add('rotation');
            }
        }

        image.classList.add('image');
        element.classList.add('figure', 'loading', 'visible');
        image.style.backgroundImage = 'url(' + this.model.thumbnailSrc + ')';

        element.appendChild(image);

        if (this.options.round) {
            let radius = String(this.options.round + 'px');
            element.style.borderRadius = radius;
            image.style.borderRadius = radius;
        }

        this._element = element;
        this._image = image;

        if (label) {
            label.textContent = this.title;
            label.classList.add('title');
            if (this.options.showLabels === 'hover') {
                label.classList.add('hover');
            }
            element.appendChild(label);
        }

        if (this.options.selectable) {
            this._selectBtn = document.createElement('div');
            const icon = Utility.getIcon('icon-select');
            this._selectBtn.appendChild(icon);
            this._selectBtn.classList.add('selectBtn');
            this._selectBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                this.toggleSelect();
                const event = new CustomEvent('onselect', {detail: this});
                this._element.dispatchEvent(event);
            });
            this._element.appendChild(this._selectBtn);
        }

        this.style();
        this.loadImage();
        this.bindClick();

        return element;
    }

    /**
     * Use computed (organized) data to apply style (size and margin) to elements on DOM
     * Does not apply border-radius because is used to restyle data on browser resize, and border-radius don't change.
     */
    public style() {

        if (!this._element) {
            return;
        }

        this._element.style.width = String(this.width + 'px');
        this._element.style.height = String(this.height + 'px');
        this._element.style.marginBottom = String(this.options.margin + 'px');

        if (this.last) {
            this._element.style.marginRight = '0';
        } else {
            this._element.style.marginRight = String(this.options.margin + 'px');
        }
    }

    /**
     * This function prepare loaded/loading status and return root element.
     * @returns {HTMLElement}
     */
    public loadImage() {

        let img = document.createElement('img');
        img.setAttribute('src', this.model.thumbnailSrc);

        img.addEventListener('load', () => {
            this._element.classList.remove('loading');
            this._element.classList.add('loaded');
        });

        // Detect errored images and hide them smartly
        img.addEventListener('error', () => {
            this._element.classList.add('errored');
        });
    }

    public toggleSelect() {
        if (this._selected) {
            this.unselect();
        } else {
            this.select();
        }
    }

    public select() {
        this._selected = true;
        this._element.classList.add('selected');
    }

    public unselect() {
        this._selected = false;
        this._element.classList.remove('selected');
    }

    private getLinkElement(): HTMLElement {
        let link = null;

        // if (this.link) {
        //     link = document.createElement('a');
        //     if (this.options.events.link) {
        //         link.addEventListener('click', (ev) => {
        //             if (this.options.events.link.preventDefault) {
        //                 ev.preventDefault();
        //             }
        //             this.options.events.link.callback(this._model);
        //         });
        //     } else {
        //         link.setAttribute('href', this.link);
        //         link.classList.add('link');
        //         if (this.linkTarget) {
        //             link.setAttribute('target', this.linkTarget);
        //         }
        //     }
        // }

        return link;
    }

    /**
     * Open photoswipe gallery on click
     * Add elements to gallery when navigating until last element
     * @param image
     * @param gallery
     */
    public bindClick() {

        if (!this.options.lightbox) {
            return;
        }

        const self = this;

        // Avoid multiple bindings
        if (this.binded) {
            return;
        }

        this.binded = true;

        let openPhotoSwipe = function(e) {
            self.openPhotoSwipe.call(self, e, self._element);
        };

        let clickEl = null;

        if (this.link) {
            clickEl = this._image;
        } else {
            clickEl = this._element;
        }

        clickEl.addEventListener('click', openPhotoSwipe);
    }

    public openPhotoSwipe(e, el) {
        e.preventDefault();

        if (!this.options.lightbox) {
            return;
        }

        let nodeList = Array.prototype.slice.call((<HTMLElement> el.parentNode).children);
        let index = nodeList.indexOf(el) - 1;

        let options = {
            index: index,
            bgOpacity: 0.85,
            showHideOpacity: true,
            loop: false,
        };

        // let pswp = new PhotoSwipe(this.options.pswpElement, PhotoSwipeUI_Default, this.options.photoswipeCollection, options);
        // this.options.pswpApi = pswp;

        // pswp.init();

        // Loading one more page when going to next image
        // pswp.listen('beforeChange', (delta) => {
        // Positive delta means next slide.
        // If we go next slide, and current index is out of visible collection bound, load more items
        // if (delta === 1 && pswp.getCurrentIndex() === this.options.visibleCollection.length) {
        //     this.options.addRows(1);
        // }
        // });

    }

    public getPhotoswipeItem(): PhotoswipeItem {
        return {
            src: this.model.enlargedSrc,
            w: this.model.enlargedWidth,
            h: this.model.enlargedHeight,
            title: this.title,
        };
    }

    public remove() {
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

    get thumbnailWidth(): number {
        return this.model.thumbnailWidth;
    }

    get thumbnailHeight(): number {
        return this.model.thumbnailHeight;
    }

    get selected(): boolean {
        return this._selected;
    }

    get element(): HTMLElement {
        return this._element;
    }

}
