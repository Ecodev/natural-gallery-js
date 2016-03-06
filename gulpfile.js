var gulp = require('gulp');

var uglify = require('gulp-uglify');
var cssnano = require('gulp-cssnano');
var concat = require('gulp-concat');
var flatten = require('gulp-flatten');
var watch = require('gulp-watch');
var browserSync = require('browser-sync');
var handleErrors = require('./gulp/handleErrors');

var paths = {
    scripts: 'src/**/*.js',
    styles: 'src/css/*.css',
    themes: 'src/css/*/*.css',
    images: ['src/**/*.gif','src/**/*.jpg','src/**/*.jpeg','src/**/*.png'],
    dest: 'dist'
};

/**
 * Javascript
 */
gulp.task('scripts', function() {
    return gulp.src(paths.scripts)
               .pipe(uglify().on('error', handleErrors))
               .pipe(concat('natural-gallery.min.js'))
               .pipe(gulp.dest(paths.dest));
});

/**
 * Stylesheets
 */
gulp.task('styles', function() {

    gulp.src(paths.themes)
        .pipe(gulp.dest(paths.dest));

    return gulp.src(paths.styles)
               .pipe(cssnano().on('error', handleErrors))
               .pipe(concat('natural-gallery.min.css'))
               .pipe(gulp.dest(paths.dest));
});

/**
 * Images
 */
gulp.task('images', function() {
    return gulp.src(paths.images)
               .pipe(flatten())
               .pipe(gulp.dest(paths.dest));
});

/**
 * Browsersync
 */
gulp.task('bs', function () {
    browserSync({
        proxy: 'natural-gallery.lan/demo'
    });
});

gulp.task('refresh', function () {
    console.info('******************** REFRESH ***************************');
});

gulp.task('reload', function () {
    browserSync.reload();
});

gulp.task('build', ['scripts', 'styles', 'images']);
gulp.task('live', ['build', 'bs', 'watch']);
gulp.task('watch', ['build'], function () {

    // Source files
    gulp.watch(paths.styles, ['refresh', 'styles', 'reload']);
    gulp.watch(paths.themes, ['refresh', 'styles', 'reload']);
    gulp.watch(paths.scripts, ['refresh', 'scripts', 'reload']);

    // Demo files
    gulp.watch('demo/*.html', ['refresh', 'reload']);
    gulp.watch('demo/*.css', ['refresh', 'reload']);

});

