function main() {
  const sel = '#myCanvas'
  const polygon = [[0.15, 0.3],
                   [0.3, 0.17],
                   [0.65, 0.5],
                   [0.35, 0.53],
                   [0.7, 0.23],
                   [0.85, 0.28],
                   [0.63, 0.85],
                   [0.47, 0.82]]
  const start = [0.5, 0.63]
  const strokeColor = '#000000'
  const fillColor = '#f1f1e0'

  const dwg = [
    {
      polygon: [[0.2, 0.2], [0.22, 0.2],
		[0.22, 0.8], [0.2, 0.8]],
      color: '#ff0000',
      start : [0.21, 0.5],
    },
    {
      polygon: [[0.2, 0.8], [0.2, 0.78],
		[0.8, 0.78], [0.8, 0.8]],
      color: '#00ff00',
      start : [0.5, 0.79],
    },
    {
      polygon: [[0.8, 0.8], [0.78, 0.8],
		[0.78, 0.2], [0.8, 0.2]],
      color: '#0000ff',
      start : [0.79, 0.5],
    },
    {
      polygon: [[0.8, 0.2], [0.8, 0.22],
		[0.2, 0.22], [0.2, 0.2]],
      color: '#ff00ff',
      start : [0.5, 0.21],
    },
  ]

  // Boundary Fill
  // ----------------------------------------------
  canvasReset(sel)
  drawPolygonStrokes({sel, polygon, strokeColor})
  boundaryFill({
    sel,
    boundaryColor: strokeColor,
    start,
    fillColor,
  })

  // Flood Fill
  // ----------------------------------------------
  // canvasReset(sel)
  // for (const {polygon: poly, color: col, start: st} of dwg) {
  //   drawPolygonStrokes({sel, polygon:poly})
  //   boundaryFill({
  //     sel,
  //     boundaryColor: col,
  //     start: st,
  //     fillColor: col,
  //   })
  // }
  // floodFill({
  //   sel, start, fillColor
  // })
}
