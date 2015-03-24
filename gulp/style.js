var sass = require('gulp-sass')

module.exports = function (gulp, reload) {
  gulp.task('style', function () {
    gulp.src('./src/css/**/*.scss')
      .pipe(sass())
      .pipe(gulp.dest('./public'))
      .pipe(reload())
  })
}
