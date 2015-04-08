import 'leaflet-routing-machine'
import 'leaflet-control-geocoder'
import 'whatwg-fetch'
import L from 'leaflet'
import pointInPolygon from 'robust-point-in-polygon'
import Router from './src/js/add-route'

window.addEventListener('load', (e) => {
  var map = L.map(document.querySelector('.map')).setView([40.690, -80.587], 6)
  var contourGroup = L.featureGroup()
  var router = new Router(map, contourGroup)
  var waypoints = (
    [ L.latLng(43.02698841615476, -87.92186737060547),
      L.latLng(41.43449030894922, -87.550048828125),
      L.latLng(42.90011265525328, -82.935791015625),
      L.latLng(40.68994525997192, -80.55527687072754),
      L.latLng(39.905522539728544, -76.5142822265625),
      L.latLng(40.371658891506094, -74.058837890625)
    ]
  )

  map.on('click', (e) => {
    var coords = map.getCenter()
    window.fetch('/api/find_by_point?lat=' + coords.lat + '&lng=' + coords.lng).then((res) => {
      res.json().then((contours) => {
        console.log(contours)
        var idx = 0
        map.eachLayer((layer) => {
          try {
            if (idx) map.removeLayer(layer)
            idx++
          } catch (e) {
            console.log(e)
            console.log(layer)
          }
        })
        contours.forEach((c, i) => {
          var contour = c.geometry.coordinates.slice(0, 360)
          var shouldAddToMap = pointInPolygon(contour, [coords.lat, coords.lng]) !== 1
          if (shouldAddToMap) map.addLayer(L.polygon(contour))
        })
      })
    }).catch((err) => { console.error(err) })
  })

  L.tileLayer('https://{s}.tiles.mapbox.com/v4/jlepper.lkjm1kb4/{z}/{x}/{y}.png?access_token=pk.eyJ1IjoiamxlcHBlciIsImEiOiJ3WFo5NVZRIn0.9Zh_NLA8VkWVmQ_2M14CMg', {
    attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="http://mapbox.com">Mapbox</a>',
    maxZoom: 18
  }).addTo(map)

  var es = new window.EventSource('/sse')
  es.onmessage = (message) => {
    var station = JSON.parse(message.data)
    var contour = station.geometry.coordinates.slice(0, 360)
    router.addStationContour(contour)
  }

  L.Control.geocoder().addTo(map)

  contourGroup.addTo(map)
  router.addRoute(waypoints)
})
