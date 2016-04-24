var Natural;
(function (Natural) {
    var Gallery;
    (function (Gallery) {
        var Controller = (function () {
            /**
             * Bootstrap galleries
             * For each gallery in the page, set a body container (dom element) and compute images sizes, then add elements to dom container
             */
            function Controller() {
                /**
                 * Used to test the scroll direction
                 * Avoid to load more images when scrolling up in the detection zone
                 * @type {number}
                 */
                this.old_scroll_top = 0;
                var pswp = $('.pswp')[0];
                _.each(naturalGalleries, function (gallery, i) {
                    naturalGalleries[i] = new Gallery.Gallery(i, gallery.options, pswp);
                    if (!_.isEmpty(gallery.images)) {
                        naturalGalleries[i].collection = gallery.images;
                    }
                });
                this.bindEvents();
            }
            /**
             * Check whetever we need to resize a gallery (only if parent container width changes)
             */
            Controller.prototype.resize = function () {
                _.each(naturalGalleries, function (gallery) {
                    gallery.resize();
                });
            };
            /**
             * Bind generic events that are valid for all galleries like window scroll and resize
             */
            Controller.prototype.bindEvents = function () {
                var self = this;
                // When browser size change
                $(window).on('resize', function () {
                    self.resize();
                });
                // On windows scrollbar (dis)appear
                Gallery.Utility.addScrollResizeEvent();
                $(window).on('scrollbar', function () {
                    self.resize();
                });
                /**
                 * Scroll
                 * Load new images when scrolling down
                 * Allow scroll if there is only a single gallery on page and no limit specified
                 * If the limit is specified, the gallery switch to manual mode.
                 */
                if (naturalGalleries.length == 1 && naturalGalleries[0].options.limit === 0) {
                    $(document).on('scroll', function () {
                        var gallery = naturalGalleries[0];
                        var endOfGalleryAt = gallery.rootElement.offset().top + gallery.rootElement.height() + 60;
                        // Avoid to expand gallery if we are scrolling up
                        var current_scroll_top = $(document).scrollTop();
                        var window_size = $(window).height(); //document.body.clientHeight;
                        var scroll_delta = current_scroll_top - self.old_scroll_top;
                        self.old_scroll_top = current_scroll_top;
                        // "enableMoreLoading" is a setting coming from the BE bloking / enabling dynamic loading of thumbnail
                        if (scroll_delta > 0 && current_scroll_top + window_size > endOfGalleryAt) {
                            // When scrolling only add a row at once
                            naturalGalleries[0].addElements(1);
                        }
                    });
                }
            };
            return Controller;
        }());
        Gallery.Controller = Controller;
    })(Gallery = Natural.Gallery || (Natural.Gallery = {}));
})(Natural || (Natural = {}));
var Natural;
(function (Natural) {
    var Gallery;
    (function (Gallery_1) {
        var Gallery = (function () {
            /**
             * Search and Categories filters
             * @type {null}
             */
            //private filter: Filter = null;
            /**
             * Initiate gallery
             * @param position
             * @param options
             */
            function Gallery(position, options, pswp) {
                /**
                 * Default options
                 */
                this._options = {
                    rowHeight: 350,
                    format: 'natural',
                    round: 3,
                    imagesPerRow: 4,
                    margin: 5,
                    limit: 0,
                    showLabels: 'hover',
                    lightbox: true,
                    minRowsAtStart: 2
                };
                /**
                 * Photoswipe images container
                 * @type {Array}
                 */
                this._pswpContainer = [];
                /**
                 * Complete collection of images
                 * @type {Array}
                 */
                this._collection = [];
                this.pswpElement = pswp;
                this._options = _.defaults(options, this._options);
                this.position = position;
                this.rootElement = $($('.natural-gallery').get(this.position));
                this.initLayout();
            }
            Gallery.prototype.initLayout = function () {
                var self = this;
                var noResults = $('<div></div>').addClass('natural-gallery-noresults').append(Gallery_1.Utility.getIcon('icon-noresults'));
                var nextButton = $('<div></div>').addClass('natural-gallery-next').append(Gallery_1.Utility.getIcon('icon-next')).on('click', function (e) {
                    e.preventDefault();
                    self.addElements();
                });
                this.bodyElement = $('<div></div>').addClass('natural-gallery-body').append(noResults);
                this.rootElement
                    .append(this.bodyElement)
                    .append(nextButton);
                this.bodyWidth = Math.floor(this.bodyElement[0].getBoundingClientRect().width);
            };
            /**
             * Initialize items
             * @param items
             */
            Gallery.prototype.appendItems = function (items) {
                var self = this;
                var display = false;
                // if first addition of items, add them to container for display
                if (this.collection.length === 0) {
                    display = true;
                }
                // Complete collection
                _.each(items, function (item) {
                    self.collection.push(new Gallery_1.Item(item, self));
                });
                // Compute sizes
                Gallery_1.Organizer.organize(this);
                if (display) {
                    this.addElements();
                }
            };
            Gallery.prototype.style = function () {
                _.each(this.collection, function (item) {
                    item.style();
                });
            };
            /**
             * Add a number of rows to DOM container, and to Photoswipe gallery.
             * If rows are not given, is uses backoffice data or compute according to browser size
             * @param gallery target
             * @param rows
             */
            Gallery.prototype.addElements = function (rows) {
                if (rows === void 0) { rows = null; }
                var collection = this.collection;
                var nextButton = this.rootElement.find('.natural-gallery-next');
                nextButton.show(); // display because filters may add more images and we have to show it again
                if (this.pswpContainer.length === collection.length || !collection.length) {
                    nextButton.hide();
                    return;
                }
                if (!rows) {
                    rows = this.getRowsPerPage(this);
                }
                var nextImage = this.pswpContainer.length;
                var lastRow = this.pswpContainer.length ? collection[nextImage].row + rows : rows;
                // Select next elements, comparing their rows
                for (var i = nextImage; i < collection.length; i++) {
                    var item = collection[i];
                    if (item.row < lastRow) {
                        this.pswpContainer.push(item.getPswpItem());
                        this.bodyElement.append(item.getElement());
                        item.flash();
                    }
                    // Show / Hide "more" button.
                    if (this.pswpContainer.length === collection.length) {
                        nextButton.hide();
                    }
                }
                this.rootElement.find('.natural-gallery-noresults').hide();
                this.rootElement.find('.natural-gallery-visible').text(this.pswpContainer.length);
                this.rootElement.find('.natural-gallery-total').text(collection.length);
            };
            /**
             * Return number of rows to show per page,
             * If a number of rows are specified in the backoffice, this data is used.
             * If not specified, uses the vertical available space to compute the number of rows to display.
             * There is a letiable in the header of this file to specify the  minimum number of rows for the computation (minNumberOfRowsAtStart)
             * @param gallery
             * @returns {*}
             */
            Gallery.prototype.getRowsPerPage = function (gallery) {
                if (this.options.limit) {
                    return this.options.limit;
                }
                var winHeight = $(window).height();
                var galleryVisibleHeight = winHeight - gallery.bodyElement.offset().top;
                var nbRows = Math.floor(galleryVisibleHeight / (this.options.rowHeight * 0.7)); // ratio to be more close from reality average row height
                return nbRows < this.options.minRowsAtStart ? this.options.minRowsAtStart : nbRows;
            };
            /**
             * Check whetever we need to resize a gallery (only if parent container width changes)
             * The keep full rows, it recomputes sizes with new dimension, and reset everything, then add the same number of row. It results in not partial row.
             */
            Gallery.prototype.resize = function () {
                var containerWidth = Math.floor(this.bodyElement[0].getBoundingClientRect().width);
                if (containerWidth != this.bodyWidth) {
                    this.bodyWidth = containerWidth;
                    Gallery_1.Organizer.organize(this);
                    var nbRows = this.collection[this.pswpContainer.length - 1].row + 1;
                    this.reset();
                    this.addElements(nbRows);
                }
            };
            /**
             * Empty DOM container and Photoswipe container
             * @param gallery
             */
            Gallery.prototype.reset = function () {
                this.pswpContainer = [];
                this.bodyElement.find('figure').remove();
                this.rootElement.find('.natural-gallery-noresults').show();
            };
            Object.defineProperty(Gallery.prototype, "pswpContainer", {
                get: function () {
                    return this._pswpContainer;
                },
                set: function (value) {
                    this._pswpContainer = value;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Gallery.prototype, "collection", {
                get: function () {
                    return this._collection; //this.filter.isFiltered() ? this.filter.getCollection() : this.collection;
                },
                set: function (items) {
                    this._collection = [];
                    this.appendItems(items);
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Gallery.prototype, "bodyWidth", {
                get: function () {
                    return this._bodyWidth;
                },
                set: function (value) {
                    this._bodyWidth = value;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Gallery.prototype, "bodyElement", {
                get: function () {
                    return this._bodyElement;
                },
                set: function (value) {
                    this._bodyElement = value;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Gallery.prototype, "rootElement", {
                get: function () {
                    return this._rootElement;
                },
                set: function (value) {
                    this._rootElement = value;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Gallery.prototype, "pswpApi", {
                get: function () {
                    return this._pswpApi;
                },
                set: function (value) {
                    this._pswpApi = value;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Gallery.prototype, "pswpElement", {
                get: function () {
                    return this._pswpElement;
                },
                set: function (value) {
                    this._pswpElement = value;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Gallery.prototype, "options", {
                get: function () {
                    return this._options;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Gallery.prototype, "position", {
                get: function () {
                    return this._position;
                },
                set: function (value) {
                    this._position = value;
                },
                enumerable: true,
                configurable: true
            });
            return Gallery;
        }());
        Gallery_1.Gallery = Gallery;
    })(Gallery = Natural.Gallery || (Natural.Gallery = {}));
})(Natural || (Natural = {}));
var Natural;
(function (Natural) {
    var Gallery;
    (function (Gallery) {
        var Item = (function () {
            /**
             * @param fields
             */
            function Item(fields, gallery) {
                this.fields = fields;
                this.gallery = gallery;
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
            Item.prototype.createElement = function () {
                var self = this;
                var $element = $('<figure></figure>').addClass('loading').addClass('visible');
                var $image = $('<a></a>').css('background-image', 'url(' + this.thumbnail + ')');
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
                    var $label = $('<span></span>').text(this.title);
                    if (options.showLabels == 'hover') {
                        $label.addClass('hover');
                    }
                    $element.append($label);
                }
                this.element = $element;
                this.image = $image;
                $('<img />').data('id', this.id).attr('src', this.thumbnail).on('load', function () {
                    self.element.toggleClass('loading loaded');
                });
                this.bindClick();
            };
            /**
             * Use computed (organized) data to apply style (size and margin) to elements on DOM
             * Does not apply border-radius because is used to restyle data on browser resize, and border-radius don't change.
             * @param element
             * @param gallery
             */
            Item.prototype.style = function () {
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
                var self = this;
                window.setTimeout(function () {
                    self.element.addClass('visible');
                }, 0);
            };
            Item.prototype.flash = function () {
                var self = this;
                this.element.removeClass('visible');
                window.setTimeout(function () {
                    self.element.addClass('visible');
                }, 0);
            };
            /**
             * Open photoswipe gallery on click
             * Add elements to gallery when navigating until last element
             * @param image
             * @param gallery
             */
            Item.prototype.bindClick = function () {
                var self = this;
                this.element.on('click', function (e) {
                    e.preventDefault();
                    if (!self.gallery.options.lightbox) {
                        return;
                    }
                    var options = {
                        index: $(this).index() - 1,
                        bgOpacity: 0.85,
                        showHideOpacity: true,
                        loop: false
                    };
                    var pswp = new PhotoSwipe(self.gallery.pswpElement, PhotoSwipeUI_Default, self.gallery.pswpContainer, options);
                    self.gallery.pswpApi = pswp;
                    pswp.init();
                    var overrideLoop = null;
                    // Loading one more page when going to next image
                    pswp.listen('beforeChange', function (delta) {
                        // Positive delta indicates "go to next" action, we don't load more objects on looping back the gallery (same logic when scrolling)
                        if (delta > 0 && pswp.getCurrentIndex() == pswp.items.length - 1) {
                            self.gallery.addElements();
                        }
                        else if (delta === -1 * (pswp.items.length - 1)) {
                            overrideLoop = pswp.items.length;
                            self.gallery.addElements();
                        }
                    });
                    // After change cannot detect if we are returning back from last to first
                    pswp.listen('afterChange', function () {
                        if (overrideLoop) {
                            pswp.goTo(overrideLoop);
                            overrideLoop = null;
                        }
                    });
                });
            };
            Item.prototype.getPswpItem = function () {
                return {
                    src: this._enlarged,
                    w: this._eWidth,
                    h: this._eHeight,
                    title: this._title
                };
            };
            Item.prototype.getElement = function () {
                return this.element;
            };
            Object.defineProperty(Item.prototype, "id", {
                get: function () {
                    return this._id;
                },
                set: function (value) {
                    this._id = value;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Item.prototype, "thumbnail", {
                get: function () {
                    return this._thumbnail;
                },
                set: function (value) {
                    this._thumbnail = value;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Item.prototype, "enlarged", {
                get: function () {
                    return this._enlarged;
                },
                set: function (value) {
                    this._enlarged = value;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Item.prototype, "title", {
                get: function () {
                    return this._title;
                },
                set: function (value) {
                    this._title = value;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Item.prototype, "tWidth", {
                get: function () {
                    return this._tWidth;
                },
                set: function (value) {
                    this._tWidth = value;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Item.prototype, "tHeight", {
                get: function () {
                    return this._tHeight;
                },
                set: function (value) {
                    this._tHeight = value;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Item.prototype, "eWidth", {
                get: function () {
                    return this._eWidth;
                },
                set: function (value) {
                    this._eWidth = value;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Item.prototype, "eHeight", {
                get: function () {
                    return this._eHeight;
                },
                set: function (value) {
                    this._eHeight = value;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Item.prototype, "last", {
                get: function () {
                    return this._last;
                },
                set: function (value) {
                    this._last = value;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Item.prototype, "categories", {
                get: function () {
                    return this._categories;
                },
                set: function (value) {
                    this._categories = value;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Item.prototype, "row", {
                get: function () {
                    return this._row;
                },
                set: function (value) {
                    this._row = value;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Item.prototype, "height", {
                get: function () {
                    return this._height;
                },
                set: function (value) {
                    this._height = value;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Item.prototype, "width", {
                get: function () {
                    return this._width;
                },
                set: function (value) {
                    this._width = value;
                },
                enumerable: true,
                configurable: true
            });
            return Item;
        }());
        Gallery.Item = Item;
    })(Gallery = Natural.Gallery || (Natural.Gallery = {}));
})(Natural || (Natural = {}));
/**
 * Based on http://blog.vjeux.com/2012/image/image-layout-algorithm-google-plus.html
 *
 * First, compute the number of pictures per row, based on target height (maxRowHeight).
 * Then compute the final height according to full container inner width
 *
 * Uses json, never read the dom, except to determine the size of parent container.
 *
 */
var Natural;
(function (Natural) {
    var Gallery;
    (function (Gallery) {
        var Organizer;
        (function (Organizer) {
            function organize(gallery) {
                if (gallery.options.format == 'natural') {
                    this.organizeNatural(gallery.collection, gallery.bodyWidth, gallery.options.rowHeight, gallery.options.margin);
                }
                else if (gallery.options.format == 'square') {
                    this.organizeSquare(gallery.collection, gallery.bodyWidth, gallery.options.imagesPerRow, gallery.options.margin);
                }
                gallery.style();
            }
            Organizer.organize = organize;
            /**
             * Compute sizes for images with 1:1 ratio
             * @param elements«
             * @param containerWidth
             * @param nbPictPerRow
             * @param margin
             */
            function organizeSquare(elements, containerWidth, nbPictPerRow, margin) {
                if (!margin) {
                    margin = 0;
                }
                if (!nbPictPerRow) {
                    nbPictPerRow = 4; // Should match the default value of imagesPerRow field from flexform
                }
                var size = (containerWidth - (nbPictPerRow - 1) * margin) / nbPictPerRow;
                for (var i = 0; i < elements.length; i++) {
                    var element = elements[i];
                    element.width = Math.floor(size);
                    element.height = Math.floor(size);
                    element.last = i % nbPictPerRow === nbPictPerRow - 1;
                    element.row = Math.floor(i / nbPictPerRow);
                }
            }
            Organizer.organizeSquare = organizeSquare;
            /**
             * Compute sizes for images that keep the most their native proportion
             * @param elements
             * @param containerWidth
             * @param maxRowHeight
             * @param margin
             * @param row
             */
            function organizeNatural(elements, containerWidth, maxRowHeight, margin, row) {
                if (row === void 0) { row = null; }
                if (!row) {
                    row = 0;
                }
                if (!margin) {
                    margin = 0;
                }
                if (!maxRowHeight) {
                    maxRowHeight = 300; // Should match the default value of thumbnailMaximumHeight field from flexform
                }
                for (var chunkSize = 1; chunkSize <= elements.length; chunkSize++) {
                    var chunk = elements.slice(0, chunkSize);
                    var rowWidth = this.getRowWidth(maxRowHeight, margin, chunk);
                    if (rowWidth >= containerWidth) {
                        this.computeSizes(chunk, containerWidth, margin, row);
                        this.organizeNatural(elements.slice(chunkSize), containerWidth, maxRowHeight, margin, row + 1);
                        break;
                    }
                    else if (chunkSize == elements.length) {
                        // the width is not fixed as we have not enough elements
                        // size of images are indexed on max row height.
                        this.computeSizes(chunk, null, margin, row, maxRowHeight);
                        break;
                    }
                }
            }
            Organizer.organizeNatural = organizeNatural;
            function computeSizes(chunk, containerWidth, margin, row, maxRowHeight) {
                if (maxRowHeight === void 0) { maxRowHeight = null; }
                var rowHeight = containerWidth ? this.getRowHeight(containerWidth, margin, chunk) : maxRowHeight;
                var rowWidth = this.getRowWidth(rowHeight, margin, chunk);
                var excess = containerWidth ? this.apportionExcess(chunk, containerWidth, rowWidth) : 0;
                var decimals = 0;
                for (var i = 0; i < chunk.length; i++) {
                    var element = chunk[i];
                    var width = this.getImageRatio(element) * rowHeight - excess;
                    decimals += width - Math.floor(width);
                    width = Math.floor(width);
                    if (decimals >= 1 || i === chunk.length - 1 && Math.round(decimals) === 1) {
                        width++;
                        decimals--;
                    }
                    element.width = width;
                    element.height = Math.floor(rowHeight);
                    element.row = row;
                    element.last = i == chunk.length - 1;
                }
            }
            Organizer.computeSizes = computeSizes;
            function getRowWidth(maxRowHeight, margin, elements) {
                return margin * (elements.length - 1) + this.getRatios(elements) * maxRowHeight;
            }
            Organizer.getRowWidth = getRowWidth;
            function getRowHeight(containerWidth, margin, elements) {
                return containerWidth / this.getRatios(elements) + margin * (elements.length - 1);
            }
            Organizer.getRowHeight = getRowHeight;
            function getRatios(elements) {
                var self = this;
                var totalWidth = 0;
                for (var i = 0; i < elements.length; i++) {
                    totalWidth += self.getImageRatio(elements[i]);
                }
                return totalWidth;
            }
            Organizer.getRatios = getRatios;
            function getImageRatio(el) {
                return Number(el.tWidth) / Number(el.tHeight);
            }
            Organizer.getImageRatio = getImageRatio;
            function apportionExcess(elements, containerWidth, rowWidth) {
                var excess = rowWidth - containerWidth;
                var excessPerItem = excess / elements.length;
                return excessPerItem;
            }
            Organizer.apportionExcess = apportionExcess;
        })(Organizer = Gallery.Organizer || (Gallery.Organizer = {}));
    })(Gallery = Natural.Gallery || (Natural.Gallery = {}));
})(Natural || (Natural = {}));
var Natural;
(function (Natural) {
    var Gallery;
    (function (Gallery) {
        var Utility;
        (function (Utility) {
            function getIcon(name) {
                return $('<svg viewBox="0 0 100 100"> <use xlink:href="#' + name + '"></use> </svg>');
            }
            Utility.getIcon = getIcon;
            function removeDiacritics(str) {
                for (var i = 0; i < defaultDiacriticsRemovalMap.length; i++) {
                    str = str.replace(defaultDiacriticsRemovalMap[i].letters, defaultDiacriticsRemovalMap[i].base);
                }
                return str;
            }
            Utility.removeDiacritics = removeDiacritics;
            /**
             * This little plugin add an invisible iframe with 100% and fires custom event "scrollbar" when it's size changes, including when parent window scrollbar appear
             */
            function addScrollResizeEvent() {
                $('<iframe id="scrollbar-listener"/>').css({
                    'position': 'fixed',
                    'width': '100%',
                    'height': 0,
                    'bottom': 0,
                    'border': 0,
                    'background-color': 'transparent'
                }).on('load', function () {
                    var vsb = (document.body.scrollHeight > document.body.clientHeight);
                    var timer = null;
                    this.contentWindow.addEventListener('resize', function () {
                        clearTimeout(timer);
                        timer = setTimeout(function () {
                            var vsbnew = (document.body.scrollHeight > document.body.clientHeight);
                            if (vsbnew) {
                                if (!vsb) {
                                    $(top.window).trigger('scrollbar', [true]);
                                    vsb = true;
                                }
                            }
                            else {
                                if (vsb) {
                                    $(top.window).trigger('scrollbar', [false]);
                                    vsb = false;
                                }
                            }
                        }, 100);
                    });
                }).appendTo('body');
            }
            Utility.addScrollResizeEvent = addScrollResizeEvent;
            // @off
            // Source = http://web.archive.org/web/20120918093154/http://lehelk.com/2011/05/06/script-to-remove-diacritics/
            var defaultDiacriticsRemovalMap = [
                { 'base': 'A', 'letters': /[\u0041\u24B6\uFF21\u00C0\u00C1\u00C2\u1EA6\u1EA4\u1EAA\u1EA8\u00C3\u0100\u0102\u1EB0\u1EAE\u1EB4\u1EB2\u0226\u01E0\u00C4\u01DE\u1EA2\u00C5\u01FA\u01CD\u0200\u0202\u1EA0\u1EAC\u1EB6\u1E00\u0104\u023A\u2C6F]/g },
                { 'base': 'AA', 'letters': /[\uA732]/g },
                { 'base': 'AE', 'letters': /[\u00C6\u01FC\u01E2]/g },
                { 'base': 'AO', 'letters': /[\uA734]/g },
                { 'base': 'AU', 'letters': /[\uA736]/g },
                { 'base': 'AV', 'letters': /[\uA738\uA73A]/g },
                { 'base': 'AY', 'letters': /[\uA73C]/g },
                { 'base': 'B', 'letters': /[\u0042\u24B7\uFF22\u1E02\u1E04\u1E06\u0243\u0182\u0181]/g },
                { 'base': 'C', 'letters': /[\u0043\u24B8\uFF23\u0106\u0108\u010A\u010C\u00C7\u1E08\u0187\u023B\uA73E]/g },
                { 'base': 'D', 'letters': /[\u0044\u24B9\uFF24\u1E0A\u010E\u1E0C\u1E10\u1E12\u1E0E\u0110\u018B\u018A\u0189\uA779]/g },
                { 'base': 'DZ', 'letters': /[\u01F1\u01C4]/g },
                { 'base': 'Dz', 'letters': /[\u01F2\u01C5]/g },
                { 'base': 'E', 'letters': /[\u0045\u24BA\uFF25\u00C8\u00C9\u00CA\u1EC0\u1EBE\u1EC4\u1EC2\u1EBC\u0112\u1E14\u1E16\u0114\u0116\u00CB\u1EBA\u011A\u0204\u0206\u1EB8\u1EC6\u0228\u1E1C\u0118\u1E18\u1E1A\u0190\u018E]/g },
                { 'base': 'F', 'letters': /[\u0046\u24BB\uFF26\u1E1E\u0191\uA77B]/g },
                { 'base': 'G', 'letters': /[\u0047\u24BC\uFF27\u01F4\u011C\u1E20\u011E\u0120\u01E6\u0122\u01E4\u0193\uA7A0\uA77D\uA77E]/g },
                { 'base': 'H', 'letters': /[\u0048\u24BD\uFF28\u0124\u1E22\u1E26\u021E\u1E24\u1E28\u1E2A\u0126\u2C67\u2C75\uA78D]/g },
                { 'base': 'I', 'letters': /[\u0049\u24BE\uFF29\u00CC\u00CD\u00CE\u0128\u012A\u012C\u0130\u00CF\u1E2E\u1EC8\u01CF\u0208\u020A\u1ECA\u012E\u1E2C\u0197]/g },
                { 'base': 'J', 'letters': /[\u004A\u24BF\uFF2A\u0134\u0248]/g },
                { 'base': 'K', 'letters': /[\u004B\u24C0\uFF2B\u1E30\u01E8\u1E32\u0136\u1E34\u0198\u2C69\uA740\uA742\uA744\uA7A2]/g },
                { 'base': 'L', 'letters': /[\u004C\u24C1\uFF2C\u013F\u0139\u013D\u1E36\u1E38\u013B\u1E3C\u1E3A\u0141\u023D\u2C62\u2C60\uA748\uA746\uA780]/g },
                { 'base': 'LJ', 'letters': /[\u01C7]/g },
                { 'base': 'Lj', 'letters': /[\u01C8]/g },
                { 'base': 'M', 'letters': /[\u004D\u24C2\uFF2D\u1E3E\u1E40\u1E42\u2C6E\u019C]/g },
                { 'base': 'N', 'letters': /[\u004E\u24C3\uFF2E\u01F8\u0143\u00D1\u1E44\u0147\u1E46\u0145\u1E4A\u1E48\u0220\u019D\uA790\uA7A4]/g },
                { 'base': 'NJ', 'letters': /[\u01CA]/g },
                { 'base': 'Nj', 'letters': /[\u01CB]/g },
                { 'base': 'O', 'letters': /[\u004F\u24C4\uFF2F\u00D2\u00D3\u00D4\u1ED2\u1ED0\u1ED6\u1ED4\u00D5\u1E4C\u022C\u1E4E\u014C\u1E50\u1E52\u014E\u022E\u0230\u00D6\u022A\u1ECE\u0150\u01D1\u020C\u020E\u01A0\u1EDC\u1EDA\u1EE0\u1EDE\u1EE2\u1ECC\u1ED8\u01EA\u01EC\u00D8\u01FE\u0186\u019F\uA74A\uA74C]/g },
                { 'base': 'OI', 'letters': /[\u01A2]/g },
                { 'base': 'OO', 'letters': /[\uA74E]/g },
                { 'base': 'OU', 'letters': /[\u0222]/g },
                { 'base': 'P', 'letters': /[\u0050\u24C5\uFF30\u1E54\u1E56\u01A4\u2C63\uA750\uA752\uA754]/g },
                { 'base': 'Q', 'letters': /[\u0051\u24C6\uFF31\uA756\uA758\u024A]/g },
                { 'base': 'R', 'letters': /[\u0052\u24C7\uFF32\u0154\u1E58\u0158\u0210\u0212\u1E5A\u1E5C\u0156\u1E5E\u024C\u2C64\uA75A\uA7A6\uA782]/g },
                { 'base': 'S', 'letters': /[\u0053\u24C8\uFF33\u1E9E\u015A\u1E64\u015C\u1E60\u0160\u1E66\u1E62\u1E68\u0218\u015E\u2C7E\uA7A8\uA784]/g },
                { 'base': 'T', 'letters': /[\u0054\u24C9\uFF34\u1E6A\u0164\u1E6C\u021A\u0162\u1E70\u1E6E\u0166\u01AC\u01AE\u023E\uA786]/g },
                { 'base': 'TZ', 'letters': /[\uA728]/g },
                { 'base': 'U', 'letters': /[\u0055\u24CA\uFF35\u00D9\u00DA\u00DB\u0168\u1E78\u016A\u1E7A\u016C\u00DC\u01DB\u01D7\u01D5\u01D9\u1EE6\u016E\u0170\u01D3\u0214\u0216\u01AF\u1EEA\u1EE8\u1EEE\u1EEC\u1EF0\u1EE4\u1E72\u0172\u1E76\u1E74\u0244]/g },
                { 'base': 'V', 'letters': /[\u0056\u24CB\uFF36\u1E7C\u1E7E\u01B2\uA75E\u0245]/g },
                { 'base': 'VY', 'letters': /[\uA760]/g },
                { 'base': 'W', 'letters': /[\u0057\u24CC\uFF37\u1E80\u1E82\u0174\u1E86\u1E84\u1E88\u2C72]/g },
                { 'base': 'X', 'letters': /[\u0058\u24CD\uFF38\u1E8A\u1E8C]/g },
                { 'base': 'Y', 'letters': /[\u0059\u24CE\uFF39\u1EF2\u00DD\u0176\u1EF8\u0232\u1E8E\u0178\u1EF6\u1EF4\u01B3\u024E\u1EFE]/g },
                { 'base': 'Z', 'letters': /[\u005A\u24CF\uFF3A\u0179\u1E90\u017B\u017D\u1E92\u1E94\u01B5\u0224\u2C7F\u2C6B\uA762]/g },
                { 'base': 'a', 'letters': /[\u0061\u24D0\uFF41\u1E9A\u00E0\u00E1\u00E2\u1EA7\u1EA5\u1EAB\u1EA9\u00E3\u0101\u0103\u1EB1\u1EAF\u1EB5\u1EB3\u0227\u01E1\u00E4\u01DF\u1EA3\u00E5\u01FB\u01CE\u0201\u0203\u1EA1\u1EAD\u1EB7\u1E01\u0105\u2C65\u0250]/g },
                { 'base': 'aa', 'letters': /[\uA733]/g },
                { 'base': 'ae', 'letters': /[\u00E6\u01FD\u01E3]/g },
                { 'base': 'ao', 'letters': /[\uA735]/g },
                { 'base': 'au', 'letters': /[\uA737]/g },
                { 'base': 'av', 'letters': /[\uA739\uA73B]/g },
                { 'base': 'ay', 'letters': /[\uA73D]/g },
                { 'base': 'b', 'letters': /[\u0062\u24D1\uFF42\u1E03\u1E05\u1E07\u0180\u0183\u0253]/g },
                { 'base': 'c', 'letters': /[\u0063\u24D2\uFF43\u0107\u0109\u010B\u010D\u00E7\u1E09\u0188\u023C\uA73F\u2184]/g },
                { 'base': 'd', 'letters': /[\u0064\u24D3\uFF44\u1E0B\u010F\u1E0D\u1E11\u1E13\u1E0F\u0111\u018C\u0256\u0257\uA77A]/g },
                { 'base': 'dz', 'letters': /[\u01F3\u01C6]/g },
                { 'base': 'e', 'letters': /[\u0065\u24D4\uFF45\u00E8\u00E9\u00EA\u1EC1\u1EBF\u1EC5\u1EC3\u1EBD\u0113\u1E15\u1E17\u0115\u0117\u00EB\u1EBB\u011B\u0205\u0207\u1EB9\u1EC7\u0229\u1E1D\u0119\u1E19\u1E1B\u0247\u025B\u01DD]/g },
                { 'base': 'f', 'letters': /[\u0066\u24D5\uFF46\u1E1F\u0192\uA77C]/g },
                { 'base': 'g', 'letters': /[\u0067\u24D6\uFF47\u01F5\u011D\u1E21\u011F\u0121\u01E7\u0123\u01E5\u0260\uA7A1\u1D79\uA77F]/g },
                { 'base': 'h', 'letters': /[\u0068\u24D7\uFF48\u0125\u1E23\u1E27\u021F\u1E25\u1E29\u1E2B\u1E96\u0127\u2C68\u2C76\u0265]/g },
                { 'base': 'hv', 'letters': /[\u0195]/g },
                { 'base': 'i', 'letters': /[\u0069\u24D8\uFF49\u00EC\u00ED\u00EE\u0129\u012B\u012D\u00EF\u1E2F\u1EC9\u01D0\u0209\u020B\u1ECB\u012F\u1E2D\u0268\u0131]/g },
                { 'base': 'j', 'letters': /[\u006A\u24D9\uFF4A\u0135\u01F0\u0249]/g },
                { 'base': 'k', 'letters': /[\u006B\u24DA\uFF4B\u1E31\u01E9\u1E33\u0137\u1E35\u0199\u2C6A\uA741\uA743\uA745\uA7A3]/g },
                { 'base': 'l', 'letters': /[\u006C\u24DB\uFF4C\u0140\u013A\u013E\u1E37\u1E39\u013C\u1E3D\u1E3B\u017F\u0142\u019A\u026B\u2C61\uA749\uA781\uA747]/g },
                { 'base': 'lj', 'letters': /[\u01C9]/g },
                { 'base': 'm', 'letters': /[\u006D\u24DC\uFF4D\u1E3F\u1E41\u1E43\u0271\u026F]/g },
                { 'base': 'n', 'letters': /[\u006E\u24DD\uFF4E\u01F9\u0144\u00F1\u1E45\u0148\u1E47\u0146\u1E4B\u1E49\u019E\u0272\u0149\uA791\uA7A5]/g },
                { 'base': 'nj', 'letters': /[\u01CC]/g },
                { 'base': 'o', 'letters': /[\u006F\u24DE\uFF4F\u00F2\u00F3\u00F4\u1ED3\u1ED1\u1ED7\u1ED5\u00F5\u1E4D\u022D\u1E4F\u014D\u1E51\u1E53\u014F\u022F\u0231\u00F6\u022B\u1ECF\u0151\u01D2\u020D\u020F\u01A1\u1EDD\u1EDB\u1EE1\u1EDF\u1EE3\u1ECD\u1ED9\u01EB\u01ED\u00F8\u01FF\u0254\uA74B\uA74D\u0275]/g },
                { 'base': 'oi', 'letters': /[\u01A3]/g },
                { 'base': 'ou', 'letters': /[\u0223]/g },
                { 'base': 'oo', 'letters': /[\uA74F]/g },
                { 'base': 'p', 'letters': /[\u0070\u24DF\uFF50\u1E55\u1E57\u01A5\u1D7D\uA751\uA753\uA755]/g },
                { 'base': 'q', 'letters': /[\u0071\u24E0\uFF51\u024B\uA757\uA759]/g },
                { 'base': 'r', 'letters': /[\u0072\u24E1\uFF52\u0155\u1E59\u0159\u0211\u0213\u1E5B\u1E5D\u0157\u1E5F\u024D\u027D\uA75B\uA7A7\uA783]/g },
                { 'base': 's', 'letters': /[\u0073\u24E2\uFF53\u00DF\u015B\u1E65\u015D\u1E61\u0161\u1E67\u1E63\u1E69\u0219\u015F\u023F\uA7A9\uA785\u1E9B]/g },
                { 'base': 't', 'letters': /[\u0074\u24E3\uFF54\u1E6B\u1E97\u0165\u1E6D\u021B\u0163\u1E71\u1E6F\u0167\u01AD\u0288\u2C66\uA787]/g },
                { 'base': 'tz', 'letters': /[\uA729]/g },
                { 'base': 'u', 'letters': /[\u0075\u24E4\uFF55\u00F9\u00FA\u00FB\u0169\u1E79\u016B\u1E7B\u016D\u00FC\u01DC\u01D8\u01D6\u01DA\u1EE7\u016F\u0171\u01D4\u0215\u0217\u01B0\u1EEB\u1EE9\u1EEF\u1EED\u1EF1\u1EE5\u1E73\u0173\u1E77\u1E75\u0289]/g },
                { 'base': 'v', 'letters': /[\u0076\u24E5\uFF56\u1E7D\u1E7F\u028B\uA75F\u028C]/g },
                { 'base': 'vy', 'letters': /[\uA761]/g },
                { 'base': 'w', 'letters': /[\u0077\u24E6\uFF57\u1E81\u1E83\u0175\u1E87\u1E85\u1E98\u1E89\u2C73]/g },
                { 'base': 'x', 'letters': /[\u0078\u24E7\uFF58\u1E8B\u1E8D]/g },
                { 'base': 'y', 'letters': /[\u0079\u24E8\uFF59\u1EF3\u00FD\u0177\u1EF9\u0233\u1E8F\u00FF\u1EF7\u1E99\u1EF5\u01B4\u024F\u1EFF]/g },
                { 'base': 'z', 'letters': /[\u007A\u24E9\uFF5A\u017A\u1E91\u017C\u017E\u1E93\u1E95\u01B6\u0225\u0240\u2C6C\uA763]/g }
            ];
        })(Utility = Gallery.Utility || (Gallery.Utility = {}));
    })(Gallery = Natural.Gallery || (Natural.Gallery = {}));
})(Natural || (Natural = {}));
///<reference path="../../app/js/controller.ts" />
///<reference path="../../app/js/gallery.ts" />
///<reference path="../../app/js/item.ts" />
///<reference path="../../app/js/organizer.ts" />
///<reference path="../../app/js/utility.ts" />
///<reference path="../../cache/typings/tsd.d.ts" />
///<reference path="../cache/typings/references.ts"/>
require('lodash');
var PhotoSwipe = require('PhotoSwipe');
var PhotoSwipeUI_Default = require('../node_modules/photoswipe/dist/photoswipe-ui-default');
var naturalGalleryController = new Natural.Gallery.Controller();
