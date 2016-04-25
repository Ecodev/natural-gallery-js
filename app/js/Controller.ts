module Natural.Gallery {

    export class Controller {

        /**
         * Used to test the scroll direction
         * Avoid to load more images when scrolling up in the detection zone
         * @type {number}
         */
        private old_scroll_top = 0;

        /**
         * Bootstrap galleries
         * For each gallery in the page, set a body container (dom element) and compute images sizes, then add elements to dom container
         */
        public constructor() {

            let pswp = $('.pswp')[0];

            _.each(naturalGalleries, function(gallery, i) {
                naturalGalleries[i] = new Gallery(i, gallery.options, pswp);
                if (!_.isEmpty(gallery.images)) {
                    naturalGalleries[i].collection = gallery.images;
                }
            });

            this.bindEvents();
        }

        /**
         * Check whetever we need to resize a gallery (only if parent container width changes)
         */
        private resize() {
            _.each(naturalGalleries, function(gallery: Gallery) {
                gallery.resize();
            });
        }

        /**
         * Bind generic events that are valid for all galleries like window scroll and resize
         */
        private bindEvents() {

            let self = this;

            // When browser size change
            $(window).on('resize', function() {
                self.resize();
            });

            // On windows scrollbar (dis)appear
            Utility.addScrollResizeEvent();
            $(window).on('scrollbar', function() {
                self.resize();
            });

            /**
             * Scroll
             * Load new images when scrolling down
             * Allow scroll if there is only a single gallery on page and no limit specified
             * If the limit is specified, the gallery switch to manual mode.
             */
            if (naturalGalleries.length == 1 && naturalGalleries[0].options.limit === 0) {

                $(document).on('scroll', function() {
                    let gallery = naturalGalleries[0];
                    let endOfGalleryAt = gallery.rootElement.offset().top + gallery.rootElement.height() + 60;

                    // Avoid to expand gallery if we are scrolling up
                    let current_scroll_top = $(document).scrollTop();
                    let window_size = $(window).height();//document.body.clientHeight;
                    let scroll_delta = current_scroll_top - self.old_scroll_top;
                    self.old_scroll_top = current_scroll_top;

                    // "enableMoreLoading" is a setting coming from the BE bloking / enabling dynamic loading of thumbnail
                    if (scroll_delta > 0 && current_scroll_top + window_size > endOfGalleryAt) {
                        // When scrolling only add a row at once
                        naturalGalleries[0].addElements(1);
                    }
                });
            }

        }
    }

}

