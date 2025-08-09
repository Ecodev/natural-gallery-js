export function setupDemoExtreme(galleryClass, options) {
    let gallery;

    window.addEventListener('load', function () {
        let galleryElement = document.getElementById("gallery");
        let scrollableElement = document.getElementById('body');

        // Create gallery
        gallery = new galleryClass(galleryElement, options, scrollableElement);
        getImages();
    });

    function getImages() {

        let xhr = new XMLHttpRequest();
        xhr.open('GET', 'assets/images.json');
        xhr.addEventListener('readystatechange', function () {

            if (xhr.readyState === 4 && xhr.status === 200) {

                let items = JSON.parse(xhr.responseText).results.map(function (i, index) {

                    let width = i.width;
                    let height = i.height;

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
}
