/**
 * FIXME: For a given stroke, there may be multiple
 * points on same y.  Only the rightmost point (one
 * with max x) is required to be indexed.
 */

class AppWithFillScanline extends App {

  static getStrokePoints(p, q) {
    // console.log({p,q})
    p = collectPointsOnLineBresenham(...p, ...q)
    // console.log({numStrokePoints: p.length, p})
    return p
  }

  static fillPixels({
    pixels,
    W,
    H,
    polygon: strokes,
    strokePoints,
    strokePointsRi,
  }) {
    let y, X, yMax, k, yMin, indexedSp, points, x0, x1, w, rk, _w
    const Cls = this
    const range = (a, b) => (
      b ? range(b-a).map(x => a+x)
	: a <= 0 ? []
	: [...Array(a).keys()]
    )
    const serialisePoint = ([x,y]) => (
      ((x<<16)+y).toString(16)
    )

    // Compute yMin, yMax, indexedSp
    yMin = H
    yMax = 0
    indexedSp = {}
    for (const [_x, _y] of strokePoints) {
      if (_y<0 || H<_y ||_x<0 || W<_x)
	continue
      k = `${_y}`
      if (k in indexedSp) {
	indexedSp[k].push(_x)
      } else {
	if (_y < yMin) yMin = _y
	if (yMax < _y) yMax = _y
	indexedSp[k] = [_x]
      }
    }
    for (const _k in indexedSp)
      indexedSp[_k].sort()
    
    console.info({
      strokes,
      numStrokePoints: strokePoints.length,
      yMin,
      yMax,
      indexedSp,
    })

    points = []
    for (const _y of range(yMin, yMax+1)) {
      k = `${_y}`
      X = [...indexedSp[k]]	// Clone it
      y = _y
      x0 = 0
      w = 0
      while (0 < X.length) {
	x1 = X.shift()
	if (w & 0x1)
	  for (const x of range(x0+1,x1)) {
	    points.push([x,y])
	  }
	console.debug({y, x0, x1, w, rk, stroke: strokePointsRi[rk]})
	x0 = x1
	rk = serialisePoint([x0,y])
	_w = 0		     // a flag for fringe cases
	for (const [[,yp],[,yq]] of strokePointsRi[rk]) {
	  // Compute winding number
	  if (yp == yq) continue;
	  if (yp == y) { _w += (yq<y ? 1 : -1); continue }
	  if (yq == y) { _w += (yp<y ? -1 : 1); continue }
	  
	  w += (yq < y ? 1 : -1)
	}

	w += Math.ceil(_w / 2)
      }
    }

    return points
 
  }

  static toQ(strokes) {
    let strokesQ

    strokesQ = strokes.reduce(
      (q, [xa, ya]) => {
	q[ya] = (ya in q)
	  ? [...q[ya], xa].toSorted()
	  : [xa]
	return q
      }
    )
    strokesQ = Object.entries(strokesQ)
      .toSorted(
	([ya, Xa], [yb, Xb]) => (
	  (ya<yb) ? -1
	    : (yb<ya ? 1 : 0)
	)
      )

    return strokesQ
  }

  /**
   * Create partial order so that p<q if p.y<q.y or
   * p.y==q.y&p.x<q.x
   */
  static toAdj(strokes) {
    const adj = {}
    , Cls = this

    console.info({toAdj: {strokes}})
    strokes.forEach(
      ([x,y], i) => {
	const _i1 = (0<i ? i-1 : strokes.length-1)
	const i1 = (i+1<strokes.length ? i+1 : (i+1)-strokes.length)
	const k = Cls.serialize([x, y])

	console.info({i, _i1, i1, adj_k: [strokes[_i1], strokes[i1]]})
	adj[k] = [strokes[_i1], strokes[i1]]
	  .filter(([x1, y1]) => (
	    y < y1 || (y == y1 && x<x1)
	  ))
	  .toSorted(([x1,y1], [x2,y2]) => {
	    const d1 = (x1-x)/(y1-y)
	    , d2 = (x2-x)/(y2-y)
	    return (
	      d1<d2 ? -1 : (d2<d1 ? 1 : 0)
	    )
	  })
      }
    )
  }

  static getCanvasOffset([x,y], W, H) {
    return  4*(y*W + x)
  }

  static serialize = JSON.stringify
}

