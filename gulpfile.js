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
let config = {
    buildDir: 'app/build',

    js: {
        src: 'app/js/**/*.js',
        output: 'production.js',
        compressed: 'production.min.js'
    },
    sass: {
        src: 'app/sass/**/*.scss',
        output: 'production.scss'           // output of all SASS file compilation
    },
    css: {
        src: null,                          // source is output of SASS task
        output: 'production.css',           // output of compilation of SASS to CSS
        compressed: 'production.min.css',

        lib: 'app/lib/**/*.css',
        libOutput: 'vendor.css'             // expect already compressed library files
    },
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
    exports.watch = series(buildDev, watchFiles);
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
    return watch(config.sass.src, series(compileSass, compileSassToCss, compileVendorCss));
}
function compileVendorCss() {
    return gulp.src(config.css.lib)
        .pipe(concat(config.css.libOutput))
        .pipe(gulp.dest(config.buildDir));
}
function compileSass() {
    return gulp.src(config.sass.src)
        .pipe(concat(config.sass.output))
        .pipe(gulp.dest(config.buildDir));
}
function compileSassToCss() {
    return gulp.src(config.buildDir + '/' + config.sass.output)
        .pipe(sass())
        .pipe(gulp.dest(config.buildDir))
        .on('finish', function() { setTimeout(function() {
            log('---- done with CSS ----');
            log('');
        }, 200) });
}
function minifyCss() {
    return gulp.src(config.buildDir + '/' + config.css.output)
        .pipe(cleanCSS({compatibility: 'ie8'}))
        .pipe(rename(config.css.compressed))
        .pipe(gulp.dest(config.buildDir));
}

//
// JS
//
function watchJs() {
    return watch(config.js.src, series(lintJs, compileJs));
}
function lintJs() {
    return Promise.resolve();
}
function compileJs() {
    return gulp.src(config.js.src)
        .pipe(concat(config.js.output))
        .pipe(gulp.dest(config.buildDir))
        .on('finish', function() { setTimeout(function() {
            log('---- done with JS ----');
            log('');
        }, 200) });
}
function minifyJs() {
    return gulp.src(config.buildDir + '/' + config.js.output)
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
        .pipe(gulp.dest(config.buildDir));
}

/**
 * ------------------------------------
 * Utility functions
 * ------------------------------------
 */
