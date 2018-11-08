const gulp = require('gulp');
const concat = require('gulp-concat');
const rename = require('gulp-rename');
const log = require('fancy-log');


const sass = require('gulp-sass');
const cleanCSS = require('gulp-clean-css');

const minify = require('gulp-minify');

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
            lib: null,           // include each library individually
        },
        css: {
            src: 'app/css',
            lib: 'app/lib'
        },
        sass: {
            src: 'app/sass'
        }
    },
    files: {
        js: {
            src: 'app/js/**/*.js',
            srcOutput: 'production.js',         // output of compilation before compression
            compressed: 'production.min.js'
        },
        css: {
            src: 'production.scss',
            srcOutput: 'production.css',        // output of trans-compilation of SASS to CSS
            compressed: 'production.min.css',
            lib: 'app/lib/**/*.css',
            libOutput: 'vendor.css'             // expect already compressed library files
        },
        sass: {
            src: 'app/sass/**/*.scss',
            srcOutput: 'production.scss'        // output of all SASS file compilation
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
    compileSassToCss,
    compileVendorCss
);
const buildProd = series(
    minifyJs,
    minifyCss
);
const watchFiles = parallel(
    watchSass,
    watchJs
);


/**
 * ------------------------------------
 * Exported tasks - available with gulp {task}
 * ------------------------------------
 */
if (process.env.NODE_ENV === 'production') {
    exports.default = buildProd;
}
else {
    exports.default = buildDev;
    exports.watch = watchFiles;
    exports.minify = buildProd;
}


/**
 * ------------------------------------
 * Individual build tasks
 * ------------------------------------
 */
//
// SASS / CSS
//
function watchSass() {
    let files = config.files.sass;
    let paths = config.paths.sass;

    return watch([
        files.src,
        '!'+paths.src+'/'+files.srcOutput
    ], series(compileSass, compileSassToCss, compileVendorCss));
}
function compileVendorCss() {
    let files = config.files.css;
    let paths = config.paths.css;

    return gulp.src([files.lib, '!'+paths.lib+'/'+files.libOutput])
        .pipe(concat(files.libOutput))
        .pipe(gulp.dest(paths.lib));
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
        .pipe(gulp.dest(csspaths.src))
        .on('finish', function() { setTimeout(function() {
            log('---- done with CSS ----');
            log('');
        }, 200) });
}
function minifyCss() {
    let files = config.files.css;
    let paths = config.paths.css;

    return gulp.src([paths.src+'/'+files.srcOutput])
        .pipe(cleanCSS({compatibility: 'ie8'}))
        .pipe(rename(files.compressed))
        .pipe(gulp.dest(paths.src));
}

//
// JS
//
function watchJs() {
    let files = config.files.js;
    let paths = config.paths.js;

    return watch([
        files.src,
        '!'+paths.src+'/'+files.srcOutput, // compiled
        '!'+paths.src+'/'+files.compressed, // minified
    ], series(lintJs, compileJs));
}
function lintJs() {
    return Promise.resolve();
}
function compileJs() {
    let files = config.files.js;
    let paths = config.paths.js;

    return gulp.src([
            files.src,
            '!'+paths.src+'/'+files.srcOutput,
            '!'+paths.src+'/'+files.compressed
        ])
        .pipe(concat(files.srcOutput))
        .pipe(gulp.dest(paths.src))
        .on('finish', function() { setTimeout(function() {
            log('---- done with JS ----');
            log('');
        }, 200) });
}
function minifyJs() {
    let files = config.files.js;
    let paths = config.paths.js;
    return gulp.src([paths.src + '/' + files.srcOutput])
        .pipe(minify({
            noSource: true,
            ext: {
                min:'.min.js'
            },
            compress: {
                sequences: false,  // join consecutive statemets with the “comma operator”
                properties: true,  // optimize property access: a["foo"] → a.foo
                dead_code: true,  // discard unreachable code
                drop_debugger: true,  // discard “debugger” statements
                unsafe: false, // some unsafe optimizations (see below)
                conditionals: true,  // optimize if-s and conditional expressions
                // comparisons: true,  // optimize comparisons
                // evaluate: true,  // evaluate constant expressions
                // booleans: true,  // optimize boolean expressions
                // loops: true,  // optimize loops
                // unused: true,  // drop unused variables/functions
                // hoist_funs: true,  // hoist function declarations
                // hoist_vars: false, // hoist variable declarations
                // if_return: true,  // optimize if-s followed by return/continue
                // join_vars: true,  // join var declarations
                // cascade: true,  // try to cascade `right` into `left` in sequences
                // side_effects: true,  // drop side-effect-free statements
                // warnings: true,  // warn about potentially dangerous optimizations/code
                // global_defs: {}     // global definitions
            }
        }))
        .pipe(gulp.dest(paths.src));
}

/**
 * ------------------------------------
 * Utility functions
 * ------------------------------------
 */
