///<reference path="../cache/references.ts"/>

declare var require: (moduleId: string) => any;
declare var naturalGalleries: any[];

// lodash
let differenceBy = require('lodash/differenceBy'); // 126
let intersectionBy = require('lodash/intersectionBy'); //  126
let uniqBy = require('lodash/uniqBy'); // 122
let filter = require('lodash/filter'); // 121
let find = require('lodash/find'); // 121

let PhotoSwipe = require('PhotoSwipe');
let PhotoSwipeUI_Default = require('../node_modules/photoswipe/dist/photoswipe-ui-default');

let naturalGalleryController = new Natural.Gallery.Controller();
