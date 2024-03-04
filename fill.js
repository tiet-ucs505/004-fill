function boundaryFill({
  sel,
  boundaryColor,
  start,
  fillColor,
  normalised = true,
  adjacency = 4,
}) {
  console.info({
    name: 'boundaryFill',
    sel,
    boundaryColor,
    start,
    fillColor,
    normalised,
    adjacency,
  })

  if (normalised) {
    [start] = denormalise(sel, [start])
  }

  setPixels(sel, [start], '#ff0000')

  const points = getBoundaryFillPoints({
    sel, boundaryColor, start, adjacency,
  })
  setPixels(sel, points, fillColor)
}

function getBoundaryFillPoints({
  sel, boundaryColor, start, adjacency,
}) {
  let u, V, vis, points

  console.info({
    name: `getBoundaryFillPoints`,
    sel, boundaryColor, start, adjacency,
  })

  // To check if a point is on boundary
  // Extract current canvas state
  const canvas = document.querySelector(sel)
  const ctx = canvas.getContext('2d')
  const {width: W, height: H}
	= canvas.getBoundingClientRect()
  const imData = ctx.getImageData(0,0,W,H)
  const pixels = imData.data
  const arrayEquals = (A,B) => {
    for(let i=0;i<A.length;++i) {
      if (A[i] != B[i]) return false
    }
    return true
  }
  const boundaryRgba = [
    ...hexToRgb(boundaryColor), 255
  ]
  const isBoundary = ([x,y]) => {
    const canvasRgba = pixels.slice(
      4*(y*W+x), 4*(y*W+x+1)
    )
    return arrayEquals(canvasRgba, boundaryRgba)
  }

  // Define Adjacency for a given point
  const ADJ4 = [
    [0,1], [0,-1], [1,0], [-1,0]
  ]
  const ADJ8 = [
    ...ADJ4,
    [1,1], [1,-1], [-1,1], [-1,-1]
  ]
  const adj = (
    adjacency==4 ? ADJ4
      : adjacency==8 ? ADJ8
      : null
  )
  const inView = ([x,y]) => (
    0 <= x && x < W
      && 0 <= y && y < H
  )
  const getV
	= ([x,y]) => (adj.map(([a,b])=>([x+a,y+b]))
		      .filter(inView))

  // Maintain visitation set implemented as a bitmask
  const isVisited = ([x,y]) => (
    (vis >> BigInt(y*W+x)) & BigInt(1)
  )
  const setVis = ([x,y]) => {
    vis |= (BigInt(1) << BigInt(y*W+x))
  }

  // Instantiate Q
  const Q = []
  
  // Initialise BFS
  vis = BigInt(0)
  points = []
  Q.push(start)
  while (0 < Q.length) {
    u = Q.shift()

    if (isVisited(u)) {
      continue
    }

    setVis(u)

    if (isBoundary(u)) {
      continue
    }

    points.push(u)

    Q.push(...getV(u))
  }

  return points
}

function floodFill({
  sel, start, fillColor,
  normalised = true,
}) {
  console.info({
    name: `floodFill`,
    sel, start, fillColor, normalised,
  })
}

function drawPolygonStrokes({
  sel,
  polygon,
  strokeColor,
  normalised=true,
}) {
  let i, N, points, p, q

  console.info({
    name: `drawPolygonStrokes`,
    sel,
    polygon,
    strokeColor,
    normalised,
  })

  if (normalised) {
   // De-normalise the points
    polygon = denormalise(sel, polygon)
  }

  N = polygon.length
  points = []
  for (i=0; i<N; ++i) {
    p = polygon[i]
    q = polygon[(i+1<N ? i+1 : (i+1)-N)]
    points.push(...getLinePoints(p,q))
  }
  points = makeUniqueSvec2(points)

  setPixels(sel, points, strokeColor)
}

function makeUniqueSvec2(svec2) {
  let result

  console.info({
    name: `makeUniqueSvec2`,
    svec2,
  })

  const cat = ([a,b]) => ((a<<16)+b)
  const split = (a) => ([a>>16, (a&0xFFFF)])
  
  // console.debug({
  //   ivec: svec2.map(cat),
  //   set: (new Set([2,3])),
  //   setValues: (new Set([2,3])).values(),
  // })

  result = svec2.map(cat)
  result = [...new Set(result).values()]
  result = result.map(split)
  return result    
}

function denormalise(sel, points) {
  const canvas = document.querySelector(sel)
  const {width: W, height: H}
	= canvas.getBoundingClientRect()

  points = points.map(
    ([x,y]) => ([
      Math.ceil(x*W), Math.ceil(y*H),
    ])
  )

  return points
}
