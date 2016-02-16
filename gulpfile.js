var gulp = require('gulp');

var uglify = require('gulp-uglify');
var cssnano = require('gulp-cssnano');
var concat = require('gulp-concat');
var flatten = require('gulp-flatten');


var paths = {
    scripts: 'src/**/*.js',
    styles: 'src/**/*.css',
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

gulp.task('build', ['scripts', 'styles', 'images']);
