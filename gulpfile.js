var gulp = require('gulp');
var concat = require('gulp-concat');
const { watch, series, parallel } = require('gulp');


/**
 * ------------------------------------
 * Config
 * ------------------------------------
 */
var config = {
    paths: {
        js: {
            src: 'app/js',
            lib: 'app/lib'
        }
    },
    files: {
        js: {
            src: 'app/js/**/*.js',
            lib: 'app/lib/**/*.js',
            srcOutput: 'production.js',
            libOutput: 'vendor.js'
        }
    }
};


/**
 * ------------------------------------
 * Build functions
 * ------------------------------------
 */
function buildDev() {
    lintJs();
    compileJs();
}
function buildProd() {
    compileJs();
    minifyJs();
}
function watchFiles() {
    watch([
        config.files.js.src,
        config.files.js.lib,
        '!'+config.paths.js.src+'/'+config.files.js.srcOutput,
        '!'+config.paths.js.lib+'/'+config.files.js.libOutput
    ], series(lintJs, compileJs));
}


/**
 * ------------------------------------
 * Export tasks
 * ------------------------------------
 */
if (process.env.NODE_ENV === 'production') {
    exports.default = buildProd;
}
else {
    exports.default = buildDev;
    exports.watch = watchFiles;
}


/**
 * ------------------------------------
 * Individual build tasks
 * ------------------------------------
 */
function lintJs() {
    // TODO
    return Promise.resolve();
}
function compileJs() {
    gulp.src([config.files.js.src, '!'+config.paths.js.src+'/'+config.files.js.srcOutput])
        .pipe(concat(config.files.js.srcOutput))
        .pipe(gulp.dest(config.paths.js.src));

    gulp.src([config.files.js.lib, '!'+config.paths.js.src+'/'+config.files.js.libOutput])
        .pipe(concat(config.files.js.libOutput))
        .pipe(gulp.dest(config.paths.js.lib));

    return Promise.resolve();
}
function minifyJs() {
    // TODO
    return Promise.resolve();
}

/**
 * ------------------------------------
 * Utility functions
 * ------------------------------------
 */
function log(msg) {
    // if (typeof(msg) === 'object') {
    //     for (var item in msg) {
    //         if (msg.hasOwnProperty(item)) {
    //             $.util.log($.util.colors.green(msg[item]));
    //         }
    //     }
    // } else {
    //     $.util.log($.util.colors.green(msg));
    // }
}
