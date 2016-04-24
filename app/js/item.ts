module Natural.Gallery {

    export interface IItemFields {
        id?: number;
        thumbnail: string;
        enlarged: string;
        title: string;
        description: string;
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
        private _last: boolean;
        private _categories: any[];
        private _row: number;

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
         * jquery
         */
        private element: JQuery;
        private image: JQuery;

        /**
         * @param fields
         */
        public constructor(private fields: IItemFields, private gallery: Gallery) {

            this.id = fields.id;
            this.thumbnail = fields.thumbnail;
            this.enlarged = fields.enlarged;
            this.title = fields.title;
            this.tWidth = fields.tWidth;
            this.tHeight = fields.tHeight;
            this.eWidth = fields.eWidth;
            this.eHeight = fields.eHeight;
            this.categories = fields.categories;
            this.last = fields.last;

            this.createElement();
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

            let $element = $('<figure></figure>').addClass('loading').addClass('visible');
            let $image = $('<a></a>').css('background-image', 'url(' + this.thumbnail + ')');

            var options = this.gallery.options;

            if (options.lightbox) {
                $image.attr('href', this.enlarged);
            }

            if (options.round) {
                $element.css('border-radius', options.round);
                $image.css('border-radius', options.round);
            }

            $element.append($image);

            if (this.title && (options.showLabels == 'true' || options.showLabels == 'hover')) {
                let $label = $('<span></span>').text(this.title);
                if (options.showLabels == 'hover') {
                    $label.addClass('hover');
                }

                $element.append($label);
            }

            this.element = $element;
            this.image = $image;

            $('<img />').data('id', this.id).attr('src', this.thumbnail).on('load', function() {
                self.element.toggleClass('loading loaded');
            });

            this.bindClick();
        }

        /**
         * Use computed (organized) data to apply style (size and margin) to elements on DOM
         * Does not apply border-radius because is used to restyle data on browser resize, and border-radius don't change.
         * @param element
         * @param gallery
         */
        public style() {

            this.element.removeClass('visible');

            this.element
                .css('width', this.width)
                .css('height', this.height)
                .css('margin-right', this.gallery.options.margin)
                .css('margin-bottom', this.gallery.options.margin);

            if (this.last) {
                this.element.css('margin-right', 0);
            }

            this.image
                .css('width', this.width)
                .css('height', this.height);

            let self = this;
            window.setTimeout(function() {
                self.element.addClass('visible');
            }, 0);
        }

        public flash() {
            let self = this;
            this.element.removeClass('visible');
            window.setTimeout(function() {
                self.element.addClass('visible');
            }, 0);
        }

        /**
         * Open photoswipe gallery on click
         * Add elements to gallery when navigating until last element
         * @param image
         * @param gallery
         */
        private bindClick() {

            let self = this;

            this.element.on('click', function(e) {
                e.preventDefault();

                if (!self.gallery.options.lightbox) {
                    return;
                }

                let options = {
                    index: $(this).index() - 1,
                    bgOpacity: 0.85,
                    showHideOpacity: true,
                    loop: false
                };

                let pswp = new PhotoSwipe(self.gallery.pswpElement, PhotoSwipeUI_Default, self.gallery.pswpContainer, options);
                self.gallery.pswpApi = pswp;
                pswp.init();

                let overrideLoop = null;

                // Loading one more page when going to next image
                pswp.listen('beforeChange', function(delta) {
                    // Positive delta indicates "go to next" action, we don't load more objects on looping back the gallery (same logic when scrolling)
                    if (delta > 0 && pswp.getCurrentIndex() == pswp.items.length - 1) {
                        self.gallery.addElements();
                    } else if (delta === -1 * (pswp.items.length - 1)) {
                        overrideLoop = pswp.items.length;
                        self.gallery.addElements();
                    }
                });

                // After change cannot detect if we are returning back from last to first
                pswp.listen('afterChange', function() {
                    if (overrideLoop) {
                        pswp.goTo(overrideLoop);
                        overrideLoop = null;
                    }
                });
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

        public getElement(): JQuery {
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

    }
}
