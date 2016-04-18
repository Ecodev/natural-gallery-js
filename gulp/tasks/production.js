'use strict';

var gulp = require('gulp');

gulp.task('prod', ['clean'], function(cb) {

    var runSequence = require('run-sequence');

    cb = cb || function() {
    };

    global.isProd = true;

    runSequence(['styles', 'browserify'], cb);

});
