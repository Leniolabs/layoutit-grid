import { getGridRegion, gridAreaToGridLimits } from './utils/grid.js'
import { generateNamedTemplate } from './store/area.js'
import { customAlphabet } from 'nanoid'
const idAlphabet = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'
const idSize = 7
export const generateId = customAlphabet(idAlphabet, idSize)

export const unitMeasureMap = {
  px: 300,
  fr: 1,
  em: 4,
  '%': 50,
  minmax: '20px, 60px',
  auto: '',
  'min-content': '',
  'max-content': '',
  initial: '',
}

export function getElementTag(area) {
  switch (area.type) {
    case 'p':
      return 'p'
    case 'image': // TODO: Should we keep it as div in the code?
      return 'img'
    default:
      return 'div'
    // TODO: Should we add a comment if component is used?
  }
}

export function areaIsSingleLineInCSS(area) {
  return (
    area.display !== 'grid' &&
    area.justifySelf === 'initial' &&
    area.alignSelf === 'initial' &&
    area.margin === '0' &&
    area.padding === '0' &&
    area.width === 'auto' &&
    area.height === 'auto'
  )
}

export function includeAreaInCSS(area) {
  return !(areaIsSingleLineInCSS(area) && area.gridArea === 'auto')
}

export function templateRows(grid) {
  return grid.row.sizes.length.join(' ')
}

export function templateColumns(grid) {
  return grid.col.sizes.join(' ')
}

export function namedTemplateRows(grid, repeat) {
  return generateNamedTemplate(grid.row.sizes, grid.row.lineNames, true, repeat)
}

export function namedTemplateColumns(grid, repeat) {
  return generateNamedTemplate(grid.col.sizes, grid.col.lineNames, true, repeat)
}

export function createSection({ col, row }) {
  return {
    col: { start: col, end: col + 1 },
    row: { start: row, end: row + 1 },
  }
}

export function gridTemplateAreasMatrix({ grid, children }) {
  const colsNumber = grid.col.sizes.length
  const rowsNumber = grid.row.sizes.length

  const chunkAreas = []
  for (let i = 0; i < rowsNumber; i++) {
    chunkAreas[i] = Array(colsNumber).fill(null)
  }

  let validTemplate = true

  children.forEach((area) => {
    const gridRegion = getGridRegion(area)
    if (gridRegion) {
      const { row, col } = gridRegion
      if (row.start < 1 || row.end > rowsNumber + 1 || col.start < 1 || col.end > colsNumber + 1) {
        validTemplate = false
      } else {
        for (let r = row.start; r < row.end; ++r) {
          for (let c = col.start; c < col.end; ++c) {
            if (chunkAreas[r - 1][c - 1]) {
              validTemplate = false
            }
            chunkAreas[r - 1][c - 1] = area
          }
        }
      }
    }
  })

  return validTemplate ? chunkAreas : undefined
}

export function templateAreasCellName(area) {
  return area ? toCssName(area.name) : '.'
}

function matrixToTemplateAreas(matrix, separator) {
  return matrix.reduce((prev, item) => prev + `"${item.map(templateAreasCellName).join(' ')}"${separator}`, '').trim()
}

export function gridTemplateAreas(area, separator = ' ') {
  const matrix = gridTemplateAreasMatrix(area)
  return matrix && matrixToTemplateAreas(matrix, separator)
}

export function gridRegionToGridArea(gridRegion) {
  // TODO:
  const { row, col } = gridRegion
  return `${row.start} / ${col.start} / ${row.end} / ${col.end}`
}

function namedRegionSide(gridRegion, parentGrid, type, side) {
  let result = gridRegion[type][side]
  if (parentGrid && result > 0 && result <= parentGrid[type].lineNames.length) {
    const lineNameState = parentGrid[type].lineNames[result - 1]
    if (lineNameState.active) {
      const name = lineNameState.name
      if (name) {
        result = toCssName(name)
      }
    }
  }
  return result
}

function isSimpleExplicit({ start, end }) {
  return start.limit > 0 && end.limit > 0 && !(start.limit === end.limit)
}

// TODO: we are not using line names in complex cases (negative indexes, span, etc)
// It could be surprising for the user not to see the same numbers as in the grid-area input
// in the sidebar, but there may be cases where we could still show the line names
export function getGridAreaWithNamedLines(area) {
  const parentGrid = area.parent.grid
  const limits = gridAreaToGridLimits(area.gridArea)
  if (!limits.valid || limits.auto || !isSimpleExplicit(limits.row) || !isSimpleExplicit(limits.col)) {
    return area.gridArea
  }
  const gridRegion = getGridRegion(area, limits)
  if (gridRegion) {
    const rowStart = namedRegionSide(gridRegion, parentGrid, 'row', 'start')
    const colStart = namedRegionSide(gridRegion, parentGrid, 'col', 'start')
    const rowEnd = namedRegionSide(gridRegion, parentGrid, 'row', 'end')
    const colEnd = namedRegionSide(gridRegion, parentGrid, 'col', 'end')
    return `${rowStart} / ${colStart} / ${rowEnd} / ${colEnd}`
  }
}

