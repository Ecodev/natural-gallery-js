import { Utility } from './Utility';

export class Header {

    /**
     * Header element reference
     */
    private element: Element;

    /**
     * Element reference for actual number of visible items
     * @type {null}
     */
    private galleryVisible: HTMLElement = null;

    /**
     * Element reference for actual number of collection items
     * @type {null}
     */
    private galleryTotal: HTMLElement = null;

    /**
     * Element reference for items counts
     * @type {null}
     */
    private imageContainer: HTMLElement = null;

    public constructor(private labelImages: string) {
    }

    public render(): Element {

        this.imageContainer = document.createElement('div');
        this.imageContainer.classList.add('natural-gallery-images', 'sectionContainer');
        this.imageContainer.appendChild(Utility.getIcon('icon-pict'));

        let sectionName = document.createElement('div');
        sectionName.classList.add('sectionName');
        sectionName.textContent = this.labelImages;
        this.imageContainer.style.display = 'block';
        this.imageContainer.appendChild(sectionName);

        this.galleryVisible = document.createElement('span');
        this.imageContainer.appendChild(this.galleryVisible);

        this.galleryVisible.classList.add('natural-gallery-visible');
        let slash = document.createElement('span');
        slash.textContent = '/';
        this.imageContainer.appendChild(slash);

        this.galleryTotal = document.createElement('span');
        this.galleryTotal.classList.add('natural-gallery-total');
        this.imageContainer.appendChild(this.galleryTotal);

        this.element = document.createElement('div');
        this.element.classList.add('natural-gallery-header');
        this.element.appendChild(this.imageContainer);

        return this.element;
    }

    public updateVisibleImages(visible: number) {
        if (this.galleryVisible) {
            this.galleryVisible.textContent = String(visible);
        }
    }

    public updateTotalImages(total: number) {
        if (this.galleryTotal) {
            this.galleryTotal.textContent = String(total);
        }
    }

}
