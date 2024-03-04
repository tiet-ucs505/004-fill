function canvasReset(sel) {
  const canvas = document.querySelector(sel)
  const {width: W, height: H}
	= canvas.getBoundingClientRect()
  canvas.width = W
  canvas.height = H
}
