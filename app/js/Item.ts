module Natural.Gallery {

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
        categories?: any[];
    }

    export class Item {

        private _id: number;
        private _thumbnail: string;
        private _enlarged: string;
        private _title: string;
        private _description: string;
        private _link: string;
        private _linkTarget: string;
        private _last: boolean;
        private _categories: any[];
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

        /**
         * Dom elements
         */
        private element: HTMLElement;
        private image: HTMLElement;

        private _excluded: boolean = false;

        /**
         * @param fields
         * @param gallery
         */
        public constructor(private fields: IItemFields, private gallery: Gallery) {

            this.id = fields.id;
            this.thumbnail = fields.thumbnail;
            this.enlarged = fields.enlarged;
            this.title = this.getTitle(fields);
            this.link = this.getLink(fields);
            this.linkTarget = this.getLinkTarget(fields);
            this.tWidth = fields.tWidth;
            this.tHeight = fields.tHeight;
            this.eWidth = fields.eWidth;
            this.eHeight = fields.eHeight;
            this.categories = fields.categories;
            this.last = fields.last;

            this.createElement();
        }

        private getTitle(fields):string {

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
            let links = container.getElementsByTagName("a");

            let details =  {
                title: container.textContent,
                link: null,
                linkTarget: null
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
         * @param element
         * @param gallery
         * @returns {{figure: (*|HTMLElement), image: *}}
         */
        private createElement() {

            let self = this;
            let options = this.gallery.options;

            let label = null;
            if (this.title && ['true', 'hover'].indexOf(options.showLabels) > -1) {
                label = true;
            }

            let element = document.createElement('figure');
            let image = document.createElement('div');
            let link = this.getLinkElement();

            if (options.lightbox && label && link) {
                label = link;
                Utility.addClass(label, 'button');
                Utility.addClass(image, 'zoomable');

            } else if (options.lightbox && label && !link) {
                label = document.createElement('div');
                Utility.addClass(element, 'zoomable');

            } else if (options.lightbox && !label) {
                // Actually, lightbox has priority on the link that is ignored...
                Utility.addClass(element, 'zoomable');

            } else if (!options.lightbox && label && link) {
                element = link;
                label = document.createElement('div');

            } else if (!options.lightbox && label && !link) {
                label = document.createElement('div');

            } else if (!options.lightbox && !label && link) {
                element = link;
                // Pointer cursor is shown, but additionnal effect could be even better.

            } else if (!options.lightbox && !label && !link) {

            }

            Utility.addClass(image, 'image');
            Utility.addClass(element, 'figure loading visible');
            image.style.backgroundImage = 'url(' + this.thumbnail + ')';

            element.appendChild(image);

            if (options.round) {
                let radius = String(options.round + 'px');
                element.style.borderRadius = radius;
                image.style.borderRadius = radius;
            }

            this.element = element;
            this.image = image;

            if (label) {
                label.textContent = this.title;
                Utility.addClass(label, 'title');
                if (options.showLabels == 'hover') {
                    Utility.addClass(label, 'hover');
                }
                element.appendChild(label);
            }

            // let img = document.createElement('img');
            // img.setAttribute('data-id', this.id + '');
            // img.setAttribute('src', this.thumbnail);
            //
            // img.addEventListener('load', function() {
            //     Utility.toggleClass(self.element, 'loading');
            //     Utility.toggleClass(self.element, 'loaded');
            // });
            //
            // img.addEventListener('error', function() {
            //     self.excluded = true;
            //     self.gallery.refresh();
            // });
        }

        private getLinkElement() {
            let link = null;

            if (this.link) {
                link = document.createElement('a');
                link.setAttribute('href', this.link);
                Utility.addClass(link, 'link');
                if (this.linkTarget) {
                    link.setAttribute('target', this.linkTarget)
                }
            }

            return link;
        }

        /**
         * Use computed (organized) data to apply style (size and margin) to elements on DOM
         * Does not apply border-radius because is used to restyle data on browser resize, and border-radius don't change.
         * @param element
         * @param gallery
         */
        public style() {

            Utility.removeClass(this.element, 'visible');

            this.element.style.width = String(this.width + 'px');
            this.element.style.height = String(this.height + 'px');
            this.element.style.marginRight = String(this.gallery.options.margin + 'px');
            this.element.style.marginBottom = String(this.gallery.options.margin + 'px');

            if (this.last) {
                this.element.style.marginRight = '0';
            }

            this.image.style.width = String(this.width + 'px');
            this.image.style.height = String(this.height + 'px');

            let self = this;
            window.setTimeout(function() {
                Utility.addClass(self.element, 'visible');
            }, 0);
        }

        public flash() {
            let self = this;
            Utility.removeClass(this.element, 'visible');
            window.setTimeout(function() {
                Utility.addClass(self.element, 'visible');
            }, 0);
        }

        /**
         * Open photoswipe gallery on click
         * Add elements to gallery when navigating until last element
         * @param image
         * @param gallery
         */
        public bindClick() {

            if (!this.gallery.options.lightbox) {
                return
            }

            let self = this;

            // Avoid multiple bindings
            if (this.binded) {
                return;
            }

            this.binded = true;

            let openPhotoSwipe = function(e) {
              self.openPhotoSwipe.call(self, e, self.element);
            };

            let clickEl = null;

            if (this.link) {
                clickEl = this.image;
            } else {
                clickEl = this.element;
            }

            clickEl.addEventListener('click', openPhotoSwipe);
        }

        public openPhotoSwipe(e, el) {
            e.preventDefault();

            if (!this.gallery.options.lightbox) {
                return;
            }

            let nodeList = Array.prototype.slice.call((<HTMLElement> el.parentNode).children);
            let index = nodeList.indexOf(el) - 1;

            let options = {
                index: index,
                bgOpacity: 0.85,
                showHideOpacity: true,
                loop: false
            };

            let pswp = new PhotoSwipe(this.gallery.pswpElement, PhotoSwipeUI_Default, this.gallery.pswpContainer, options);
            this.gallery.pswpApi = pswp;
            pswp.init();

            let overrideLoop = null;

            // Loading one more page when going to next image
            pswp.listen('beforeChange', function(delta) {
                // Positive delta indicates "go to next" action, we don't load more objects on looping back the gallery (same logic when scrolling)
                if (delta > 0 && pswp.getCurrentIndex() == pswp.items.length - 1) {
                    this.gallery.addElements();
                } else if (delta === -1 * (pswp.items.length - 1)) {
                    overrideLoop = pswp.items.length;
                    this.gallery.addElements();
                }
            });

            // After change cannot detect if we are returning back from last to first
            pswp.listen('afterChange', function() {
                if (overrideLoop) {
                    pswp.goTo(overrideLoop);
                    overrideLoop = null;
                }
            });
        }

        public getPswpItem() {
            return {
                src: this._enlarged,
                w: this._eWidth,
                h: this._eHeight,
                title: this._title
            }
        }

        public getElement(): HTMLElement {
            return this.element;
        }

        /**
         * This function prepare loaded/loading status and return root element.
         * @returns {HTMLElement}
         */
        public loadElement(): HTMLElement {

            let self = this;
            let img = document.createElement('img');
            img.setAttribute('data-id', this.id + '');
            img.setAttribute('src', this.thumbnail);

            img.addEventListener('load', function() {
                Utility.removeClass(self.element, 'loading');
                Utility.addClass(self.element, 'loaded');
            });

            // Detect erorred images and hide them smartly
            // img.addEventListener('error', function() {
            //     self.excluded = true;
            //     self.gallery.refresh();
            // });

            return this.element;
        }



        get id(): number {
            return this._id;
        }

        set id(value: number) {
            this._id = value;
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

        get categories(): any[] {
            return this._categories;
        }

        set categories(value: any[]) {
            this._categories = value;
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

        get excluded(): boolean {
            return this._excluded;
        }

        set excluded(value: boolean) {
            this._excluded = value;
        }

    }
}
