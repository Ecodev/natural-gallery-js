'use strict';

var gulp = require('gulp');

gulp.task('unit', ['templates'], function(done) {
    var config = require('../config');
    var Server = require('karma').Server;

    new Server({
        configFile: process.cwd() + '/' + config.tests.karma,
        singleRun: true
    }, done).start();

});