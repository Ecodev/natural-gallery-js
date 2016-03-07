var gulp = require('gulp');

var handleErrors = require('./gulp/handleErrors');
var uglify = require('gulp-uglify');
var sass = require('gulp-sass');
var concat = require('gulp-concat');
var watch = require('gulp-watch');
var browserSync = require('browser-sync');
var rename = require("gulp-rename");
var autoprefixer = require('autoprefixer');
var postcss = require('gulp-postcss');

/**
 * Config
 */
var paths = {
    scripts: 'src/**/*.js',
    styles: 'src/css/*.scss',
    themes: 'src/css/*/*.css',
    images: ['src/**/*.gif', 'src/**/*.jpg', 'src/**/*.jpeg', 'src/**/*.png'],
    dest: 'dist',
    sourcemaps: 'maps',
    filename: 'natural-gallery'
};

/**
 * Javascript
 */
gulp.task('scripts', function() {
    return gulp.src(paths.scripts)
               .pipe(uglify().on('error', handleErrors))
               .pipe(concat(paths.filename + ".min.js"))
               .pipe(gulp.dest(paths.dest));
});

/**
 * Stylesheets
 */
gulp.task('styles', function() {

    gulp.src(paths.themes)
        .pipe(gulp.dest(paths.dest));

    return gulp.src(paths.styles)
               .pipe(sass({outputStyle:'compressed'}).on('error', sass.logError))
               .pipe(postcss([autoprefixer()]).on('error', handleErrors))
               .pipe(rename(paths.filename + ".min.css"))
               .pipe(gulp.dest(paths.dest));
});

/**
 * Browsersync
 */
gulp.task('bs', function() {
    browserSync({
        proxy: 'natural-gallery.lan/demo'
    });
});

/**
 * Refresh
 */
gulp.task('refresh', function() {
    console.info('******************** REFRESH ***************************');
});

gulp.task('reload', function() {
    browserSync.reload();
});

/**
 * Main tasks
 */
gulp.task('build', ['scripts', 'styles']);
gulp.task('live', ['build', 'bs', 'watch']);
gulp.task('watch', ['build'], function() {

    // Source files
    gulp.watch(paths.styles, ['refresh', 'styles', 'reload']);
    gulp.watch(paths.themes, ['refresh', 'styles', 'reload']);
    gulp.watch(paths.scripts, ['refresh', 'scripts', 'reload']);

    // Demo files
    gulp.watch('demo/*.html', ['refresh', 'reload']);
    gulp.watch('demo/*.css', ['refresh', 'reload']);

});

