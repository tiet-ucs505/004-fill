function boundaryFill({
  sel,
  boundaryColor,
  start,
  fillColor,
  normalised = true,
}) {
  console.info({
    name: 'boundaryFill',
    sel,
    boundaryColor,
    start,
    fillColor,
    normalised,
  })

  if (normalised) {
    [start] = denormalise(sel, [start])
  }

  setPixels(sel, [start], '#ff0000')
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
