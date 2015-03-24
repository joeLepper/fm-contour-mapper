var browserify = require('browserify')
var watchify = require('watchify')
var babelify = require('babelify')
var source = require('vinyl-source-stream')
var buffer = require('vinyl-buffer')
var gutil = require('gulp-util')

var bundler = watchify(browserify(watchify.args))

module.exports = function (gulp, reload) {
  bundler.add('./index.js')
  bundler.on('update', bundle)
  bundler.on('log', gutil.log)

  bundler.transform('brfs')

  gulp.task('script', bundle)

  function bundle () {
    return bundler.transform(babelify).bundle()
      .on('error', gutil.log.bind(gutil, 'Browserify Error'))
      .pipe(source('./index.js'))
      .pipe(buffer())
      .pipe(gulp.dest('./public'))
      .pipe(reload())
  }
}
