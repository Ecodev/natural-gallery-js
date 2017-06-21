///<reference path="../cache/references.ts"/>

declare var require: (moduleId: string) => any;
declare var naturalGalleries: any[];

let PhotoSwipe = require('photoswipe');
let PhotoSwipeUI_Default = require('../node_modules/photoswipe/dist/photoswipe-ui-default');

let naturalGalleryController = new Natural.Gallery.Controller();
