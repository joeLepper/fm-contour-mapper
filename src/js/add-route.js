export default class Router {
  constructor (map, group) {
    this.map = map
    this.group = group
  }
  addRoute (waypoints) {
    window.fetch('/api/find_by_waypoints', (
      { method: 'POST',
        body: JSON.stringify({ waypoints: waypoints }),
        headers: (
          { 'Accept': 'application/json',
            'Content-Type': 'application/json'
          }
        )
      }
    )).then((res) => {
      this.group.clearLayers()
      L.Routing.control({ waypoints: waypoints }).addTo(this.map)
    }).catch((err) => { console.error(err) })
  }
  addStationContour (contour) {
    this.group.addLayer(L.polygon(contour, { opacity: 0.001 }))
  }
}
