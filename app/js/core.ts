module Natural.Gallery {

    export class Core {

        /**
         * Used to test if we scroll direction
         * Avoid to load more images when scrolling up in the detection zone
         * @type {number}
         */
        private old_scroll_top = 0;

        /**
         * Photoswipe global template element (dom element)
         */
        private $pswp = $('.pswp')[0];

        /**
         * Photoswipe javascript object
         * Contains api to interact with library
         * @type PhotoSwipe
         */
        private pswp = null;

        /**
         * Default rows by step
         * @type {number}
         */
        private minNumberOfRowsAtStart: number = 2;

        /**
         * Computing tools to organize images
         */
        private organizer: Natural.Gallery.Organizer;
        private utility: Natural.Gallery.Utility;

        public constructor() {
            this.organizer = new Natural.Gallery.Organizer();
            this.utility = new Natural.Gallery.Utility();
            this.bindEvents();
            this.initGallery();
        }

        /**
         * Everything starts here. Called in the end of this file.
         * For each gallery in the page, set a body container (dom element) and compute images sizes, then add elements to dom container
         */
        private initGallery() {

            let vm = this;

            _.each(naturalGalleries, function(gallery, i) {
                gallery.pswpContainer = [];
                gallery.selection = []; // for filtered elements
                gallery.rootElement = $($('.natural-gallery').get(i));
                gallery.bodyElement = gallery.rootElement.find('.natural-gallery-body');
                gallery.bodyElementWidth = Math.floor(gallery.bodyElement[0].getBoundingClientRect().width);
                vm.organizer.organize(gallery);
                vm.addElements(gallery);
                vm.cleanCategories(gallery);
            });
        }

        /**
         * Add a number of rows to DOM container, and to Photoswipe gallery.
         * If rows are not given, is uses backoffice data or compute according to browser size
         * @param gallery target
         * @param rows
         */
        private addElements(gallery, rows = null) {

            if (!gallery) {
                gallery = this.getGallery();
            }

            let collection = gallery.filtered ? gallery.selection : gallery.images;

            let nextButton = gallery.rootElement.find('.natural-gallery-next');
            nextButton.show(); // display because filters may add more images and we have to show it again

            if (gallery.pswpContainer.length === collection.length || !collection.length) {
                nextButton.hide();
                return;
            }

            if (!rows) {
                rows = this.getDefaultPageSize(gallery);
            }

            let nextImage = gallery.pswpContainer.length;
            let lastRow = gallery.pswpContainer.length ? collection[nextImage].row + rows : rows;

            // Select next elements, comparing their rows
            for (let i = nextImage; i < collection.length; i++) {
                let element = collection[i];
                if (element.row < lastRow) {

                    // Add enlarged to Photoswipe gallery
                    gallery.pswpContainer.push({
                        src: element.enlarged,
                        w: element.eWidth,
                        h: element.eHeight,
                        title: element.title
                    });

                    // Transform in DOM elements and store it
                    let figure = this.getFigure(element, gallery);
                    element.figure = figure;

                    $('<img />').data('id', i).attr('src', collection[i].thumbnail).on('load', function() {
                        collection[$(this).data('id')].figure.figure.toggleClass('loading loaded');
                    });

                    gallery.bodyElement.append(figure.figure);

                    this.bindClick(figure.image, gallery);
                    this.styleFigure(element, gallery);
                }

                // Show / Hide "more" button.
                if (gallery.pswpContainer.length === collection.length) {
                    nextButton.hide();
                }
            }

            gallery.rootElement.find('.natural-gallery-noresults').hide();
            gallery.rootElement.find('.natural-gallery-visible').text(gallery.pswpContainer.length);
            gallery.rootElement.find('.natural-gallery-total').text(collection.length);
        }

        private cleanCategories(gallery) {

            let vm = this;
            let categoriesCount = {};

            _.each(gallery.images, function(image) {
                let categories = vm.getImageCategories(image);

                // Create list of used categories
                if (categories.length == 0) {
                    categoriesCount['none'] = null;
                    return true;
                }

                _.each(categories, function(category, j){
                    categoriesCount[image.categories[j]] = null;
                });
            });

            // Hide unsused categories
            gallery.rootElement.find('.natural-gallery-categories label').each(function() {
                let el = $(this);
                let catId = el.data('id');

                if (typeof categoriesCount[catId] == 'undefined') {
                    el.remove();
                }
            });

        }

        private getImageCategories(image) {

            if (typeof image.categories == 'undefined') {
                return [];
            }

            if (image.categories.constructor !== Array) {
                return [];
            }

            return image.categories;
        }

        /**
         * Return number of rows to show per page,
         * If a number of rows are specified in the backoffice, this data is used.
         * If not specified, uses the vertical available space to compute the number of rows to display.
         * There is a letiable in the header of this file to specify the  minimum number of rows for the computation (minNumberOfRowsAtStart)
         * @param gallery
         * @returns {*}
         */
        private getDefaultPageSize(gallery) {

            if (gallery.limit) {
                return gallery.limit;
            }

            let winHeight = $(window).height();
            let galleryVisibleHeight = winHeight - gallery.bodyElement.offset().top;
            let nbRows = Math.floor(galleryVisibleHeight / (gallery.thumbnailMaximumHeight * 0.7 )); // ratio to be more close from reality average row height

            return nbRows < this.minNumberOfRowsAtStart ? this.minNumberOfRowsAtStart : nbRows;
        }

        /**
         * Create DOM elements according to element raw data (thumbnail and enlarged urls)
         * Also apply border-radius at this level because it never changed threw time
         * @param element
         * @param gallery
         * @returns {{figure: (*|HTMLElement), image: *}}
         */
        private getFigure(element, gallery) {

            let $figure = $('<figure></figure>').addClass('loading');
            let $image = $('<a></a>').css('background-image', 'url(' + element.thumbnail + ')');

            if (gallery.lightbox) {
                $image.attr('href', element.enlarged);
            }

            if (gallery.round) {
                $figure.css('border-radius', gallery.round);
                $image.css('border-radius', gallery.round);
            }

            $figure.append($image);

            if (element.title && (gallery.showLabels == 'true' || gallery.showLabels === true || gallery.showLabels == 'hover')) {
                let $label = $('<span></span>').text(element.title);
                if (gallery.showLabels == 'hover') {
                    $label.addClass('hover');
                }

                $figure.append($label);
            }

            return {
                figure: $figure,
                image: $image
            };
        }

        /**
         * Use computed (organized) data to apply style (size and margin) to elements on DOM
         * Does not apply border-radius because is used to restyle data on browser resize, and border-radius don't change.
         * @param element
         * @param gallery
         */
        private styleFigure(element, gallery) {

            element.figure.figure
                .css('width', element.width)
                .css('height', element.height)
                .css('margin-right', gallery.margin)
                .css('margin-bottom', gallery.margin);

            if (element.last) {
                element.figure.figure.css('margin-right', 0);
            }

            element.figure.image
                .css('width', element.width)
                .css('height', element.height);
        }

        /**
         * Open photoswipe gallery on click
         * Add elements to gallery when navigating until last element
         * @param image
         * @param gallery
         */
        private bindClick(image, gallery) {

            let self = this;

            image.on('click', function(e) {
                e.preventDefault();

                if (!gallery.lightbox) {
                    return;
                }

                let image = this;
                let options = {
                    index: $(this).parent('figure').index() - 1,
                    bgOpacity: 0.85,
                    showHideOpacity: true,
                    loop: false
                };

                self.pswp = new PhotoSwipe(self.$pswp, PhotoSwipeUI_Default, gallery.pswpContainer, options);
                self.pswp.init();

                let overrideLoop = null;

                // Loading one more page when going to next image
                self.pswp.listen('beforeChange', function(delta) {
                    // Positive delta indicates "go to next" action, we don't load more objects on looping back the gallery (same logic when scrolling)
                    if (delta > 0 && self.pswp.getCurrentIndex() == self.pswp.items.length - 1) {
                        self.addElements(self.getGallery(image));
                    } else if (delta === -1 * (self.pswp.items.length - 1)) {
                        overrideLoop = self.pswp.items.length;
                        self.addElements(self.getGallery(image));
                    }
                });

                // After change cannot detect if we are returning back from last to first
                self.pswp.listen('afterChange', function() {
                    if (overrideLoop) {
                        self.pswp.goTo(overrideLoop);
                        overrideLoop = null;
                    }
                });
            });
        }

        /**
         * Filter first by term, then by categories
         * @param gallery
         */
        private filterSelection(gallery) {

            let filtered = [];
            let filteredByTerm = this.filterByTerm(gallery);
            let filteredByCategory = this.filterByCategory(gallery);

            for (let i = 0; i < filteredByTerm.length; i++) {
                let img1 = filteredByTerm[i];

                for (let j = 0; j < filteredByCategory.length; j++) {
                    let img2 = filteredByCategory[j];
                    if (img1.id == img2.id) {
                        filtered.push(img1);
                        break;
                    }
                }
            }

            gallery.selection = filtered;
            gallery.filtered = true;
            this.reset(gallery);
            this.organizer.organize(gallery);
            this.addElements(gallery);
        }

        private filterByTerm(gallery) {

            let term = this.utility.removeDiacritics(gallery.rootElement.find('.natural-gallery-searchTerm input').val()).toLowerCase();
            let filteredImages = [];

            // show all if empty
            if (term.length === 0) {
                filteredImages = gallery.images;
            } else {
                for (let i = 0; i < gallery.images.length; i++) {
                    let image = gallery.images[i];
                    let needle = this.utility.removeDiacritics(image.title + " " + (image.description ? image.description : '')).toLowerCase();

                    if (needle.search(term) != -1) {
                        filteredImages.push(image);
                    }
                }
            }

            return filteredImages;
        }

        private filterByCategory(gallery) {

            let selectedCategories = this.getSelectedCategories(gallery);

            // if no categories at all on gallery, return all images to avoid any filter on it by categories
            if (selectedCategories === null) {
                return gallery.images;
            }

            // if there are categories, but they are not selected, return no images
            if (selectedCategories.length === 0) {
                return [];
            }

            let filteredImages = [];
            for (let i = 0; i < gallery.images.length; i++) {
                let image = gallery.images[i];
                let categories = this.getImageCategories(image);

                // If not categories, don't filter, add to elements to consider
                if (categories.length === 0 && selectedCategories.indexOf("none") != -1) {
                    filteredImages.push(image);

                } else if (categories.length > 0) {
                    // Set image as responding to filter if at least one category is found
                    for (let j = 0; j < image.categories.length; j++) {
                        let category = image.categories[j];
                        if (selectedCategories.indexOf(category) >= 0) {
                            filteredImages.push(image);
                            break;
                        }
                    }

                }
            }

            return filteredImages;
        }

        private getSelectedCategories(gallery) {

            // Create an array with id of each selected categories

            let inputs = gallery.rootElement.find('.natural-gallery-categories input');

            if (inputs.length === 0) {
                return null;
            }

            let selectedCategories = [];
            gallery.rootElement.find('.natural-gallery-categories input:checked').each(function() {
                selectedCategories.push($(this).parent().data('id'));
            });

            return selectedCategories;
        }

        /**
         * Empty DOM container and Photoswipe container
         * @param gallery
         */
        private reset(gallery) {
            gallery.pswpContainer = [];
            gallery.bodyElement.find('figure').remove();
            gallery.rootElement.find('.natural-gallery-noresults').show();
        }

        /**
         * Get gallery according to the given element
         * Search parenting to find the gallery id.
         * If no element is passed, it take the first gallery in the list (should be the single one anyway)
         * @param element a DOM element
         * @returns {*}
         */
        private getGallery(element = null) {
            if (element) {
                element = $(element).parents('.natural-gallery').get(0);
                let position = $('.natural-gallery').index(element);
                return naturalGalleries[position];
            } else {
                return naturalGalleries[0];
            }
        }

        /**
         * Check whetever we need to resize a gallery (only if parent container width changes)
         */
        private resize() {
            for (let i = 0; i < naturalGalleries.length; i++) {
                let gallery = naturalGalleries[i];
                let containerWidth = Math.floor(gallery.bodyElement[0].getBoundingClientRect().width);

                if (containerWidth != gallery.bodyElementWidth) {
                    gallery.bodyElementWidth = containerWidth;
                    gallery.bodyElement.find('figure').css('visibility', 'hidden');
                    this.organizer.organize(naturalGalleries);
                    this.redraw(gallery);
                }
            }
        }

        /**
         * Empty a gallery and add the same elements with new size
         */
        private redraw(gallery) {
            let galleries = gallery ? [gallery] : naturalGalleries;
            for (let i = 0; i < galleries.length; i++) {
                let gallery = galleries[i];
                let nbRows = gallery.images[gallery.pswpContainer.length - 1].row + 1;
                this.reset(gallery);
                this.addElements(gallery, nbRows);
            }
        }

        private bindEvents() {

            let self = this;

            /**
             * Resize
             * .on('resize') only works with window resize. When scroll appear, we can't detect it.
             * This little plugin add an invisible iframe with 100% and fires custom event "scrollbar" when it's size changes, including when parent window
             * scrollbar appear
             */
            $('<iframe id="scrollbar-listener"/>').css({
                'position': 'fixed',
                'width': '100%',
                'height': 0,
                'bottom': 0,
                'border': 0,
                'background-color': 'transparent'
            }).on('load', function() {
                let vsb = (document.body.scrollHeight > document.body.clientHeight);
                let timer = null;
                this.contentWindow.addEventListener('resize', function() {
                    clearTimeout(timer);
                    timer = setTimeout(function() {
                        let vsbnew = (document.body.scrollHeight > document.body.clientHeight);
                        if (vsbnew) {
                            if (!vsb) {
                                $(top.window).trigger('scrollbar', [true]);
                                vsb = true;
                            }
                        } else {
                            if (vsb) {
                                $(top.window).trigger('scrollbar', [false]);
                                vsb = false;
                            }
                        }
                    }, 100);
                });
            }).appendTo('body');

            // When browser size change
            $(window).on('resize', function() {
                self.resize();
            });

            // On windows scrollbar (dis)appear
            $(window).on('scrollbar', function() {
                self.resize();
            });

            /**
             * Attach event to next button
             */
            $('.natural-gallery-next').on('click', function(e) {
                e.preventDefault();
                self.addElements(self.getGallery(this)); // don't specify number of rows, addElements is smart enough to guess it
            });

            /**
             * On category checkboxes change
             */
            $('.natural-gallery-categories input').on('change', function() {
                self.filterSelection(self.getGallery(this));
            });

            /**
             * Attach event to the search field
             */
            $('.natural-gallery-searchTerm input[type="text"]').on('keydown', function(event) {

                // On escape, empty field
                if (event.keyCode == 27) {
                    $(this).val('');
                }

                let gallery = self.getGallery(this);
                if (gallery.lastSearch != $(this).val()) {
                    gallery.lastSearch = $(this).val();
                    self.filterSelection(gallery);
                }

            }).on('blur', function() {
                let gallery = self.getGallery(this);
                if (gallery.lastSearch != $(this).val()) {
                    gallery.lastSearch = $(this).val();
                    self.filterSelection(gallery);
                }
            });

            /**
             * Scroll
             * Load new images when scrolling down
             * Allow scroll if there is only a single gallery on page and no limit specified
             * If the limit is specified, the gallery switch to manual mode.
             */
            if (naturalGalleries.length == 1 && this.getGallery().limit === 0) {

                $(document).on('scroll', function() {
                    let gallery = self.getGallery().bodyElement;
                    let endOfGalleryAt = gallery.offset().top + gallery.height() + 100;

                    // Avoid to expand gallery if we are scrolling up
                    let current_scroll_top = $(document).scrollTop();
                    let window_size = $(window).height();//document.body.clientHeight;
                    let scroll_delta = current_scroll_top - self.old_scroll_top;
                    self.old_scroll_top = current_scroll_top;

                    // "enableMoreLoading" is a setting coming from the BE bloking / enabling dynamic loading of thumbnail
                    if (scroll_delta > 0 && current_scroll_top + window_size > endOfGalleryAt) {

                        // When scrolling only add a row at once
                        self.addElements(self.getGallery(), 1);
                    }
                });
            }

        }
    }

}

