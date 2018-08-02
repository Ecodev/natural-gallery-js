var gallery;
var rowHeight = 400;
var lastSearch;

// Gallery options
var options = {
    rowHeight: rowHeight
};

window.addEventListener('load', function() {
    var galleryElement = document.getElementById('gallery');
    var photoswipeElement = document.getElementsByClassName('pswp')[0];
    var searchElement = document.getElementById('search');
    var suggestions = document.getElementsByClassName('suggestion');

    gallery = new NaturalGallery.Gallery(galleryElement, photoswipeElement, options);

    gallery.addEventListener('pagination', function(ev) {
        var currentPagination = ev.detail;
        var page = Math.ceil(currentPagination.offset / currentPagination.limit) + 1;
        search(lastSearch, page, currentPagination.limit);
    });

    searchElement.addEventListener('keydown', function(e) {
        if (e.keyCode === 27) {
            searchElement.value = '';
        }
    });

    searchElement.addEventListener('change', function(e) {
        lastSearch = e.target.value;
        gallery.clear();
    });

    for (var i = 0; i < suggestions.length; i++) {
        suggestions[i].addEventListener('click', function(e) {
            lastSearch = e.target.getAttribute('value');
            searchElement.value = e.target.getAttribute('value');
            gallery.clear();
        });
    }

});

function search(term, page, perPage) {

    if (!term) {
        getImages();
        return;
    }

    var url = 'https://api.unsplash.com/search/photos?client_id=04902b80294822aa86dbe5c57ee47e1c1f0e8a0f0f360979746970a1239001dd';

    term = encodeURIComponent(term);
    url += '&query=' + term;
    url += '&per_page=' + perPage;
    url += '&page=' + page;

    getImages(url);
}

function getImages(url) {

    if (!url) {
        url = 'assets/images.json';
    }

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

            gallery.addItems(items);
        }
    };
}

