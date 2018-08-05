import { GalleryOptions, ModelAttributes, ResponsiveGalleryOptions } from '../types';
import { AbstractGallery } from './AbstractGallery';

abstract class AbstractResponsiveGallery<Model extends ModelAttributes = any> extends AbstractGallery {

    /**
     * Default options
     * @private
     */
    protected options: ResponsiveGalleryOptions = {
        rowHeight: 400,
        gap: 3,
        rowsPerPage: 0,
        showLabels: 'hover',
        lightbox: true,
        minRowsAtStart: 2,
        showCount: false,
        selectable: false,
        activable: false,
        infiniteScrollOffset: 0,
        events: null,
    };

    /**
     *
     * @param elementRef
     * @param photoswipeElementRef
     * @param options
     * @param scrollElementRef
     */
    public constructor(elementRef: HTMLElement,
                       photoswipeElementRef: HTMLElement,
                       options: GalleryOptions,
                       scrollElementRef: HTMLElement = null) {

        super(elementRef, photoswipeElementRef, options, scrollElementRef);
        this.elementRef.classList.add('natural-gallery');
    }

    protected abstract getEstimatedItemsPerRow(width: number, defaultImageRatio: number, options: ResponsiveGalleryOptions): number;

    protected abstract getEstimatedRowsPerPage(): number;

    /**
     * Select all items visible in the DOM
     * Ignores buffered items
     */
    public selectVisibleItems() {
        this.visibleCollection.forEach((item) => item.select());
    }

    /**
     * Unselect all selected elements
     */
    public unselectAllItems() {
        this.visibleCollection.forEach((item) => item.unselect());
    }

    /**
     * Allows to use the same approach and method name to listen as gallery events on DOM or on javascript gallery object
     *
     * Gallery requests items when it's instantiated. But user may subscribe after creation, so we need to request again if
     * user subscribes by this function.
     *
     * @param name
     * @param callback
     */
    public addEventListener(name: string, callback: (ev) => void) {
        this.elementRef.addEventListener(name, callback);

        if (name === 'pagination') {
            this.requestItems();
        }
    }

}
