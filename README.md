Natural Gallery
============================

Demos 
-----
* Default (lightbox + links + post-load javascript) : https://ecodev.ch/natural-gallery/demo
* Pre-loaded javascript : https://ecodev.ch/natural-gallery/demo/preload.html
* Photoswipe separated : https://ecodev.ch/natural-gallery/demo/light.html
* Multiple galleries in same page : https://ecodev.ch/natural-gallery/demo/many.html
* With links : https://ecodev.ch/natural-gallery/demo/link.html
* Links as html in title property: https://ecodev.ch/natural-gallery/demo/link-forged.html
* No lightbox but links : https://ecodev.ch/natural-gallery/demo/nolightbox-link.html
* No lightbox and no links : https://ecodev.ch/natural-gallery/demo/nolightbox-nolink.html

Use distribution on your project 
-----

The bower install does not include sources and build process. To run the demo, look at the end of this readme. 

Install natural-gallery-js :

```sh
npm install natural-gallery-js --save
```

Include photoswipe and natural gallery stylesheets + jquery script in your headers : 

```html
<link rel="stylesheet" href="[...]/photoswipe/dist/default-skin/default-skin.css">
<link rel="stylesheet" href="[...]/photoswipe/dist/photoswipe.css">
<link rel="stylesheet" href="[...]/natural-gallery/dist/themes/natural.css">
<link rel="stylesheet" href="[...]/natural-gallery/dist/natural-gallery.min.css">
<script src="[...]/jquery/dist/jquery.js"></script>
```

Includes natural gallery scripts in your footer (includes photoswipe JS): 

```html
<script src="[...]/natural-gallery/dist/natural-gallery.min.js"></script>
```

Run and look at the demo for code implementation
-----

Clone project on your local disk :

```sh
git clone git@github.com:Ecodev/natural-gallery.git 
cd natural-gallery
```

Install production and dev dependencies and run build :

```sh
npm install && npm run prod
```

Open demo/*.html with your preferred browser and editor.


Credits
============================

Icons made by [Freepik](http://www.freepik.com) and [Zurb](http://www.flaticon.com/authors/zurb) from [www.flaticon.com](http://www.flaticon.com) is licensed by [CC 3.0 BY](http://creativecommons.org/licenses/by/3.0/)
