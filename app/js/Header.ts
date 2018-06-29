import { Utility } from './Utility';

export class Header {

    private element: Element;

    public constructor(private labelImages: string) {
    }

    public render(): Element {

        let imagesLayout = document.createElement('div');
        imagesLayout.classList.add('natural-gallery-images', 'sectionContainer');
        imagesLayout.appendChild(Utility.getIcon('icon-pict'));

        let sectionName = document.createElement('div');
        sectionName.classList.add('sectionName');
        sectionName.textContent = this.labelImages;
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

}
