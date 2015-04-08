var http = require('http')
var express = require('express')
var bodyParser = require('body-parser')
var path = require('path')
var fetchContours = require('contour-fetcher')
var pointInPolygon = require('robust-point-in-polygon')
var bodyParser = require('body-parser')
var SSE = require('sse')
var stabPoly = require('./stab')
var ee = require('nee')()

module.exports = function (reload) {
  var app = express()
  var server = http.Server(app)

  app.use(express.static(path.join(__dirname, '../public')))

  fetchContours(function (err, db) {
    if (err) return console.log(err)

    app.use(bodyParser.urlencoded({ extended: true }))
    app.use(bodyParser.json())

    app.use('/api', initRouter(express.Router()))
    server.listen(3000, '127.0.0.1', function () {
      console.log('called back this time')
      var sse = new SSE(server)
      sse.on('connection', function (client) {
        ee.on('successful-stabbing', function (contour) {
          client.send(JSON.stringify(contour))
        })
      })
    })

    reload.listen()

    function initRouter (router) {
      router.use(bodyParser.json())
      router.route('/find_by_point').get(findByPoint)
      router.route('/find_by_waypoints').post(findByWaypoints)
      return router
    }

    function findByPoint (req, res) {
      var start = Date.now()
      var localContours = []
      var point = [+req.query.lat, +req.query.lng]
      var streamParams = (
        { gte: 'lat~' + Math.floor(point[0] - 2),
          lte: 'lat~' + Math.ceil(point[0] + 2)
        }
      )

      db.createValueStream(streamParams).on('data', function (contourData) {
        var contour = contourData.geometry.coordinates.slice(0, 360)
        var inBounds = pointInPolygon(contour, point) !== 1

        if (inBounds) localContours.push(contourData)
      }).on('close', function () {
        console.log('stream closed at ' + (Date.now() - start))
        res.json(localContours)
      })
    }

    function findByWaypoints (req, res) {
      var waypoints = req.body.waypoints
      var range = waypoints.reduce(function (acc, waypoint) {
        if (typeof acc[0] === 'undefined') return [waypoint.lat, waypoint.lat]
        return [waypoint.lat < acc[0] ? waypoint.lat : acc[0], waypoint.lat > acc[1] ? acc[1] : waypoint.lat]
      }, [])

      console.log(range)

      var streamParams = (
        { gte: 'lat~' + Math.floor(range[0] - 2),
          lte: 'lat~' + Math.ceil(range[1] + 2)
        }
      )

      db.createValueStream(streamParams).on('data', function (contourData) {
        var contourPoints = contourData.geometry.coordinates.slice(0, 360)
        var boundingPoints = contourPoints.reduce(getBoundingPoints, { x: {}, y: {} })
        var boundingLines = getBoundingLines(boundingPoints)
        var intersects = stabPoly(waypoints, boundingLines)

        if (intersects) ee.emit('successful-stabbing', [contourData])

      }).on('close', function () {
        console.log('stream closed.')
      })

      res.status(200).send()
    }
  })
  return server
}

module.exports.kill = function (server) {
  server.close()
}

function getBoundingPoints (acc, point) {
  return (
    { x: { min: point[0] < acc.x.min ? acc.x.min : point[0], max: point[0] > acc.x.max ? acc.x.max : point[0] },
      y: { min: point[1] < acc.y.min ? acc.y.min : point[1], max: point[1] > acc.y.max ? acc.y.max : point[1] }
    }
  )
}

function getBoundingLines (points) {
  var a = [points.x.min, points.y.min]
  var b = [points.x.min, points.y.max]
  var c = [points.x.max, points.y.min]
  var d = [points.x.max, points.y.max]

  return [[a, b], [a, c], [b, d], [c, d]]
}
