'use strict';

var gulp = require('gulp');

gulp.task('styles', function() {
    var config = require('../config');
    var gulpif = require('gulp-if');
    var sourcemaps = require('gulp-sourcemaps');
    var sass = require('gulp-sass');
    var handleErrors = require('../util/handleErrors');
    var browserSync = require('browser-sync');
    var autoprefixer = require('gulp-autoprefixer');
    var rename = require('gulp-rename');

    var createSourcemap = !global.isProd || config.styles.prodSourcemap;

    gulp.src(config.styles.css)
        .pipe(autoprefixer('last 2 versions', '> 1%', 'ie 8'))
        .on('error', handleErrors)
        .pipe(rename({dirname: 'themes'}))
        .pipe(gulp.dest(config.styles.dest));

    return gulp.src(config.styles.sass)
               .pipe(gulpif(createSourcemap, sourcemaps.init()))
               .pipe(sass({
                   sourceComments: !global.isProd,
                   outputStyle: 'compressed'
               }))
               .pipe(autoprefixer('last 2 versions', '> 1%', 'ie 8'))
               .on('error', handleErrors)
               .pipe(gulpif(createSourcemap, sourcemaps.write(global.isProd ? './' : null)))
               .pipe(rename(config.bundleName + '.min.css'))
               .pipe(gulp.dest(config.styles.dest))
               .pipe(browserSync.stream({once: true}));

});
