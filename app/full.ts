import './styles/themes/natural.css';
import './styles/natural-gallery.full.scss';
import { Controller } from './js/Controller';
import { NaturalGallery } from './app';

declare let naturalGalleries: any[];
if (typeof naturalGalleries !== 'undefined' && naturalGalleries.constructor === Array) {
    Controller.getInstance().addGalleries(naturalGalleries);
}

export { NaturalGallery };
