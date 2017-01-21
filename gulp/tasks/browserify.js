'use strict';

var gulp = require('gulp');

var referenceFileName = 'references.ts';

gulp.task('references', function() {
    var config = require('../config');
    var tsconfig = require('../../tsconfig.json');
    var mixer = require('../util/typing-references');

    var src = config.scripts.src;

    return gulp
        .src(src)
        .pipe(mixer(referenceFileName))
        .pipe(gulp.dest(tsconfig.compilerOptions.outDir));
});

gulp.task('tsc', function() {
    var tsconfig = require('../../tsconfig.json');
    var ts = require('gulp-typescript');
    var tsProject = ts.createProject('tsconfig.json');
    var tsResult = tsProject.src().pipe(tsProject());
    return tsResult.js.pipe(gulp.dest('./'));
});

gulp.task('browserify', ['tsc'], function() {

    var config = require('../config');
    var tsconfig = require('../../tsconfig.json');
    var handleErrors = require('../util/handleErrors');

    var source = require('vinyl-source-stream');
    var streamify = require('gulp-streamify');
    var browserify = require('browserify');
    var uglify = require('gulp-uglify');
    var browserSync = require('browser-sync');

    var bundler = browserify({
        entries: tsconfig.compilerOptions.outFile,
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

