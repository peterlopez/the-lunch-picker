var gulp = require('gulp');
var less = require('gulp-less');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var watch = require('gulp-watch');

gulp.task('default', ['less', 'js']);

/**
 * Concatenates all LESS files in css/src then compiles into css/production.css
 * and finally minifies CSS
 */
gulp.task('css', function() {
    return gulp.src('./css/src/*.less')
        .pipe(concat('production.less'))
        .pipe(gulp.dest('./css'))
        .pipe(less('production.css'))
        .pipe(gulp.dest('./css'))
});

/**
 * Concatenates all JS files in js/src then sandwiches them between
 * js/intro.js and js/outro.js to make production.js
 * and finally minifies JS
 */
gulp.task('js', function() {
    return gulp.src(['./app/js/js.cookie.js', './app/js/roulette.js', './app/js/yelp.js', './app/js/geolocation.js', './app/js/main.js'])
        .pipe(concat('production.js'))
        .pipe(gulp.dest('./app/js/'))
    // TODO: minify JS
});

gulp.task('watch', function() {
    gulp.watch('./app/js/*.js', ['js']);
});
