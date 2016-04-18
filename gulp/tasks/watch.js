'use strict';

var gulp = require('gulp');

gulp.task('refresh', function() {
    console.info('******************** REFRESH ***************************');
});

gulp.task('reload', function() {
    var browserSync = require('browser-sync');

    browserSync.reload();
});

gulp.task('watch', ['browserSync'], function() {
    var config = require('../config');

    // Scripts are automatically watched and rebundled by Watchify inside Browserify task
    gulp.watch(config.scripts.src, ['refresh', 'browserify']);
    gulp.watch(config.styles.sass, ['refresh', 'styles']);
    gulp.watch(config.styles.css, ['refresh', 'styles']);

    // Demo files
    gulp.watch('demo/*.html', ['refresh', 'reload']);
    gulp.watch('demo/*.css', ['refresh', 'reload']);

});
