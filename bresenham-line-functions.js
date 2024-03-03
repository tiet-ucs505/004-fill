function collectBresenhamBase(px, py, qx, qy) {
  // Ensure that:
  // px < qx and
  // 0 <= qy-py
  // qy-py <= qx-px

  console.log({px, py, qx, qy})

  const points = [[px, py]]
  , dx = qx-px			// is integer
  , dy = qy-py			// is integer
  , b = Math.floor(py - (dy/dx)*px) // truncated 
  , c = 2*dy + dx*(2*b-1)	    // is integer
  , inc = (x, y) => (
    2 * (dx*y - dy*x) < c	// integer arithmetic
      ? 1 : 0
  )

  let [x, y] = [px, py]

  while (x < qx) {
    x += 1
    y += inc(x,y)
    points.push([x, y])
  }

  return points
}

function collectPointsOnLineBresenham(px, py, qx, qy) {
  let isFlippedY = false
  , isFlippedXy = false
  , t = null
  , points = []

  console.log({input: {px, py, qx, qy}})

  if (qx < px)			// Swap
  {
    t = {qx, qy}
    qx = px
    qy = py
    px = t.qx
    py = t.qy
    console.log({swapped: {px, py, qx, qy}})
  }			  // Definitely moving along +X


  if (qy-py < 0)	      // Negative Slope: Flip Y
  { isFlippedY = true
    py = -py
    qy = -qy
    console.log({flippedY: {px, py, qx, qy}})
  }			       // Definitely 0 <= slope

  if (qx-px < qy-py) 		// Steep Slope: Flip XY
  { isFlippedXy = true
    t = { px, qx }
    px = py
    qx = qy
    py = t.px
    qy = t.qx
    console.log({flippedXy: {px, py, qx, qy}})
  }

  points = collectBresenhamBase(px, py, qx, qy)

  if (isFlippedXy) {
    // Unflip XY
    points = points.map(([x, y]) => ([y, x]))
  }

  if (isFlippedY) {
    // Unflip Y
    points = points.map(([x, y]) => ([x, -y]))
  }

  return points
}
