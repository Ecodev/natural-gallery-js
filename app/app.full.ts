import './styles/themes/natural.css';
import './styles/natural-gallery.full.scss';
import {Controller} from './js/Controller';

declare let naturalGalleries: any[];

if (typeof naturalGalleries !== 'undefined' && naturalGalleries.constructor === Array) {
    Controller.getInstance().addGalleries(naturalGalleries);
}

export function add(gallery) {
    return Controller.getInstance().addGallery(gallery);
}

export function getById(id) {
    Controller.getInstance().getById(id);
}
