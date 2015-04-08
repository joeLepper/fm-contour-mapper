module.exports = function (gulp, reload) {
  var app = require('../app')
  var server

  gulp.task('server', function () { server = app(reload) })
  gulp.task('kill-server', function () { if (typeof server !== 'undefined') app.kill(server) })
}
