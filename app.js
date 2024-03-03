class App {
  strokes = []
  strokePointsRi = []
  W = null
  H = null

  #drawing = null
  #strokePoints = []

  get strokePoints () {
    
    if (this.#strokePoints.length == 0) {
      if (0 < this.strokes.length) {
	const Cls = this.constructor
	const {length: N} = this.strokes
	const serialisePoint = ([x,y]) => (
	  ((x<<16)+y).toString(16)
	)
	const unserialisePoint = (x) => {
	  x = parseInt(x, 16)
	  return [(x>>16), (x&0xFFFF)]
	}
	const range = (a, b) => (
	  b ? range(b-a).map(x => a+x)
	    : a <= 0 ? []
	    : [...Array(a).keys()]
	)
	const points = []
	const pointsRi = {}
	let p, q, P, R, rk
	for (let i of range(this.strokes.length)) {
	  p = this.strokes[i]
	  i = (i+1<N ? i+1 : (i+1)-N)
	  q = this.strokes[i]
	  for (const [x,y] of Cls.getStrokePoints(p, q)) {
	    // DEBUG
	    // const [_x, _y] = unserialisePoint(serialisePoint([x,y]))
	    // if (x != _x || y != _y) {
	    //   console.error({x,y,_x,_y,p,q})
	    //   throw Error(`Serialisation Error`)
	    // }
	    rk = serialisePoint([x,y])
	    if (rk in pointsRi === false) {
	      pointsRi[rk] = []
	    }
	    pointsRi[rk].push([p,q])
	  }
	}
	for (const x in pointsRi) {
	  points.push(unserialisePoint(x))
	}

	this.#strokePoints = points
	this.strokePointsRi = pointsRi
      }
    }
    return this.#strokePoints
  }

  constructor(canvasSel) {
    this.domEl = document.querySelector(canvasSel)
    const {W, H}
	  = getContextAndPixels(this.domEl, {willReadFrequently: true})
    this.domEl.width = W
    this.domEl.height = H
  }

  redrawCanvas(userData) {
    const oThis = this
    const {W, H} = getContextAndPixels(this.domEl)
    if (this.#drawing) {
      clearTimeout(this.#drawing)
    }
    this.#drawing = setTimeout(
      () => {
	userData.polygon = userData.polygon
	  .map(([x,y]) => ([x*W,y*H].map(Math.ceil)))	  
	oThis.clear()
	oThis.stroke(userData)
	oThis.fill(userData)
      },
      1500
    )

  }

  clear() {
    const {ctx, imData, x0, y0, W, H}
	  = getContextAndPixels(this.domEl)
    ctx.clearRect(x0, y0, W, H)
  }

  stroke({polygon: strokes, strokeColor}) {
    const Cls = this.constructor 
    const {ctx, imData, x0, y0, W, H}
	  = getContextAndPixels(this.domEl)
    this.strokes = strokes
    const points = this.strokePoints
    console.debug({strokes: {points}})
    if (0 < points.length) {
      setPixels(points, imData, W, H, strokeColor)
      flush({ctx, imData, x0, y0})
    }
  }

  fill(userData) {
    const {ctx, imData, x0, y0, W, H}
	  = getContextAndPixels(this.domEl)
    const pixels = imData.data
    const Cls = this.constructor
    const {fillColor} = userData
    const strokePoints = this.strokePoints
    const strokePointsRi = this.strokePointsRi
    const points = Cls.fillPixels({
      pixels, W, H, ...userData,
      strokePoints, strokePointsRi
    })
    console.debug({fill: {points}})

    setPixels(
      points,
      imData,
      W,
      H,
      fillColor
    )
    flush({ctx, imData, x0, y0})
  }

}
