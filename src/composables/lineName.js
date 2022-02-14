let textWidthCanvas = null
function getTextWidth(text, font) {
  if (!textWidthCanvas) {
    textWidthCanvas = document.createElement('canvas')
  }
  const context = textWidthCanvas.getContext('2d')
  context.font = font
  return context.measureText(text).width
}

export function useLineNameWidth(line, style, margin = 0) {
  return computed(() => getTextWidth(line.value.name, style) + margin)
}
