var gulp = require('gulp');
var less = require('gulp-less');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var watch = require('gulp-watch');

gulp.task('default', ['js:src', 'js:lib']);
gulp.task('watch', function() {
    gulp.watch('./app/js/**/*.js', ['js:lib', 'js:src']);
});

/**
 * Concatenates all LESS files in css/src then compiles into css/production.css
 * and finally minifies CSS
 */
// gulp.task('css', function() {
//     return gulp.src('./css/src/*.less')
//         .pipe(concat('production.less'))
//         .pipe(gulp.dest('./css'))
//         .pipe(less('production.css'))
//         .pipe(gulp.dest('./css'))
// });

/**
 * Concatenates all JS files
 */
gulp.task('js:src', function() {
    return gulp.src(['app/js/modules/*.js', 'app/js/*.js', '!app/js/production.js'])
        .pipe(concat('production.js'))
        .pipe(gulp.dest('app/js/'))
});

/**
 * Concatenates vendor JS files in /app/lib/
 */
gulp.task('js:lib', function() {
    return gulp.src(['app/lib/*.js', '!app/lib/vendor.js'])
        .pipe(concat('vendor.js'))
        .pipe(gulp.dest('app/lib/'))
});
