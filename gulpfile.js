var gulp = require('gulp');
var babel = require('@exponent/gulp-babel');
var changed = require('gulp-changed');
var plumber = require('gulp-plumber');
var sourcemaps = require('gulp-sourcemaps');
var watch = require('gulp-watch');

babel.task(gulp);

//gulp.task('coffee', function() {
//  return gulp.src('src/**/*.coffee')
//     .pipe(changed(paths.dest, {extension: '.js'}))
//     .pipe(sourcemaps.init())
//     .pipe(coffee({bare: true}))
//     .pipe(sourcemaps.write(paths.sourceMaps))
//     .pipe(gulp.dest(paths.dest));
// });

gulp.task('default', ['babel']);
