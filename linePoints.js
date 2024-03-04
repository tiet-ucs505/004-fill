function getLinePoints([xp,yp], [xq,yq]) {
  let isFlippedY, isFlippedXy, points

  console.info({
    name: `getLinePoints`,
    p: [xp,yp],
    q: [xq,yq],
  })

  isFlippedY = false
  isFlippedXy = false
  points = []

  if (xq<yq) {
    // Swap p,q
    [xp,yp,xq,yq] = [xq,yq,xp,yp]
  }

  if (yq < yp) {
    isFlippedY = true
    [yp, yq] = [-yp, -yq]
  }

  if (xq-xp < yq-yp) {
    isFlippedXy = true
    [xp,yp,xq,yq] = [yp,xp,yq,xq]
  }

  points = getLinePointsGentle([xp,yp],[xq,yq])

  if (isFlippedXy) {
    points = points.map(([x,y]) => ([y,x]))
  }

  if (isFlippedY) {
    points = points.map(([x,y]) => ([x,-y]))
  }

  return points
}

function getLinePointsGentle([xp,yp], [xq,yq]) {

  // Bresenham's algorithm
  let x, y, points, d, dx, dy

  console.info({
    name: `getLinePointsGentle`,
    p: [xp,yp],
    q: [xq,yq],
  });

  [x,y] = [xp,yp]
  points = []
  points.push([x,y])
  dx = xq-xp
  dy = yq-yp
  d = dx - 2*dy
  while (x<xq) {
    x += 1
    y += (d<0)
    points.push([x,y])
    d += -2*dy + (
      (d<0) ? 2*dx : 0
    )
  }

  return points
}
