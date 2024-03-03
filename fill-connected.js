class AppWithFillConnected extends App {

  static getStrokePoints(p, q) {
    return collectPointsOnLineBresenham(...p, ...q)
  }

  static fillPixels({
    pixels,
    W,
    H,
    start,
    strokeColor,
    nAdj,
  }) {
    let Q = [], p, offset, result = []
    const vis = new VisitationMask()
    const Cls = this
    console.log({nAdj})

    Q.push(start)

    while(0 < Q.length // && Q.length < 1000
	 ) {
      p = Q.shift()
      offset = Cls.getCanvasOffset(p, W, H)
      // console.log({p, offset})
      if (vis.at(offset>>2)) {
	// console.log({visited: p})
	continue		// visited
      }
      if (Cls.isBoundary(
	p, {pixels, W, H, strokeColor}
      )) {
	// console.log({
	//   atBoundary: p,
	//   pixelColor: Cls.pixelColorAt(p, {pixels, W, H})
	// })
	continue
      }

      result.push(p)
      vis.set(offset>>2)

      // console.log({result})

      Q.push(...Cls.getAdjacents(p, nAdj))
    }

    return result
  }

  static getCanvasOffset([x,y], W, H) {
    return  4*(y*W + x)
  }

  static getAdjacents([x, y], nAdj) {
    const adj = []

    if (nAdj !== 4 && nAdj !== 8)
      throw new TypeError('NAdj can either be 4 or 8')

    adj.push(
      [x, y+1],
      [x+1, y],
      [x-1, y],
      [x, y-1],
    )

    if (nAdj === 8)
      adj.push(
	[x+1, y+1],
	[x+1, y-1],
	[x-1, y+1],
	[x-1, y-1],
      )

    return adj
  }

  static isBoundary(
    p, {pixels, W, H, strokeColor}
  ) {
    const Cls = this
    return Cls.arrayEq(
      Cls.pixelColorAt(p, {pixels, W, H}),
      strokeColor,
    )
  }

  static pixelColorAt(p, {pixels, W, H}) {
    const Cls = this
    const offset = Cls.getCanvasOffset(p, W, H)
    return [
      pixels.at(offset+0),
      pixels.at(offset+1),
      pixels.at(offset+2),
      pixels.at(offset+3),
    ]
  }

  static arrayEq(A, B) {
    return A.every((a, i) => (a == B[i]))
  }
  
}
