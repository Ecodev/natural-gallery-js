var gallery;
var lastSearch;
var loadingBar;

window.addEventListener('load', function() {
    var galleryElement = document.getElementById('gallery');
    var photoswipeElement = document.getElementsByClassName('pswp')[0];
    var scrollableElement = document.getElementById('body');
    var searchElement = document.getElementById('search');
    var suggestions = document.getElementsByClassName('suggestion');
    loadingBar = document.getElementById('loadingBar');

    // Create gallery
    gallery = getGallery(galleryElement, photoswipeElement, scrollableElement);
    gallery.init();

    gallery.addEventListener('pagination', function(ev) {
        console.warn('pagination', ev.detail);
        var currentPagination = ev.detail;
        var page = Math.ceil(currentPagination.offset / currentPagination.limit) + 1;
        search(lastSearch, page, currentPagination);
    });

    gallery.addEventListener('activate', function(ev) {
        console.log('activate', ev.detail);
    });

    gallery.addEventListener('item-displayed', function(ev) {
        console.log('item-displayed', ev.detail);
    });

    gallery.addEventListener('item-added-to-dom', function(ev) {
        console.log('item-added-to-dom', ev.detail);
    });

    gallery.addEventListener('zoom', function(ev) {
        console.log('zoom', ev.detail);
    });

    gallery.addEventListener('select', function(ev) {
        console.log('select', ev.detail);
    });

    searchElement.addEventListener('change', function(e) {
        newSearch(e.target.value);
    });

    searchElement.addEventListener('keydown', function(e) {
        if (e.keyCode === 27) {
            searchElement.value = '';
            newSearch();
        }
    });

    for (var i = 0; i < suggestions.length; i++) {
        suggestions[i].addEventListener('click', function(e) {
            searchElement.value = e.target.getAttribute('value');
            newSearch(e.target.getAttribute('value'));
        });
    }

});

function newSearch(term) {
    lastSearch = term;
    gallery.clear();
}

function search(term, page, currentPagination) {

    if (!term) {
        getImages(null, currentPagination);
        return;
    }

    var url = 'https://api.unsplash.com/search/photos?client_id=04902b80294822aa86dbe5c57ee47e1c1f0e8a0f0f360979746970a1239001dd';

    term = encodeURIComponent(term);
    url += '&query=' + term;
    url += '&per_page=' + currentPagination.limit;
    url += '&page=' + page;

    getImages(url);
}

function getImages(url, paginationEvent) {

    if (!url) {
        url = 'assets/images.json';
    }

    var xhr = new XMLHttpRequest();
    xhr.open('GET', url);

    loadingBar.classList.add('loading');
    xhr.addEventListener('readystatechange', function() {

        var limit = xhr.getResponseHeader('x-ratelimit-remaining');
        if (xhr.readyState === 4) {
            loadingBar.classList.remove('loading');
        }

        if (xhr.readyState === 4 && (xhr.status !== 200 || limit != null && limit <= 0)) {
            newSearch();
            document.getElementById('searchZone').style.display = 'none';
            document.getElementById('rateExpired').style.display = 'block';

        } else if (xhr.readyState === 4 && xhr.status === 200) {

            var results = JSON.parse(xhr.responseText).results;
            if (paginationEvent) {
                results = results.slice(paginationEvent.offset, paginationEvent.offset + paginationEvent.limit);
            }

            var items = results.map(function(i) {
                return {
                    thumbnailSrc: i.urls.small,
                    enlargedSrc: i.urls.regular,
                    enlargedWidth: i.width,
                    enlargedHeight: i.height,
                    title: i.description ? i.description : i.user.name,
                    color: i.color
                };
            });

            gallery.addItems(items);
        }
    });

    xhr.send(null);
}
