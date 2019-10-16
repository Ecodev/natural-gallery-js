var gallery;

window.addEventListener('load', function() {
    var galleryElement = document.getElementById('gallery');
    var photoswipeElement = document.getElementsByClassName('pswp')[0];
    var scrollableElement = document.getElementById('body');
    loadingBar = document.getElementById('loadingBar');

    // Create gallery
    gallery = getGallery(galleryElement, photoswipeElement, scrollableElement);
    getImages();
    gallery.init();
});

function getImages() {

    var xhr = new XMLHttpRequest();
    xhr.open('GET', 'assets/images.json');

    xhr.addEventListener('readystatechange', function() {

        if (xhr.readyState === 4 && xhr.status === 200) {

            var items = JSON.parse(xhr.responseText).results.map(function(i, index) {

                var width = i.width;
                var height = i.height;

                // Fake images sizes
                // each 5th image are vertically thin
                // each 7th image are horizontally thin
                if (index % 3 === 5) {
                    width /= 5;
                } else if (index % 7 === 0) {
                    height /= 5;
                }

                return {
                    thumbnailSrc: i.urls.small,
                    enlargedSrc: i.urls.regular,
                    enlargedWidth: width,
                    enlargedHeight: height,
                    title: i.description ? i.description : i.user.name,
                    color: i.color
                };
            });

            gallery.addItems(items);
        }
    });

    xhr.send(null);

}
