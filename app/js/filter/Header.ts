import {Item} from '../Item';
import {AbstractFilter} from './AbstractFilter';
import {Gallery} from '../Gallery';
import {Utility} from '../Utility';

export class Header {

    /**
     * Complete collection of filtered elements
     * Contains null or array
     * Null means no selection is active
     * Array means a selection is active, even if array is empty. Render empty
     * @type {Array}
     */
    private _collection: Item[] = null;

    private _element: Element;

    private _filters: AbstractFilter[] = [];

    private _gallery: Gallery;

    /**
     * CONSTRUCTOR
     * @param gallery
     */
    public constructor(gallery: Gallery) {
        this.gallery = gallery;

    }

    public addFilter(filter: AbstractFilter): void {
        this.filters.push(filter);
    }

    public refresh(): void {
        this.filters.forEach(function(filter) {
            filter.render();
        });
    }

    public render(): Element {

        let imagesLayout = document.createElement('div');
        Utility.addClass(imagesLayout, 'natural-gallery-images sectionContainer');
        imagesLayout.appendChild(Utility.getIcon('icon-pict'));

        let sectionName = document.createElement('div');
        Utility.addClass(sectionName, 'sectionName');
        sectionName.textContent = this.gallery.options.labelImages;
        imagesLayout.appendChild(sectionName);

        let galleryVisible = document.createElement('span');
        imagesLayout.appendChild(galleryVisible);

        Utility.addClass(galleryVisible, 'natural-gallery-visible');
        let slash = document.createElement('span');
        slash.textContent = '/';
        imagesLayout.appendChild(slash);

        let total = document.createElement('span');
        Utility.addClass(total, 'natural-gallery-total');
        imagesLayout.appendChild(total);

        this.element = document.createElement('div');

        this.filters.forEach(
            function(filter) {
                this.element.appendChild(filter.render());
            },
            this);

        Utility.addClass(this.element, 'natural-gallery-header');
        this.element.appendChild(imagesLayout);

        return this.element;
    }

    public isFiltered(): boolean {
        return this.collection !== null;
    }

    /**
     * Filter first by term, then by categories
     * @param gallery
     */
    public filter(): void {

        let filteredCollections = null;

        this.filters.forEach(function(filter: AbstractFilter) {
            if (filter.isActive()) {
                if (filteredCollections === null) {
                    filteredCollections = filter.collection;
                } else {
                    filteredCollections = Utility.intersectionBy(filteredCollections, filter.collection, 'id');
                }
            }
        });

        this.collection = filteredCollections; // @todo : do some intelligent things here
        this.gallery.refresh();
    }

    get collection(): Item[] {
        return this._collection;
    }

    set collection(value: Item[]) {
        this._collection = value;
    }

    get element(): Element {
        return this._element;
    }

    set element(value: Element) {
        this._element = value;
    }

    get gallery(): Gallery {
        return this._gallery;
    }

    set gallery(value: Gallery) {
        this._gallery = value;
    }

    get filters(): AbstractFilter[] {
        return this._filters;
    }

    set filters(value: AbstractFilter[]) {
        this._filters = value;
    }
}

