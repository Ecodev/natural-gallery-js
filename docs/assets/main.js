var gallery;
var rowHeight = 400;

window.addEventListener('load', function() {
    gallery = getGallery('gallery');
    search();

    document.getElementById('search').addEventListener('change', function(e) {
        search(e)
    });

});

// Gallery options
var options = {
    rowHeight: rowHeight,
};

function getGallery(id) {
    var galleryElement = document.getElementById(id);
    var photoswipeElement = document.getElementsByClassName('pswp')[0];
    return new NaturalGallery.Gallery(galleryElement, photoswipeElement, options);
}

function search(event = {target: {value: 'milky way'}}) {
    const searched = encodeURIComponent(event.target.value);
    // getImages('https://api.unsplash.com/search/photos?client_id=04902b80294822aa86dbe5c57ee47e1c1f0e8a0f0f360979746970a1239001dd&per_page=30&query=' + searched);
    getImages();
}

function getImages(url) {

    if (!url) {
        // url = '/assets/images.json';
        url = defaultImagesUrl;
    }
    console.log('url', url)

    var xhr = new XMLHttpRequest();
    xhr.open('GET', url);
    xhr.send(null);
    xhr.onreadystatechange = function() {
        if (xhr.readyState === 4 && xhr.status === 200) {

            var items = JSON.parse(xhr.responseText).results.map(function(i) {
                return {
                    thumbnailSrc: i.urls.small,
                    thumbnailWidth: rowHeight * i.width / i.height,
                    thumbnailHeight: rowHeight,
                    enlargedSrc: i.urls.full,
                    enlargedWidth: i.width,
                    enlargedHeight: i.height,
                    title: i.description ? i.description : i.user.name,
                };
            });

            gallery.setItems(items);
        }
    };
}

