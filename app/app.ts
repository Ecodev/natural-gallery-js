import './styles/themes/natural.css';
import './styles/natural-gallery.light.scss';
import { Controller } from './js/Controller';
import { Gallery } from './js/Gallery';

declare let naturalGalleries: any[];

if (typeof naturalGalleries !== 'undefined' && naturalGalleries.constructor === Array) {
    Controller.getInstance().addGalleries(naturalGalleries);
}

export class NaturalGallery {

    public addGallery(item): Gallery {
        return Controller.getInstance().addGallery(item);
    }

}
