var gulp = require('gulp');
var concat = require('gulp-concat');
var sass = require('gulp-sass');
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
        },
        css: {
            src: 'app/css'
        },
        sass: {
            src: 'app/sass'
        }
    },
    files: {
        js: {
            src: 'app/js/**/*.js',
            lib: 'app/lib/**/*.js',
            srcOutput: 'production.js',
            libOutput: 'vendor.js'
        },
        css: {
            src: 'production.scss',
            srcOutput: 'production.css'
        },
        sass: {
            src: 'app/sass/**/*.scss',
            srcOutput: 'production.scss'
        }
    }
};


/**
 * ------------------------------------
 * Build functions
 * ------------------------------------
 */
const buildDev = series(
    lintJs,
    compileJs,
    compileSass,
    compileSassToCss
);
const buildProd = series(
    compileJs,
    minifyJs
);
const watchFiles = parallel(
    watchSass,
    watchJs
);


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
function watchSass() {
    let files = config.files.sass;
    let paths = config.paths.sass;

    return watch([
        files.src,
        '!'+paths.src+'/'+files.srcOutput
    ], series(compileSass, compileSassToCss));
}
function watchJs() {
    let files = config.files.js;
    let paths = config.paths.js;

    return watch([
        config.files.js.src,
        config.files.js.lib,
        '!'+config.paths.js.src+'/'+config.files.js.srcOutput,
        '!'+config.paths.js.lib+'/'+config.files.js.libOutput
    ], series(lintJs, compileJs));
}
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
function compileSass() {
    let files = config.files.sass;
    let paths = config.paths.sass;

    return gulp.src([files.src, '!'+paths.src+'/'+files.srcOutput])
        .pipe(concat(files.srcOutput))
        .pipe(gulp.dest(paths.src));
}
function compileSassToCss() {
    let sasspaths = config.paths.sass;
    // CSS source file = compiled SASS file
    let cssfiles = config.files.css;
    let csspaths = config.paths.css;

    return gulp.src(sasspaths.src+'/'+cssfiles.src)
        .pipe(sass())
        .pipe(gulp.dest(csspaths.src));
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
