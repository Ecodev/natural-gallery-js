import {Gallery} from './Gallery';

export class Controller {

    /**
     * Singleton
     * A single controller for rule them (galleries) all
     * @type Controller
     */
    private static instance: Controller = null;

    /**
     * Used to test the scroll direction
     * Avoid to load more images when scrolling up in the detection zone
     * @type {number}
     */
    private old_scroll_top = 0;

    private galleries: Gallery[] = [];
    private pswp: HTMLElement;

    public constructor() {
        this.bindEvents();
        this.pswp = <HTMLElement> document.getElementsByClassName('pswp')[0];
    }

    /**
     * Bootstrap galleries
     * For each gallery in the page, set a body container (dom element) and compute images sizes, then add elements to dom container
     */
    public addGalleries(galleries: any[] = null) {
        galleries.forEach(function(gallery, i) {
            galleries[i] = this.addGallery(gallery);
        }, this);
    }

    public addGallery(gallery: Gallery) {

        if (!gallery) {
            return;
        }

        gallery = new Gallery(gallery, this.pswp);
        this.galleries.push(gallery);
        return gallery;
    }

    public static getInstance() {
        return Controller.instance ? Controller.instance : new Controller();
    }

    public getById(id) {
        let found = null;
        this.galleries.forEach(function(gallery) {
            if (gallery.id == id) {
                found = gallery;
            }
        });

        return found;
    }

    /**
     * Check whetever we need to resize a gallery (only if parent container width changes)
     */
    private resize() {
        this.galleries.forEach(function(gallery: Gallery) {
            gallery.resize();
        });
    }

    /**
     * Bind generic events that are valid for all galleries like window scroll and resize
     */
    private bindEvents() {

        let self = this;

        /**
         * Gallery is paginated.
         * Pages can be added to the bottom of the gallery manually or on scroll
         * Allow scroll if there is only a single gallery on page and no limit specified
         * If the limit is specified, the gallery switch to manual mode.
         */
        document.addEventListener('scroll', function() {

            if (self.galleries.length == 1 && self.galleries[0].options.limit === 0) {
                let gallery = self.galleries[0];
                let endOfGalleryAt = gallery.rootElement.offsetTop + gallery.rootElement.offsetHeight + 60;

                // Avoid to expand gallery if we are scrolling up
                let current_scroll_top = (window.pageYOffset || document.documentElement.scrollTop)
                    - (document.documentElement.clientTop || 0);
                let window_size = window.innerHeight;

                let scroll_delta = current_scroll_top - self.old_scroll_top;
                self.old_scroll_top = current_scroll_top;

                // "enableMoreLoading" is a setting coming from the BE bloking / enabling dynamic loading of thumbnail
                if (scroll_delta > 0 && current_scroll_top + window_size > endOfGalleryAt) {
                    // When scrolling only add a row at once
                    self.galleries[0].addElements(1);
                }
            }
        });

    }
}


