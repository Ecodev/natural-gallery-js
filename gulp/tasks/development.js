'use strict';

var gulp = require('gulp');

gulp.task('dev', ['clean'], function(cb) {

    var runSequence = require('run-sequence');

    cb = cb || function() {
    };

    global.isProd = false;

    runSequence(['styles', 'browserify'], 'watch', cb);

});
