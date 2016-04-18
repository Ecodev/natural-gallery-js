///<reference path="references.ts"/>

declare var require: (moduleId: string) => any;
declare var naturalGalleries: any;
declare var $: any;

let PhotoSwipe = require('PhotoSwipe');
let PhotoSwipeUI_Default = require('../node_modules/photoswipe/dist/photoswipe-ui-default');

let naturalGallery = new Natural.Gallery.Core();

console.log(naturalGallery);
