function setPixels(sel, pArray, colorHex) {
  let offset

  const rgba = [...hexToRgb(colorHex), 255]

  const canvas = document.querySelector(sel)
  const ctx = canvas.getContext('2d')
  const {width: W, height: H}
	= canvas.getBoundingClientRect()
  const imData = ctx.getImageData(0,0,W,H)

  console.info({
    name: `setPixels`,
    sel, pArray, colorHex,
    rgba, canvas, ctx, W, H
  })

  const pixels = imData.data
  for (const [x,y] of pArray) {
    try {
      offset = 4*(y*W + x)
      pixels.set(rgba, offset)
    } catch (e) {
      console.error({at: [x,y]})
      throw e
    }
  }

  ctx.putImageData(imData, 0,0)
}

function hexToRgb(hex) {
  // Remove leading '#' if required
  if (hex[0] == '#')
    hex = hex.substring(1)

  const rgbInt = parseInt(hex, 16)
  return [
    (rgbInt>>16) & (0xFF),
    (rgbInt>>8)  & (0xFF),
    (rgbInt>>0)  & (0xFF),
  ]
}
