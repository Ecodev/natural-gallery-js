var gulp = require('gulp');

var uglify = require('gulp-uglify');
var cssnano = require('gulp-cssnano');
var concat = require('gulp-concat');
var flatten = require('gulp-flatten');
var watch = require('gulp-watch');
var browserSync = require('browser-sync');

var paths = {
    scripts: 'src/**/*.js',
    styles: 'src/css/*.css',
    themes: 'src/css/*/*.css',
    images: ['src/**/*.gif','src/**/*.jpg','src/**/*.jpeg','src/**/*.png'],
    dest: 'dist'
};

gulp.task('scripts', function() {
    return gulp.src(paths.scripts)
               .pipe(uglify())
               .pipe(concat('natural-gallery.min.js'))
               .pipe(gulp.dest(paths.dest));
});

gulp.task('styles', function() {

    gulp.src(paths.themes)
        .pipe(gulp.dest(paths.dest));

    return gulp.src(paths.styles)
               .pipe(cssnano())
               .pipe(concat('natural-gallery.min.css'))
               .pipe(gulp.dest(paths.dest));
});

gulp.task('images', function() {
    return gulp.src(paths.images)
               .pipe(flatten())
               .pipe(gulp.dest(paths.dest));
});

gulp.task('bs', function () {
    browserSync({
        proxy: 'natural-gallery.lan/demo'
    });
});

gulp.task('reload', function () {
    browserSync.reload();
});

gulp.task('build', ['scripts', 'styles', 'images']);

gulp.task('live', ['build', 'bs', 'watch']);

gulp.task('watch', ['build'], function () {

    // Source files
    gulp.watch(paths.styles, ['styles', 'reload']);
    gulp.watch(paths.themes, ['styles', 'reload']);
    gulp.watch(paths.scripts, ['scripts', 'reload']);

    // Demo files
    gulp.watch('demo/*.html', ['reload']);
    gulp.watch('demo/*.css', ['reload']);

});

