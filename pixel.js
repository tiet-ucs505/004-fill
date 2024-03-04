function setPixels(sel, pArray, colorHex) {
  const rgba = [...hexToRgb(colorHex), 255]

  console.info({
    name: `setPixels`,
    sel, pArray, colorHex, rgba
  })
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
