var jade = require('gulp-jade')

module.exports = function (gulp, reload) {
  gulp.task('html', function () {
    gulp.src('./src/jade/index.jade')
      .pipe(jade())
      .pipe(gulp.dest('./public'))
      .pipe(reload())
  })
}
