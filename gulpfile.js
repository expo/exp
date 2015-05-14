var gulp = require('gulp');
var babel = require('@exponent/gulp-babel');

babel.task(gulp);

//gulp.task('coffee', function() {
//  return gulp.src('src/**/*.coffee')
//     .pipe(changed(paths.dest, {extension: '.js'}))
//     .pipe(sourcemaps.init())
//     .pipe(coffee({bare: true}))
//     .pipe(sourcemaps.write(paths.sourceMaps))
//     .pipe(gulp.dest(paths.dest));
// });

gulp.task('default', ['babel-watch']);
gulp.task('build', ['babel']);
