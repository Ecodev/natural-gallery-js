var through = require('through2');
var gutil = require('gulp-util');

module.exports = function(outname, appFile) {
    "use strict";

    var paths = '';
    var nbPaths = 0;

    if (appFile === undefined) {
        appFile = '/app.ts';
    }

    var write = function(file, enc, cb) {
        if (file.path !== "undefined" && file.path.indexOf(appFile) === -1) {
            nbPaths++;
            paths += '///<reference path="' + relativizePath(file.path) + '" />\n';
        }
        cb();
    };

    var relativizePath = function(path) {
        var basedir = __dirname.replace('/gulp/util', '') + '/';

        path = path.replace(basedir, '../');

        return path;
    };

    var flush = function(cb) {

        gutil.log(gutil.colors.magenta("typing-references ") + gutil.colors.cyan(nbPaths) + " files into " + gutil.colors.magenta(outname));

        var newFile = new gutil.File({
            path: outname,
            contents: new Buffer(paths)
        });

        this.push(newFile);
        cb();
    };

    return through.obj(write, flush);
};
