function updateCanvas(d) {
  try {
    const userData = JSON.parse(editor.getValue())
    app.redrawCanvas(userData)
  } catch (e) {
    if (e instanceof SyntaxError) {
      console.debug('Error parsing JSON')
    } else {
      throw e
    }
  }
}
