class VisitationMask {
  m
  constructor() { this.m = new BigInt(0) }
  set(n) { this.m |= (BigInt(1) << BigInt(n)) }
  at(n) { return (this.m >> BigInt(n)) & BigInt(1) }
}

function fillConnected(
  { imageData,
    start,			// [x,y]
    nAdj,
    W, H,
    toColor,			// [r,g,b,a]
  } = { nAdj: 4 }
) {
  const pixels = imageData.data

  let Q = [], p, offset
  const vis = new VisitationMask()

  Q.push(start)

  while(0 < Q.length) {
    p = Q.shift()
    offset = getCanvasOffset(p, W, H)
    if (vis.at(offset)) continue // visited
    if (
      pixels.at(offset+0) === 0
	&& pixels.at(offset+1) === 0
	&& pixels.at(offset+2) === 0
    ) continue			// at boundary

    pixels.set(toColor, offset)
    vis.set(offset)

    Q.push(...getAdjacents(p, nAdj))
  }

  return imageData
}

function getCanvasOffset([x,y], W, H) {
  return  4*(y*W + x)
}

function getAdjacents([x, y], nAdj) {
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
