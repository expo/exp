var gulp = require('gulp');
var babel = require('@exponent/gulp-babel');
var changed = require('gulp-changed');
var plumber = require('gulp-plumber');
var sourcemaps = require('gulp-sourcemaps');
var watch = require('gulp-watch');

var paths = {
  dest: 'build',
  sourceMaps: 'sourcemaps',
};

gulp.task('babel', function() {
  var src = 'src/**/*.js';
  return gulp.src(src)
    .pipe(plumber())
    .pipe(watch(src))
    .pipe(changed(paths.dest))
    .pipe(sourcemaps.init())
    .pipe(babel({
      stage: 1,
      blacklist: [
        'es6.constants',
        'es6.forOf',
        'es6.spec.symbols',
        'es6.spec.templateLiterals',
        'es6.templateLiterals',
      ],
      optional: [
        'asyncToGenerator',
        'runtime',
      ],
    }))
    .pipe(sourcemaps.write(paths.sourceMaps))
    .pipe(plumber.stop())
    .pipe(gulp.dest(paths.dest));
});


//gulp.task('coffee', function() {
//  return gulp.src('src/**/*.coffee')
//     .pipe(changed(paths.dest, {extension: '.js'}))
//     .pipe(sourcemaps.init())
//     .pipe(coffee({bare: true}))
//     .pipe(sourcemaps.write(paths.sourceMaps))
//     .pipe(gulp.dest(paths.dest));
// });

gulp.task('default', ['babel']);
