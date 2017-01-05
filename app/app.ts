///<reference path="../cache/typings/references.ts"/>

declare var require: (moduleId: string) => any;
declare var naturalGalleries: any[];

_ = require('lodash');
let PhotoSwipe = require('PhotoSwipe');
let PhotoSwipeUI_Default = require('../node_modules/photoswipe/dist/photoswipe-ui-default');

let naturalGalleryController = new Natural.Gallery.Controller();
