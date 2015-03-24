var gulp = require('gulp')
var reload = require('gulp-livereload')
var fs = require('fs')

var tasks = fs.readdirSync('./gulp')
tasks.forEach(function (name) {
  require('./gulp/' + name)(gulp, reload)
})

gulp.task('watch', function () {
  gulp.watch(['./index.js', './src/**/*.js', './gulp/**/*.js', './gulpfile.js'], ['lint'])
  gulp.watch('./src/css/**/*.scss', ['style'])
  gulp.watch('./src/jade/**/*.jade', ['html'])
})

gulp.task('default', ['script', 'style', 'html', 'lint', 'server', 'watch'])
