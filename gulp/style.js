var sass = require('gulp-sass')
var exec = require('child_process').exec

module.exports = function (gulp, reload) {
  exec('cp ./node_modules/leaflet-routing-machine/css/leaflet-routing-machine.css ./public/leaflet-routing-machine.css')
  exec('cp ./node_modules/leaflet-routing-machine/css/leaflet.routing.icons.png ./public/leaflet.routing.icons.png')
  exec('cp ./node_modules/leaflet-routing-machine/css/leaflet.routing.icons.svg ./public/leaflet.routing.icons.svg')
  exec('cp ./node_modules/leaflet-routing-machine/css/routing-icon.png ./public/routing-icon.png')
  gulp.task('style', function () {
    gulp.src('./src/css/**/*.scss')
      .pipe(sass())
      .pipe(gulp.dest('./public'))
      .pipe(reload())
  })
}
