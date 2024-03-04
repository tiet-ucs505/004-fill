function boundaryFill({
  sel,
  boundaryColor,
  start,
  fillColor,
}) {
  console.info({
    name: 'boundaryFill',
    sel,
    boundaryColor,
    start,
    fillColor,
  })
}

function floodFill({
  sel, start, fillColor
}) {
  console.info({
    name: `floodFill`,
    sel, start, fillColor
  })
}

function drawPolygonStrokes({
  sel,
  polygon,
  strokeColor,
  normalised=true,
}) {
  let i, N, points

  console.info({
    name: `drawPolygonStrokes`,
    sel,
    polygon,
    strokeColor,
    normalised,
  })

  if (normalised) {
    // De-normalise the points
    const canvas = document.querySelector(sel)
    const {width: W, height: H}
	  = canvas.getBoundingClientRect()
    polygon = polygon.map(
      ([x,y]) => ([
	Math.ceil(x*W), Math.ceil(y*H),
      ])
    )
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
