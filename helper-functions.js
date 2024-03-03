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

function getContextAndPixels(canvas, contextAttributes) {


  // ----------------------------------------------------
  // Bootstrap
  // ----------------------------------------------------
  const ctx = canvas.getContext('2d', contextAttributes)
  const {width: W, height: H} = canvas.getBoundingClientRect()
  const [x0,y0] = [0, 0]
  console.log({x0, y0, W, H})
  const imData = ctx.getImageData(x0,y0,W,H)

  return {ctx, imData, x0, y0, W, H}

}

function setPixels(A, imData, W, H, fg=[0,0,0,255]) {
  console.debug({fg,W,H})
  A.map(([x, y]) => setPixelSafe(x, y, imData, W, H, fg))
}

function setPixelSafe(
  px, py,
  imData, W, H,
  fg=[0,0,0,255]
) {
  try {
    setPixel(
      px, py,
      imData, W, H,
      fg,
    )
  } catch (e) {
    console.error({px, py})
    throw e
  }
}

function setPixel(
  px, py,
  imData, W, H,
  fg=[0,0,0,255]
)
 {

  const [r,g,b,a] = fg
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
