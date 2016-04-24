'use strict';

var gulp = require('gulp');

var referenceFileName = 'references.ts';
gulp.task('browserify', ['tsc', 'compile-js']);

gulp.task('references', function() {
    var config = require('../config');
    var mixer = require('../util/typing-references');

    var src = config.scripts.src.concat([config.browserify.typings + '/tsd.d.ts']);

    return gulp
        .src(src)
        .pipe(mixer(referenceFileName))
        .pipe(gulp.dest(config.browserify.typings));
});

gulp.task('tsc', function() {
    var config = require('../config');
    var ts = require('gulp-typescript');
    var tsResult = gulp.src(config.browserify.entries).pipe(ts({out: 'build.js', target:'es5'}));
    return tsResult.js.pipe(gulp.dest(config.browserify.tmp));
});

gulp.task('compile-js', function() {

    var config = require('../config');
    var handleErrors = require('../util/handleErrors');

    var source = require('vinyl-source-stream');
    var streamify = require('gulp-streamify');
    var browserify = require('browserify');
    var uglify = require('gulp-uglify');
    var browserSync = require('browser-sync');

    var bundler = browserify({
        entries: config.browserify.tmp + '/build.js',
        debug: true,
        cache: {},
        packageCache: {},
        fullPaths: !global.isProd
    });

    var stream = bundler.bundle();

    stream.on('error', handleErrors)
          .pipe(source(config.bundleName + '.js'))
          .pipe(gulp.dest(config.scripts.dest));

    return stream
        .on('error', handleErrors)
        .pipe(source(config.bundleName + '.min.js'))
        .pipe(streamify(uglify({
            compress: {drop_console: true}
        })))
        .pipe(gulp.dest(config.scripts.dest))
        .pipe(browserSync.stream({once: true}));

});

