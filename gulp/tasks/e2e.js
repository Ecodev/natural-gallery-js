'use strict';

var gulp = require('gulp');
var webdriver = require('gulp-protractor').webdriver;
var webdriverUpdate = require('gulp-protractor').webdriver_update;

gulp.task('webdriver-update', webdriverUpdate);
gulp.task('webdriver', webdriver);

gulp.task('e2e', ['webdriver-update', 'webdriver'], function(cb) {

    var config = require('../config');
    var protractor = require('gulp-protractor').protractor;

    gulp.src('tests/e2e/**/*.js').pipe(protractor({
        configFile: config.tests.protractor
    })).on('error', function(err) {
        // Make sure failed tests cause gulp to exit non-zero
        throw err;
    }).on('end', function() {
        process.exit();
        cb();
    });

});