export function getCodeGridArea(area, useTemplateAreas) {
  const gridRegion = getGridRegion(area)
  if (!gridRegion) {
    // Auto placed areas
    return area.gridArea
  }
  const { parent } = area
  if (parent) {
    return useTemplateAreas && getCodeGridTemplateAreas(parent) ? toCssName(area.name) : getGridAreaWithNamedLines(area)
  } else {
    return getGridAreaWithNamedLines(area)
  }
}

export function getCodeGridTemplateAreas(area) {
  return area.display === 'grid' && area.grid.col.sizes.length && area.grid.row.sizes.length
    ? gridTemplateAreas(area, '\n    ')
    : undefined
}

export function toCssName(name) {
  return name.replace(/[!\"#$%&'\(\)\*\+,\.\/:;<=>\?\@\[\\\]\^`\{\|\}~]/g, '-')
}

export function onCodeInputKeydown(event, emit) {
  if (event.code === 'Space') {
    event.preventDefault()
    return
  }
  if (event.code === 'Enter' || event.code === 'NumpadEnter' || event.code === 'Escape') {
    event.preventDefault()
    emit('move', { action: 'right' })
    return
  }
  if (event.code === 'ArrowRight') {
    if (getCaretCharacterOffsetWithin(event.target) === targetText(event).length) {
      emit('move', { action: 'right' })
      return
    }
  }
  if (event.code === 'ArrowLeft') {
    if (getCaretCharacterOffsetWithin(event.target) === 0) {
      emit('move', { action: 'left' })
      return
    }
  }
}

export function targetText(event) {
  const textNode = event.target.childNodes[0]
  return textNode && textNode.data
}

function getCaretCharacterOffsetWithin(element) {
  var caretOffset = 0
  var doc = element.ownerDocument || element.document
  var win = doc.defaultView || doc.parentWindow
  var sel
  if (typeof win.getSelection != 'undefined') {
    sel = win.getSelection()
    if (sel.rangeCount > 0) {
      var range = win.getSelection().getRangeAt(0)
      var preCaretRange = range.cloneRange()
      preCaretRange.selectNodeContents(element)
      preCaretRange.setEnd(range.endContainer, range.endOffset)
      caretOffset = preCaretRange.toString().length
    }
  } else if ((sel = doc.selection) && sel.type != 'Control') {
    var textRange = sel.createRange()
    var preCaretTextRange = doc.body.createTextRange()
    preCaretTextRange.moveToElementText(element)
    preCaretTextRange.setEndPoint('EndToEnd', textRange)
    caretOffset = preCaretTextRange.text.length
  }
  return caretOffset
}

function farEnough(a, b, delta = 5) {
  return Math.abs(a.x - b.x) > delta || Math.abs(a.y - b.y) > delta
}

export function handlePointerEventsInteraction(event, { onmove, onup, onclick }) {
  const initialPos = { x: event.clientX, y: event.clientY }
  const initialTime = new Date().getTime()

  let movingAnimation = null
  const animatedMove = () => {
    if (movingAnimation && !movingAnimation.done) {
      // update state
      onmove(movingAnimation.event)

      movingAnimation.done = true
    }
    if (movingAnimation) {
      requestAnimationFrame(animatedMove)
    } else {
      onup()
    }
  }

  const handleMove = (event) => {
    if (
      !movingAnimation &&
      new Date().getTime() - initialTime < 500 &&
      !farEnough(initialPos, { x: event.clientX, y: event.clientY })
    ) {
      return
    }
    const startAnimation = !movingAnimation
    movingAnimation = { done: false, event }
    if (startAnimation) {
      animatedMove()
    }
  }

  const handleUp = () => {
    if (!movingAnimation && new Date().getTime() - initialTime < 500) {
      onclick()
    }
    movingAnimation = null

    window.removeEventListener('pointermove', handleMove)
    window.removeEventListener('pointerup', handleUp)
  }
  window.addEventListener('pointermove', handleMove)
  window.addEventListener('pointerup', handleUp)
}

export function debounce(func, timeout = 300) {
  let timer
  return (...args) => {
    clearTimeout(timer)
    timer = setTimeout(() => {
      func.apply(this, args)
    }, timeout)
  }
}
