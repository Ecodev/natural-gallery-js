import { Gallery } from './Gallery';
import { Utility } from './Utility';
import * as PhotoSwipe from 'photoswipe';
import * as PhotoSwipeUI_Default from 'photoswipe/dist/photoswipe-ui-default';

export interface IItemFields {
    id?: number;
    thumbnail: string;
    enlarged: string;
    title: string;
    description: string;
    link: string;
    linkTarget: string;
    tWidth: number;
    tHeight: number;
    eWidth: number;
    eHeight: number;
    last: boolean;
}

export interface IPhotoswipeItem {
    src: string;
    w: number;
    h: number;
    title: string;
}

export class Item {

    private _thumbnail: string;
    private _enlarged: string;
    private _title: string;
    private _description: string;
    private _link: string;
    private _linkTarget: string;
    private _last: boolean;
    private _row: number;
    private _binded: boolean = false;

    /**
     * Computed size (real used size)
     */
    private _width: number;
    private _height: number;

    /**
     * Thumbnail size
     */
    private _tWidth: number;
    private _tHeight: number;

    /**
     * Enlarged width
     */
    private _eWidth: number;
    private _eHeight: number;

    private selected = false;

    /**
     * Dom elements
     */
    private _element: HTMLElement;
    private _image: HTMLElement;
    private _selectBtn: HTMLElement;
    private _fields: IItemFields;

    /**
     * @param fields
     * @param gallery
     */
    public constructor(fields: IItemFields, private gallery: Gallery) {
        this._fields = fields;
        this.thumbnail = fields.thumbnail;
        this.enlarged = fields.enlarged;
        this.title = this.getTitle(fields);
        this.link = this.getLink(fields);
        this.linkTarget = this.getLinkTarget(fields);
        this.tWidth = fields.tWidth;
        this.tHeight = fields.tHeight;
        this.eWidth = fields.eWidth;
        this.eHeight = fields.eHeight;
        this.last = fields.last;
    }

    private getTitle(fields): string {

        if (!fields.title) {
            return null;
        }

        return this.getTitleDetails(fields.title).title;
    }

    private getLink(fields): string {

        if (fields.link) {
            return fields.link;
        }

        return this.getTitleDetails(fields.title).link;
    }

    private getLinkTarget(fields): string {

        if (fields.linkTarget) {
            return fields.linkTarget;
        }

        return this.getTitleDetails(fields.title).linkTarget;
    }

    private getTitleDetails(title) {

        let container = document.createElement('div');
        container.innerHTML = title;
        let links = container.getElementsByTagName('a');

        let details = {
            title: container.textContent,
            link: null,
            linkTarget: null,
        };

        if (links[0]) {
            details.link = links[0].getAttribute('href');
            details.linkTarget = links[0].getAttribute('target');
        }

        return details;
    }

