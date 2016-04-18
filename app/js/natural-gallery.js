/**
 * Attach event when document is ready!
 */
(function($) {
    $(function() {

        /**
         * Used to test if we scroll direction
         * Avoid to load more images when scrolling up in the detection zone
         * @type {number}
         */
        var old_scroll_top = 0;

        /**
         * Photoswipe global template element (dom element)
         */
        var $pswp = $('.pswp')[0];

        /**
         * Photoswipe javascript object
         * Contains api to interact with library
         * @type PhotoSwipe
         */
        var pswp = null;

        /**
         * Default rows by step
         * @type {number}
         */
        var minNumberOfRowsAtStart = 2;

        /**
         * Computing tools to organize images
         */
        var organizer = natural_gallery_organizer;

        /**
         * Everything starts here. Called in the end of this file.
         * For each gallery in the page, set a body container (dom element) and compute images sizes, then add elements to dom container
         */
        function initGallery() {
            for (var i = 0; i < naturalGalleries.length; i++) {
                var gallery = naturalGalleries[i];
                gallery.pswpContainer = [];
                gallery.selection = []; // for filtered elements
                gallery.rootElement = $($('.natural-gallery').get(i));
                gallery.bodyElement = gallery.rootElement.find('.natural-gallery-body');
                gallery.bodyElementWidth = Math.floor(gallery.bodyElement[0].getBoundingClientRect().width);
                organizer.organize(gallery);
                addElements(gallery);
                cleanCategories(gallery);
            }
        }

        /**
         * Add a number of rows to DOM container, and to Photoswipe gallery.
         * If rows are not given, is uses backoffice data or compute according to browser size
         * @param gallery target
         * @param rows
         */
        function addElements(gallery, rows) {

            if (!gallery) {
                gallery = getGallery();
            }

            var collection = gallery.filtered ? gallery.selection : gallery.images;

            var nextButton = gallery.rootElement.find('.natural-gallery-next');
            nextButton.show(); // display because filters may add more images and we have to show it again

            if (gallery.pswpContainer.length === collection.length || !collection.length) {
                nextButton.hide();
                return;
            }

            if (!rows) {
                rows = getDefaultPageSize(gallery);
            }

            var nextImage = gallery.pswpContainer.length;
            var lastRow = gallery.pswpContainer.length ? collection[nextImage].row + rows : rows;

            // Select next elements, comparing their rows
            for (var i = nextImage; i < collection.length; i++) {
                var element = collection[i];
                if (element.row < lastRow) {

                    // Add enlarged to Photoswipe gallery
                    gallery.pswpContainer.push({
                        src: element.enlarged,
                        w: element.eWidth,
                        h: element.eHeight,
                        title: element.title
                    });

                    // Transform in DOM elements and store it
                    var figure = getFigure(element, gallery);
                    element.figure = figure;

                    $('<img />').data('id', i).attr('src', collection[i].thumbnail).on('load', function() {
                        collection[$(this).data('id')].figure.figure.toggleClass('loading loaded');
                    });

                    gallery.bodyElement.append(figure.figure);

                    bindClick(figure.image, gallery);
                    styleFigure(element, gallery);
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

        function cleanCategories(gallery) {

            var categoriesCount = {};
            for (var i = 0; i < gallery.images.length; i++) {

                var image = gallery.images[i];
                var categories = getImageCategories(image);

                // Create list of used categories
                if (categories.length == 0) {
                    categoriesCount['none'] = null;
                    continue;
                }

                for (var j = 0; j < categories.length; j++) {
                    categoriesCount[image.categories[j]] = null;
                }

            }

            // Hide unsused categories
            gallery.rootElement.find('.natural-gallery-categories label').each(function() {
                var el = $(this);
                var catId = el.data('id');

                if (typeof categoriesCount[catId] == 'undefined') {
                    el.remove();
                }
            });

        }

        function getImageCategories(image) {

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
         * There is a variable in the header of this file to specify the  minimum number of rows for the computation (minNumberOfRowsAtStart)
         * @param gallery
         * @returns {*}
         */
        function getDefaultPageSize(gallery) {

            if (gallery.limit) {
                return gallery.limit;
            }

            var winHeight = $(window).height();
            var galleryVisibleHeight = winHeight - gallery.bodyElement.offset().top;
            var nbRows = Math.floor(galleryVisibleHeight / (gallery.thumbnailMaximumHeight * 0.7 )); // ratio to be more close from reality average row height

            return nbRows < minNumberOfRowsAtStart ? minNumberOfRowsAtStart : nbRows;
        }

        /**
         * Create DOM elements according to element raw data (thumbnail and enlarged urls)
         * Also apply border-radius at this level because it never changed threw time
         * @param element
         * @param gallery
         * @returns {{figure: (*|HTMLElement), image: *}}
         */
        function getFigure(element, gallery) {

            var $figure = $('<figure></figure>').addClass('loading');
            var $image = $('<a></a>').css('background-image', 'url(' + element.thumbnail + ')');

            if (gallery.lightbox) {
                $image.attr('href', element.enlarged);
            }

            if (gallery.round) {
                $figure.css('border-radius', gallery.round);
                $image.css('border-radius', gallery.round);
            }

            $figure.append($image);

            if (element.title && (gallery.showLabels == 'true' || gallery.showLabels === true || gallery.showLabels == 'hover')) {
                var $label = $('<span></span>').text(element.title);
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
        function styleFigure(element, gallery) {

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
        function bindClick(image, gallery) {

            image.on('click', function(e) {
                e.preventDefault();

                if (!gallery.lightbox) {
                    return;
                }

                var self = this;
                var options = {
                    index: $(this).parent('figure').index() - 1,
                    bgOpacity: 0.85,
                    showHideOpacity: true,
                    loop: false
                };

                pswp = new PhotoSwipe($pswp, PhotoSwipeUI_Default, gallery.pswpContainer, options);
                pswp.init();

                var overrideLoop = null;

                // Loading one more page when going to next image
                pswp.listen('beforeChange', function(delta) {
                    // Positive delta indicates "go to next" action, we don't load more objects on looping back the gallery (same logic when scrolling)
                    if (delta > 0 && pswp.getCurrentIndex() == pswp.items.length - 1) {
                        addElements(getGallery(self));
                    } else if (delta === -1 * (pswp.items.length - 1)) {
                        overrideLoop = pswp.items.length;
                        addElements(getGallery(self));
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

        /**
         * Filter first by term, then by categories
         * @param gallery
         */
        function filterSelection(gallery) {

            var filtered = [];

            var filteredByTerm = filterByTerm(gallery);
            var filteredByCategory = filterByCategory(gallery);

            for (var i = 0; i < filteredByTerm.length; i++) {
                var img1 = filteredByTerm[i];

                for (var j = 0; j < filteredByCategory.length; j++) {
                    var img2 = filteredByCategory[j];
                    if (img1.id == img2.id) {
                        filtered.push(img1);
                        break;
                    }
                }
            }

            gallery.selection = filtered;
            gallery.filtered = true;
            reset(gallery);
            organizer.organize(gallery);
            addElements(gallery);
        }

        function filterByTerm(gallery) {

            var term = removeDiacritics(gallery.rootElement.find('.natural-gallery-searchTerm input').val()).toLowerCase();
            var filteredImages = [];

            // show all if empty
            if (term.length === 0) {
                filteredImages = gallery.images;
            } else {
                for (var i = 0; i < gallery.images.length; i++) {
                    var image = gallery.images[i];
                    var needle = removeDiacritics(image.title + " " + (image.description ? image.description : '')).toLowerCase();

                    if (needle.search(term) != -1) {
                        filteredImages.push(image);
                    }
                }
            }

            return filteredImages;
        }

        function filterByCategory(gallery) {

            var selectedCategories = getSelectedCategories(gallery);

            // if no categories at all on gallery, return all images to avoid any filter on it by categories
            if (selectedCategories === null) {
                return gallery.images;
            }

            // if there are categories, but they are not selected, return no images
            if (selectedCategories.length === 0) {
                return [];
            }

            var filteredImages = [];
            for (var i = 0; i < gallery.images.length; i++) {
                var image = gallery.images[i];
                var categories = getImageCategories(image);

                // If not categories, don't filter, add to elements to consider
                if (categories.length === 0 && selectedCategories.indexOf("none") != -1) {
                    filteredImages.push(image);

                } else if (categories.length > 0) {
                    // Set image as responding to filter if at least one category is found
                    for (var j = 0; j < image.categories.length; j++) {
                        var category = image.categories[j];
                        if (selectedCategories.indexOf(category) >= 0) {
                            filteredImages.push(image);
                            break;
                        }
                    }

                }
            }

            return filteredImages;
        }

        function getSelectedCategories(gallery) {

            // Create an array with id of each selected categories

            var inputs = gallery.rootElement.find('.natural-gallery-categories input');

            if (inputs.length === 0) {
                return null;
            }

            var selectedCategories = [];
            gallery.rootElement.find('.natural-gallery-categories input:checked').each(function() {
                selectedCategories.push($(this).parent().data('id'));
            });

            return selectedCategories;
        }

        /**
         * Empty DOM container and Photoswipe container
         * @param gallery
         */
        function reset(gallery) {
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
        function getGallery(element) {
            if (element) {
                var element = $(element).parents('.natural-gallery').get(0);
                var position = $('.natural-gallery').index(element);
                return naturalGalleries[position];
            } else {
                return naturalGalleries[0];
            }
        }

        /**
         * Attach event to next button
         */
        $('.natural-gallery-next').on('click', function(e) {
            e.preventDefault();
            addElements(getGallery(this)); // don't specify number of rows, addElements is smart enough to guess it
        });

        /**
         * On category checkboxes change
         */
        $('.natural-gallery-categories input').on('change', function() {
            filterSelection(getGallery(this));
        });

        /**
         * Attach event to the search field
         */
        $('.natural-gallery-searchTerm input[type="text"]').on('keydown', function(event) {

            // On escape, empty field
            if (event.keyCode == 27) {
                $(this).val('');
            }

            var gallery = getGallery(this);
            if (gallery.lastSearch != $(this).val()) {
                gallery.lastSearch = $(this).val();
                filterSelection(gallery);
            }

        }).on('blur', function() {
            var gallery = getGallery(this);
            if (gallery.lastSearch != $(this).val()) {
                gallery.lastSearch = $(this).val();
                filterSelection(gallery);
            }
        });

        /**
         * Scroll
         * Load new images when scrolling down
         * Allow scroll if there is only a single gallery on page and no limit specified
         * If the limit is specified, the gallery switch to manual mode.
         */
        if (naturalGalleries.length == 1 && getGallery().limit === 0) {

            $(document).scroll(function() {

                var gallery = getGallery().bodyElement;
                var endOfGalleryAt = gallery.offset().top + gallery.height() + 100;

                // Avoid to expand gallery if we are scrolling up
                var current_scroll_top = $(document).scrollTop();
                var window_size = $(window).height();//document.body.clientHeight;
                var scroll_delta = current_scroll_top - old_scroll_top;
                old_scroll_top = current_scroll_top;

                // "enableMoreLoading" is a setting coming from the BE bloking / enabling dynamic loading of thumbnail
                if (scroll_delta > 0 && current_scroll_top + window_size > endOfGalleryAt) {

                    // When scrolling only add a row at once
                    addElements(getGallery(), 1);
                }
            });
        }

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
            var vsb = (document.body.scrollHeight > document.body.clientHeight);
            var timer = null;
            this.contentWindow.addEventListener('resize', function() {
                clearTimeout(timer);
                timer = setTimeout(function() {
                    var vsbnew = (document.body.scrollHeight > document.body.clientHeight);
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
            resize();
        });

        // On windows scrollbar (dis)appear
        $(window).on('scrollbar', function() {
            resize();
        });

        /**
         * Check whetever we need to resize a gallery (only if parent container width changes)
         */
        function resize() {
            for (var i = 0; i < naturalGalleries.length; i++) {
                var gallery = naturalGalleries[i];
                var containerWidth = Math.floor(gallery.bodyElement[0].getBoundingClientRect().width);

                if (containerWidth != gallery.bodyElementWidth) {
                    gallery.bodyElementWidth = containerWidth;
                    gallery.bodyElement.find('figure').css('visibility', 'hidden');
                    organizer.organize();
                    redraw(gallery);
                }
            }
        }

        /**
         * Empty a gallery and add the same elements with new size
         */
        function redraw(gallery) {
            var galleries = gallery ? [gallery] : naturalGalleries
            for (var i = 0; i < galleries.length; i++) {
                var gallery = galleries[i];
                var nbRows = gallery.images[gallery.pswpContainer.length - 1].row + 1;
                reset(gallery);
                addElements(gallery, nbRows);
            }
        }


        initGallery();

    });
})(jQuery);
