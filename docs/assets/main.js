export function setupDemo(galleryClass, options) {
    let gallery;
    let lastSearch;
    let loadingBar;

    window.addEventListener('load', function() {
        let galleryElement = document.getElementById('gallery');
        let scrollableElement = document.getElementById('body');
        let searchElement = document.getElementById('search');
        let suggestions = document.getElementsByClassName('suggestion');
        loadingBar = document.getElementById('loadingBar');

        // Create gallery
        gallery = new galleryClass(galleryElement, options, scrollableElement);
        gallery.init();

        if (options.lightbox) {
            gallery.photoSwipe.on('uiRegister', function() {
                gallery.photoSwipe.pswp.ui.registerElement({
                    name: 'test-button',
                    ariaLabel: 'Toggle zoom',
                    order: 9,
                    isButton: true,
                    html: 'zoom',
                    className: 'ng-custom-button',
                    onClick: (event, el) => {
                        console.log('event :', event, 'element :', el, 'selected model :', gallery.photoSwipeCurrentItem);
                        gallery.photoSwipe.pswp.toggleZoom();
                    }
                });
            });
        }

        gallery.addEventListener('pagination', function(ev) {
            console.warn('pagination', ev.detail);
            let currentPagination = ev.detail;
            let page = Math.ceil(currentPagination.offset / currentPagination.limit) + 1;
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

        for (let i = 0; i < suggestions.length; i++) {
            suggestions[i].addEventListener('click', function(e) {
                searchElement.value = e.target.getAttribute('value');
                newSearch(e.target.getAttribute('value'));
            });
        }

    });

    let isHover = true;

    function toggleLabels() {
        isHover = !isHover;
        gallery.setLabelHover(isHover);
    }

    function newSearch(term) {
        lastSearch = term;
        gallery.clear();
    }

    function search(term, page, currentPagination) {

        if (!term) {
            getImages(null, currentPagination);
            return;
        }

        let url = 'https://api.unsplash.com/search/photos?client_id=04902b80294822aa86dbe5c57ee47e1c1f0e8a0f0f360979746970a1239001dd';

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

        let xhr = new XMLHttpRequest();
        xhr.open('GET', url);

        loadingBar.classList.add('loading');
        xhr.addEventListener('readystatechange', function() {

            let limit = xhr.getResponseHeader('x-ratelimit-remaining');
            if (xhr.readyState === 4) {
                loadingBar.classList.remove('loading');
            }

            if (xhr.readyState === 4 && (xhr.status !== 200 || limit != null && limit <= 0)) {
                newSearch();
                document.getElementById('searchZone').style.display = 'none';
                document.getElementById('rateExpired').style.display = 'block';

            } else if (xhr.readyState === 4 && xhr.status === 200) {

                let results = JSON.parse(xhr.responseText).results;
                if (paginationEvent) {
                    results = results.slice(paginationEvent.offset, paginationEvent.offset + paginationEvent.limit);
                }

                let items = results.map(function(i) {
                    return {
                        thumbnailSrc: options.rowHeight ? i.urls.small.replace('w=400', 'h=' + options.rowHeight) : i.urls.small,
                        color: i.color,
                        enlargedSrc: i.urls.regular,
                        enlargedWidth: i.width,
                        enlargedHeight: i.height,
                        // link: 'https://example.com',
                        title: i.description ? i.description : i.user.name
                        // objectPosition: ['0% 0%', '100% 100%', undefined][Math.floor(Math.random() * 3)],
                        // objectFit: ['cover', 'contain', undefined][Math.floor(Math.random() * 3)],
                    };
                });

                gallery.addItems(items);
            }
        });

        xhr.send(null);
    }
}
