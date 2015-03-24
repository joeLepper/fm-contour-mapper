var express = require('express')
var path = require('path')
var app = express()

module.exports = function (gulp, reload) {
  gulp.task('server', function () {
    app.use(express.static(path.join(__dirname, '../public')))
    app.listen(3000)
    reload.listen()
  })
}
