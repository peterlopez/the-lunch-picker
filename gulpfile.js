const gulp = require('gulp');
const concat = require('gulp-concat');
const sass = require('gulp-sass');
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
 * Build processes
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
        files.src,
        files.lib,
        '!'+paths.src+'/'+files.srcOutput,
        '!'+paths.lib+'/'+files.libOutput
    ], series(lintJs, compileJs, compileVendorJs));
}
function lintJs() {
    // TODO
    return Promise.resolve();
}
function compileJs() {
    let files = config.files.js;
    let paths = config.paths.js;

    return gulp.src([files.src, '!'+paths.src+'/'+files.srcOutput])
        .pipe(concat(files.srcOutput))
        .pipe(gulp.dest(paths.src));
}
function compileVendorJs() {
    let files = config.files.js;
    let paths = config.paths.js;

    return gulp.src([files.lib, '!'+paths.src+'/'+files.libOutput])
        .pipe(concat(files.libOutput))
        .pipe(gulp.dest(config.paths.js.lib))
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
