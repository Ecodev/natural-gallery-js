'use strict';

var gulp = require('gulp');

gulp.task('tests', function() {
    var runSequence = require('run-sequence');
    return runSequence('unit', 'e2e');
});