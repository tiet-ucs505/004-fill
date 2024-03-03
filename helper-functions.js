// Usage:
// --------------------------------------------------
// const canvas = document.querySelector('#myCanvas')
// const {ctx, imData, x0, y0, W, H}
//       = getContextAndPixels(canvas)
// // Compute Points
// let points = []
//
// setPixels(points, imData, W, H)
// flush({ctx, imData, x0, y0})

// ----------------------------------------------------
// Canvas manipulation
// ----------------------------------------------------

function setPixels(A, imData, W, H) {
  A.map(([x, y]) => setPixel(x, y, imData, W, H))
}

function getContextAndPixels(canvas) {


  // ----------------------------------------------------
  // Bootstrap
  // ----------------------------------------------------
  const ctx = canvas.getContext('2d')
  const {width: W, height: H} = canvas.getBoundingClientRect()
  const [x0,y0] = [0, 0]
  console.log({x0, y0, W, H})

  const imData = ctx.getImageData(x0,y0,W,H)

  return {ctx, imData, x0, y0, W, H}

}


function setPixel(
  px, py,
  imData, W, H
) {

  let r,g,b,a
  
  // Set color
  r = g = b = a = 255

  return setPixelColor(
    px, py,
    r, g, b, a,
    imData, W, H
  )
}

function setPixelColor(
  px, py,
  r, g, b, a,
  imData, W, H
) {

  // --------------------------------------------------
  // Manipulate the imData
  // --------------------------------------------------

  let offset, pixels

  // Retrieve Image Data as pixels
  pixels = imData.data

  // Compute offset
  offset = (py * W + px) * 4

  // Set pixel value
  pixels.set([r,g,b,a], offset)

  // --------------------------------------------------
  // Data Manipulation ends
  // --------------------------------------------------
}

function flush({ctx, imData, x0, y0}) {

  // --------------------------------------------------
  // Flush
  // --------------------------------------------------
  ctx.putImageData(imData, x0, y0)

}
