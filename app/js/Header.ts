import { Gallery } from './Gallery';
import { Utility } from './Utility';

export class Header {

    private _element: Element;

    private _gallery: Gallery;

    /**
     * CONSTRUCTOR
     * @param gallery
     */
    public constructor(gallery: Gallery) {
        this.gallery = gallery;
    }

    public render(): Element {

        let imagesLayout = document.createElement('div');
        imagesLayout.classList.add('natural-gallery-images', 'sectionContainer');
        imagesLayout.appendChild(Utility.getIcon('icon-pict'));

        let sectionName = document.createElement('div');
        sectionName.classList.add('sectionName');
        sectionName.textContent = this.gallery.options.labelImages;
        imagesLayout.appendChild(sectionName);

        let galleryVisible = document.createElement('span');
        imagesLayout.appendChild(galleryVisible);

        galleryVisible.classList.add('natural-gallery-visible');
        let slash = document.createElement('span');
        slash.textContent = '/';
        imagesLayout.appendChild(slash);

        let total = document.createElement('span');
        total.classList.add('natural-gallery-total');
        imagesLayout.appendChild(total);

        this.element = document.createElement('div');

        this.element.classList.add('natural-gallery-header');
        this.element.appendChild(imagesLayout);

        return this.element;
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

}
