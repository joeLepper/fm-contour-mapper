var linesIntersect = require('robust-segment-intersect')

module.exports = function stabPoly (waypoints, lines) {
  return waypoints.some(function (wp, index) {
    if (index + 1 === waypoints.length) return false

    var nextWP = waypoints[index + 1]
    var routeLine = [[wp.lat, wp.lng], [nextWP.lat, nextWP.lng]]

    return lines.some(function (boundingLine) {
      return linesIntersect(routeLine[0], routeLine[1], boundingLine[0], boundingLine[1])
    })
  })
}
