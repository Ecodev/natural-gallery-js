'use strict';

var gulp = require('gulp');

gulp.task('lint', ['lint-ts', 'lint-js']);

gulp.task('lint-ts', function() {

    var config = require('../config');
    var tslint = require('gulp-tslint');

    return gulp.src(config.scripts.src)
            .pipe(tslint())
            .pipe(tslint.report('prose'));
});

gulp.task('lint-js', function() {

    var jshint = require('gulp-jshint');
    return gulp.src(['*.js', 'gulp/**/*.js', 'tests/**/*.js'])
            .pipe(jshint())
            .pipe(jshint.reporter('jshint-stylish'));
});