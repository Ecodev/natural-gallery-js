'use strict';

module.exports = {
    bundleName : 'natural-gallery',
    dist: {
        root: 'dist'
    },
    styles: {
        sass: 'app/**/*.scss',
        css: 'app/styles/themes/**/*.css',
        dest: 'dist',
        prodSourcemap: false
    },
    scripts: {
        src: ['app/**/*.ts'],
        dest: 'dist'
    },
    browsersync: {
        browserPort: 3000,
        UIPort: 3001,
        proxy: 'natural-gallery.lan/demo',
        host: 'natural-gallery.lan',
        open: 'external'
    },
    tests: {
        karma: 'tests/karma.conf.js',
        protractor: 'tests/protractor.conf.js'
    }
};