    /**
     * Create DOM elements according to element raw data (thumbnail and enlarged urls)
     * Also apply border-radius at this level because it never changed threw time
     */
    public init() {

        let options = this.gallery.options;

        let label = null;
        const showLabelValues = [
            'true',
            'hover',
        ];
        if (this.title && showLabelValues.indexOf(options.showLabels) > -1) {
            label = true;
        }

        let element = document.createElement('div');
        let image = document.createElement('div');
        let link = this.getLinkElement();
        let zoomable = null;

        if (options.lightbox && label && link) {
            label = link;
            label.classList.add('button');
            zoomable = image;

        } else if (options.lightbox && label && !link) {
            label = document.createElement('div');
            zoomable = element;

        } else if (options.lightbox && !label) {
            // Actually, lightbox has priority on the link that is ignored...
            zoomable = element;

        } else if (!options.lightbox && label && link) {
            element = link;
            label = document.createElement('div');
            label.classList.add('button');

        } else if (!options.lightbox && label && !link) {
            label = document.createElement('div');

        } else if (!options.lightbox && !label && link) {
            element = link;
            // Pointer cursor is shown, but additionnal effect could be even better.
        }

        if (zoomable) {
            zoomable.classList.add('zoomable');
            if (options.zoomRotation) {
                zoomable.classList.add('rotation');
            }
        }

        image.classList.add('image');
        element.classList.add('figure', 'loading', 'visible');
        image.style.backgroundImage = 'url(' + this.thumbnail + ')';

        element.appendChild(image);

        if (options.round) {
            let radius = String(options.round + 'px');
            element.style.borderRadius = radius;
            image.style.borderRadius = radius;
        }

        this._element = element;
        this._image = image;

        if (label) {
            label.textContent = this.title;
            label.classList.add('title');
            if (options.showLabels === 'hover') {
                label.classList.add('hover');
            }
            element.appendChild(label);
        }

        if (this.gallery.options.selectable) {
            this._selectBtn = document.createElement('div');
            const icon = Utility.getIcon('icon-select');
            this._selectBtn.appendChild(icon);
            this._selectBtn.classList.add('selectBtn');
            icon.addEventListener('click', (e) => {
                e.stopPropagation();
                this.toggleSelect();
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
        this._element.style.marginBottom = String(this.gallery.options.margin + 'px');

        if (this.last) {
            this._element.style.marginRight = '0';
        } else {
            this._element.style.marginRight = String(this.gallery.options.margin + 'px');
        }
    }

    /**
     * This function prepare loaded/loading status and return root element.
     * @returns {HTMLElement}
     */
    public loadImage() {

        let img = document.createElement('img');
        img.setAttribute('src', this.thumbnail);

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
        if (this.selected) {
            this.unselect();
        } else {
            this.select();
        }
    }

    public select(notify: boolean = true) {
        this.selected = true;
        this._element.classList.add('selected');
        this.gallery.select(this, notify);
    }

    public unselect(notify: boolean = true) {
        this.selected = false;
        this._element.classList.remove('selected');
        this.gallery.unselect(this, notify);
    }

    private getLinkElement() {
        let link = null;

        if (this.link) {
            link = document.createElement('a');
            if (this.gallery.events.link) {
                link.addEventListener('click', (ev) => {
                    if (this.gallery.events.link.preventDefault) {
                        ev.preventDefault();
                    }
                    this.gallery.events.link.callback(this._fields);
                });
            } else {
                link.setAttribute('href', this.link);
                link.classList.add('link');
                if (this.linkTarget) {
                    link.setAttribute('target', this.linkTarget);
                }
            }
        }

        return link;
    }

    /**
     * Open photoswipe gallery on click
     * Add elements to gallery when navigating until last element
     * @param image
     * @param gallery
     */
    public bindClick() {

        if (!this.gallery.options.lightbox) {
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

        let self = this;

        if (!this.gallery.options.lightbox) {
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

        let pswp = new PhotoSwipe(this.gallery.pswpElement, PhotoSwipeUI_Default, this.gallery.photoswipeCollection, options);
        this.gallery.pswpApi = pswp;
        pswp.init();

        // Loading one more page when going to next image
        pswp.listen('beforeChange', (delta) => {
            // Positive delta means next slide.
            // If we go next slide, and current index is out of visible collection bound, load more items
            if (delta === 1 && pswp.getCurrentIndex() === this.gallery.visibleCollection.length) {
                self.gallery.addRows(1);
            }
        });

    }

    public getPhotoswipeItem(): IPhotoswipeItem {
        return {
            src: this._enlarged,
            w: this._eWidth,
            h: this._eHeight,
            title: this._title,
        };
    }

    public remove() {
        if (this._element.parentNode) {
            this._element.parentNode.removeChild(this._element);
        }
    }

    get thumbnail(): string {
        return this._thumbnail;
    }

    set thumbnail(value: string) {
        this._thumbnail = value;
    }

    get enlarged(): string {
        return this._enlarged;
    }

    set enlarged(value: string) {
        this._enlarged = value;
    }

    get title(): string {
        return this._title;
    }

    set title(value: string) {
        this._title = value;
    }

    get tWidth(): number {
        return this._tWidth;
    }

    set tWidth(value: number) {
        this._tWidth = value;
    }

    get tHeight(): number {
        return this._tHeight;
    }

    set tHeight(value: number) {
        this._tHeight = value;
    }

    get eWidth(): number {
        return this._eWidth;
    }

    set eWidth(value: number) {
        this._eWidth = value;
    }

    get eHeight(): number {
        return this._eHeight;
    }

    set eHeight(value: number) {
        this._eHeight = value;
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

    get description(): string {
        return this._description;
    }

    set description(value: string) {
        this._description = value;
    }

    get binded(): boolean {
        return this._binded;
    }

    set binded(value: boolean) {
        this._binded = value;
    }

    get link(): string {
        return this._link;
    }

    set link(value: string) {
        this._link = value;
    }

    get linkTarget(): string {
        return this._linkTarget;
    }

    set linkTarget(value: string) {
        this._linkTarget = value;
    }

    get fields(): IItemFields {
        return this._fields;
    }
}
