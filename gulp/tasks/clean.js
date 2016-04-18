'use strict';

var gulp = require('gulp');

gulp.task('clean', function(cb) {
    var config = require('../config');
    var del = require('del');

    del.sync([
        config.dist.root + '/*'
    ]);

    cb();
});
