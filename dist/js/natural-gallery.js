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
                gallery.rootElement = $('#natural-gallery-' + gallery.id);
                gallery.bodyElement = gallery.rootElement.find('.natural-gallery-body');
                gallery.bodyElementWidth = Math.floor(gallery.bodyElement[0].getBoundingClientRect().width);
                organizer.organize(gallery);
                addElements(gallery);
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

            if (gallery.pswpContainer.length === collection.length) {
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

                    gallery.bodyElement.append(figure.figure);

                    bindClick(figure.image, gallery);
                    styleFigure(element, gallery);
                }

                // Show / Hide "more" button.
                var nextButton = gallery.rootElement.find('.natural-gallery-next span');
                nextButton.show(); // display because filters may add more images and we have to show it again
                if (gallery.pswpContainer.length === collection.length) {
                    nextButton.hide();
                }
            }

            gallery.rootElement.find('.natural-gallery-noresults').hide();
            gallery.rootElement.find('.natural-gallery-numberOfVisibleImages').text(gallery.pswpContainer.length);
            gallery.rootElement.find('.natural-gallery-totalImages').text(collection.length);
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

            var $figure = $('<figure></figure>');
            var $image = $('<a></a>')
                .css('background-image', 'url(' + element.thumbnail + ')')
                .attr('href', element.enlarged);

            if (gallery.round) {
                $image.css('border-radius', gallery.round)
            }

            $figure.append($image);

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
                   .css('display', 'none')
                   .css('width', element.width)
                   .css('height', element.height);

            element.figure.image.fadeIn({duration: 1000});
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
                    if (img1.uid == img2.uid) {
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

            var term = removeDiacritics(gallery.rootElement.find('.natural-gallery-searchTerm').val()).toLowerCase();
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

            // Create an array with id of each selected categories
            var selectedCategories = [];

            gallery.rootElement.find('.natural-gallery-category:checked').each(function() {
                selectedCategories.push($(this).data('uid'));
            });

            var filteredImages = [];
            for (var i = 0; i < gallery.images.length; i++) {
                var image = gallery.images[i];

                // If not categories, dont filter, add to elements to consider
                // !image.hasOwnProperty('categories') && !Array.isArray(image.categories) &&
                if (image.categories.length === 0 && selectedCategories.indexOf("none") != -1) {
                    filteredImages.push(image);

                } else if (image.categories.length > 0) {
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

            var gallery = naturalGalleries[0];
            if (element) {
                var galleryId = $(element).parents('.natural-gallery').data('galleryid');

                var gallery = null;
                for (var i = 0; i < naturalGalleries.length; i++) {
                    if (naturalGalleries[i].id == Number(galleryId)) {
                        gallery = naturalGalleries[i];
                        break;
                    }
                }
            }
            return gallery;
        }

        /**
         * Attach event to next button
         */
        $('.natural-gallery-next a').on('click', function(e) {
            e.preventDefault();
            addElements(getGallery(this)); // don't specify number of rows, addElements is smart enough to guess it
        });

        /**
         * On category checkboxes change
         */
        $('.natural-gallery-category').on('change', function(e) {
            filterSelection(getGallery(this));
        });

        /**
         * Attach event to the search field
         */
        $('.natural-gallery-searchTerm').on('keydown', function(event) {
            // True when key 'enter' hit
            if (event.keyCode == 13) {
                event.preventDefault();
                var gallery = getGallery(this);
                if (gallery.lastSearch != $(this).val()) {
                    gallery.lastSearch = $(this).val();
                    filterSelection(gallery);
                }
            }
        });

        $('.natural-gallery-searchTerm').on('blur', function() {
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
            'position'      : 'fixed',
            'width'         : '100%',
            'height'        : 0,
            'bottom'        : 0,
            'border'        : 0,
            'background-color'  : 'transparent'
        }).on('load',function() {
            var vsb     = (document.body.scrollHeight > document.body.clientHeight);
            var timer   = null;
            this.contentWindow.addEventListener('resize', function() {
                clearTimeout(timer);
                timer = setTimeout(function() {
                    var vsbnew = (document.body.scrollHeight > document.body.clientHeight);
                    if (vsbnew) {
                        if (!vsb) {
                            $(top.window).trigger('scrollbar',[true]);
                            vsb=true;
                        }
                    } else {
                        if (vsb) {
                            $(top.window).trigger('scrollbar',[false]);
                            vsb=false;
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
        $(window).on('scrollbar', function(){
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

        // Source = http://web.archive.org/web/20120918093154/http://lehelk.com/2011/05/06/script-to-remove-diacritics/
        var defaultDiacriticsRemovalMap = [
            {'base':'A', 'letters':/[\u0041\u24B6\uFF21\u00C0\u00C1\u00C2\u1EA6\u1EA4\u1EAA\u1EA8\u00C3\u0100\u0102\u1EB0\u1EAE\u1EB4\u1EB2\u0226\u01E0\u00C4\u01DE\u1EA2\u00C5\u01FA\u01CD\u0200\u0202\u1EA0\u1EAC\u1EB6\u1E00\u0104\u023A\u2C6F]/g},
            {'base':'AA','letters':/[\uA732]/g},
            {'base':'AE','letters':/[\u00C6\u01FC\u01E2]/g},
            {'base':'AO','letters':/[\uA734]/g},
            {'base':'AU','letters':/[\uA736]/g},
            {'base':'AV','letters':/[\uA738\uA73A]/g},
            {'base':'AY','letters':/[\uA73C]/g},
            {'base':'B', 'letters':/[\u0042\u24B7\uFF22\u1E02\u1E04\u1E06\u0243\u0182\u0181]/g},
            {'base':'C', 'letters':/[\u0043\u24B8\uFF23\u0106\u0108\u010A\u010C\u00C7\u1E08\u0187\u023B\uA73E]/g},
            {'base':'D', 'letters':/[\u0044\u24B9\uFF24\u1E0A\u010E\u1E0C\u1E10\u1E12\u1E0E\u0110\u018B\u018A\u0189\uA779]/g},
            {'base':'DZ','letters':/[\u01F1\u01C4]/g},
            {'base':'Dz','letters':/[\u01F2\u01C5]/g},
            {'base':'E', 'letters':/[\u0045\u24BA\uFF25\u00C8\u00C9\u00CA\u1EC0\u1EBE\u1EC4\u1EC2\u1EBC\u0112\u1E14\u1E16\u0114\u0116\u00CB\u1EBA\u011A\u0204\u0206\u1EB8\u1EC6\u0228\u1E1C\u0118\u1E18\u1E1A\u0190\u018E]/g},
            {'base':'F', 'letters':/[\u0046\u24BB\uFF26\u1E1E\u0191\uA77B]/g},
            {'base':'G', 'letters':/[\u0047\u24BC\uFF27\u01F4\u011C\u1E20\u011E\u0120\u01E6\u0122\u01E4\u0193\uA7A0\uA77D\uA77E]/g},
            {'base':'H', 'letters':/[\u0048\u24BD\uFF28\u0124\u1E22\u1E26\u021E\u1E24\u1E28\u1E2A\u0126\u2C67\u2C75\uA78D]/g},
            {'base':'I', 'letters':/[\u0049\u24BE\uFF29\u00CC\u00CD\u00CE\u0128\u012A\u012C\u0130\u00CF\u1E2E\u1EC8\u01CF\u0208\u020A\u1ECA\u012E\u1E2C\u0197]/g},
            {'base':'J', 'letters':/[\u004A\u24BF\uFF2A\u0134\u0248]/g},
            {'base':'K', 'letters':/[\u004B\u24C0\uFF2B\u1E30\u01E8\u1E32\u0136\u1E34\u0198\u2C69\uA740\uA742\uA744\uA7A2]/g},
            {'base':'L', 'letters':/[\u004C\u24C1\uFF2C\u013F\u0139\u013D\u1E36\u1E38\u013B\u1E3C\u1E3A\u0141\u023D\u2C62\u2C60\uA748\uA746\uA780]/g},
            {'base':'LJ','letters':/[\u01C7]/g},
            {'base':'Lj','letters':/[\u01C8]/g},
            {'base':'M', 'letters':/[\u004D\u24C2\uFF2D\u1E3E\u1E40\u1E42\u2C6E\u019C]/g},
            {'base':'N', 'letters':/[\u004E\u24C3\uFF2E\u01F8\u0143\u00D1\u1E44\u0147\u1E46\u0145\u1E4A\u1E48\u0220\u019D\uA790\uA7A4]/g},
            {'base':'NJ','letters':/[\u01CA]/g},
            {'base':'Nj','letters':/[\u01CB]/g},
            {'base':'O', 'letters':/[\u004F\u24C4\uFF2F\u00D2\u00D3\u00D4\u1ED2\u1ED0\u1ED6\u1ED4\u00D5\u1E4C\u022C\u1E4E\u014C\u1E50\u1E52\u014E\u022E\u0230\u00D6\u022A\u1ECE\u0150\u01D1\u020C\u020E\u01A0\u1EDC\u1EDA\u1EE0\u1EDE\u1EE2\u1ECC\u1ED8\u01EA\u01EC\u00D8\u01FE\u0186\u019F\uA74A\uA74C]/g},
            {'base':'OI','letters':/[\u01A2]/g},
            {'base':'OO','letters':/[\uA74E]/g},
            {'base':'OU','letters':/[\u0222]/g},
            {'base':'P', 'letters':/[\u0050\u24C5\uFF30\u1E54\u1E56\u01A4\u2C63\uA750\uA752\uA754]/g},
            {'base':'Q', 'letters':/[\u0051\u24C6\uFF31\uA756\uA758\u024A]/g},
            {'base':'R', 'letters':/[\u0052\u24C7\uFF32\u0154\u1E58\u0158\u0210\u0212\u1E5A\u1E5C\u0156\u1E5E\u024C\u2C64\uA75A\uA7A6\uA782]/g},
            {'base':'S', 'letters':/[\u0053\u24C8\uFF33\u1E9E\u015A\u1E64\u015C\u1E60\u0160\u1E66\u1E62\u1E68\u0218\u015E\u2C7E\uA7A8\uA784]/g},
            {'base':'T', 'letters':/[\u0054\u24C9\uFF34\u1E6A\u0164\u1E6C\u021A\u0162\u1E70\u1E6E\u0166\u01AC\u01AE\u023E\uA786]/g},
            {'base':'TZ','letters':/[\uA728]/g},
            {'base':'U', 'letters':/[\u0055\u24CA\uFF35\u00D9\u00DA\u00DB\u0168\u1E78\u016A\u1E7A\u016C\u00DC\u01DB\u01D7\u01D5\u01D9\u1EE6\u016E\u0170\u01D3\u0214\u0216\u01AF\u1EEA\u1EE8\u1EEE\u1EEC\u1EF0\u1EE4\u1E72\u0172\u1E76\u1E74\u0244]/g},
            {'base':'V', 'letters':/[\u0056\u24CB\uFF36\u1E7C\u1E7E\u01B2\uA75E\u0245]/g},
            {'base':'VY','letters':/[\uA760]/g},
            {'base':'W', 'letters':/[\u0057\u24CC\uFF37\u1E80\u1E82\u0174\u1E86\u1E84\u1E88\u2C72]/g},
            {'base':'X', 'letters':/[\u0058\u24CD\uFF38\u1E8A\u1E8C]/g},
            {'base':'Y', 'letters':/[\u0059\u24CE\uFF39\u1EF2\u00DD\u0176\u1EF8\u0232\u1E8E\u0178\u1EF6\u1EF4\u01B3\u024E\u1EFE]/g},
            {'base':'Z', 'letters':/[\u005A\u24CF\uFF3A\u0179\u1E90\u017B\u017D\u1E92\u1E94\u01B5\u0224\u2C7F\u2C6B\uA762]/g},
            {'base':'a', 'letters':/[\u0061\u24D0\uFF41\u1E9A\u00E0\u00E1\u00E2\u1EA7\u1EA5\u1EAB\u1EA9\u00E3\u0101\u0103\u1EB1\u1EAF\u1EB5\u1EB3\u0227\u01E1\u00E4\u01DF\u1EA3\u00E5\u01FB\u01CE\u0201\u0203\u1EA1\u1EAD\u1EB7\u1E01\u0105\u2C65\u0250]/g},
            {'base':'aa','letters':/[\uA733]/g},
            {'base':'ae','letters':/[\u00E6\u01FD\u01E3]/g},
            {'base':'ao','letters':/[\uA735]/g},
            {'base':'au','letters':/[\uA737]/g},
            {'base':'av','letters':/[\uA739\uA73B]/g},
            {'base':'ay','letters':/[\uA73D]/g},
            {'base':'b', 'letters':/[\u0062\u24D1\uFF42\u1E03\u1E05\u1E07\u0180\u0183\u0253]/g},
            {'base':'c', 'letters':/[\u0063\u24D2\uFF43\u0107\u0109\u010B\u010D\u00E7\u1E09\u0188\u023C\uA73F\u2184]/g},
            {'base':'d', 'letters':/[\u0064\u24D3\uFF44\u1E0B\u010F\u1E0D\u1E11\u1E13\u1E0F\u0111\u018C\u0256\u0257\uA77A]/g},
            {'base':'dz','letters':/[\u01F3\u01C6]/g},
            {'base':'e', 'letters':/[\u0065\u24D4\uFF45\u00E8\u00E9\u00EA\u1EC1\u1EBF\u1EC5\u1EC3\u1EBD\u0113\u1E15\u1E17\u0115\u0117\u00EB\u1EBB\u011B\u0205\u0207\u1EB9\u1EC7\u0229\u1E1D\u0119\u1E19\u1E1B\u0247\u025B\u01DD]/g},
            {'base':'f', 'letters':/[\u0066\u24D5\uFF46\u1E1F\u0192\uA77C]/g},
            {'base':'g', 'letters':/[\u0067\u24D6\uFF47\u01F5\u011D\u1E21\u011F\u0121\u01E7\u0123\u01E5\u0260\uA7A1\u1D79\uA77F]/g},
            {'base':'h', 'letters':/[\u0068\u24D7\uFF48\u0125\u1E23\u1E27\u021F\u1E25\u1E29\u1E2B\u1E96\u0127\u2C68\u2C76\u0265]/g},
            {'base':'hv','letters':/[\u0195]/g},
            {'base':'i', 'letters':/[\u0069\u24D8\uFF49\u00EC\u00ED\u00EE\u0129\u012B\u012D\u00EF\u1E2F\u1EC9\u01D0\u0209\u020B\u1ECB\u012F\u1E2D\u0268\u0131]/g},
            {'base':'j', 'letters':/[\u006A\u24D9\uFF4A\u0135\u01F0\u0249]/g},
            {'base':'k', 'letters':/[\u006B\u24DA\uFF4B\u1E31\u01E9\u1E33\u0137\u1E35\u0199\u2C6A\uA741\uA743\uA745\uA7A3]/g},
            {'base':'l', 'letters':/[\u006C\u24DB\uFF4C\u0140\u013A\u013E\u1E37\u1E39\u013C\u1E3D\u1E3B\u017F\u0142\u019A\u026B\u2C61\uA749\uA781\uA747]/g},
            {'base':'lj','letters':/[\u01C9]/g},
            {'base':'m', 'letters':/[\u006D\u24DC\uFF4D\u1E3F\u1E41\u1E43\u0271\u026F]/g},
            {'base':'n', 'letters':/[\u006E\u24DD\uFF4E\u01F9\u0144\u00F1\u1E45\u0148\u1E47\u0146\u1E4B\u1E49\u019E\u0272\u0149\uA791\uA7A5]/g},
            {'base':'nj','letters':/[\u01CC]/g},
            {'base':'o', 'letters':/[\u006F\u24DE\uFF4F\u00F2\u00F3\u00F4\u1ED3\u1ED1\u1ED7\u1ED5\u00F5\u1E4D\u022D\u1E4F\u014D\u1E51\u1E53\u014F\u022F\u0231\u00F6\u022B\u1ECF\u0151\u01D2\u020D\u020F\u01A1\u1EDD\u1EDB\u1EE1\u1EDF\u1EE3\u1ECD\u1ED9\u01EB\u01ED\u00F8\u01FF\u0254\uA74B\uA74D\u0275]/g},
            {'base':'oi','letters':/[\u01A3]/g},
            {'base':'ou','letters':/[\u0223]/g},
            {'base':'oo','letters':/[\uA74F]/g},
            {'base':'p','letters':/[\u0070\u24DF\uFF50\u1E55\u1E57\u01A5\u1D7D\uA751\uA753\uA755]/g},
            {'base':'q','letters':/[\u0071\u24E0\uFF51\u024B\uA757\uA759]/g},
            {'base':'r','letters':/[\u0072\u24E1\uFF52\u0155\u1E59\u0159\u0211\u0213\u1E5B\u1E5D\u0157\u1E5F\u024D\u027D\uA75B\uA7A7\uA783]/g},
            {'base':'s','letters':/[\u0073\u24E2\uFF53\u00DF\u015B\u1E65\u015D\u1E61\u0161\u1E67\u1E63\u1E69\u0219\u015F\u023F\uA7A9\uA785\u1E9B]/g},
            {'base':'t','letters':/[\u0074\u24E3\uFF54\u1E6B\u1E97\u0165\u1E6D\u021B\u0163\u1E71\u1E6F\u0167\u01AD\u0288\u2C66\uA787]/g},
            {'base':'tz','letters':/[\uA729]/g},
            {'base':'u','letters':/[\u0075\u24E4\uFF55\u00F9\u00FA\u00FB\u0169\u1E79\u016B\u1E7B\u016D\u00FC\u01DC\u01D8\u01D6\u01DA\u1EE7\u016F\u0171\u01D4\u0215\u0217\u01B0\u1EEB\u1EE9\u1EEF\u1EED\u1EF1\u1EE5\u1E73\u0173\u1E77\u1E75\u0289]/g},
            {'base':'v','letters':/[\u0076\u24E5\uFF56\u1E7D\u1E7F\u028B\uA75F\u028C]/g},
            {'base':'vy','letters':/[\uA761]/g},
            {'base':'w','letters':/[\u0077\u24E6\uFF57\u1E81\u1E83\u0175\u1E87\u1E85\u1E98\u1E89\u2C73]/g},
            {'base':'x','letters':/[\u0078\u24E7\uFF58\u1E8B\u1E8D]/g},
            {'base':'y','letters':/[\u0079\u24E8\uFF59\u1EF3\u00FD\u0177\u1EF9\u0233\u1E8F\u00FF\u1EF7\u1E99\u1EF5\u01B4\u024F\u1EFF]/g},
            {'base':'z','letters':/[\u007A\u24E9\uFF5A\u017A\u1E91\u017C\u017E\u1E93\u1E95\u01B6\u0225\u0240\u2C6C\uA763]/g}
        ];

        function removeDiacritics(str) {

            for (var i = 0; i < defaultDiacriticsRemovalMap.length; i++) {
                str = str.replace(defaultDiacriticsRemovalMap[i].letters, defaultDiacriticsRemovalMap[i].base);
            }
            return str;
        }

        initGallery();

    });
})(jQuery);
