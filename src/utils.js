export const unitMeasureMap = {
  px: 300,
  fr: 1,
  em: 4,
  '%': 10,
  minmax: '20px, 60px',
  auto: '',
  'min-content': '',
  'max-content': '',
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

export function gridSections(grid) {
  const colsNumber = grid.col.sizes.length
  const rowsNumber = grid.row.sizes.length
  const sectionsNumber = colsNumber * rowsNumber

  const sections = []
  for (let i = 0; i < sectionsNumber; ++i) {
    const colStart = (i % colsNumber) + 1
    const rowStart = Math.floor(i / colsNumber) + 1
    sections.push(createSection({ col: colStart, row: rowStart }))
  }

  return sections
}

export function gridTemplateAreasMatrix({ grid, children }) {
  const colsNumber = grid.col.sizes.length
  const rowsNumber = grid.row.sizes.length

  const chunkAreas = []
  for (let i = 0; i < rowsNumber; i++) {
    chunkAreas[i] = Array(colsNumber).fill('.')
  }

  let validTemplate = true

  children.forEach(({ name, gridRegion }) => {
    if (gridRegion) {
      const { row, col } = gridRegion
      for (let r = row.start; r < row.end; ++r) {
        for (let c = col.start; c < col.end; ++c) {
          if (chunkAreas[r - 1][c - 1] !== '.') {
            validTemplate = false
          }
          chunkAreas[r - 1][c - 1] = toCssName(name)
        }
      }
    }
  })

  return validTemplate ? chunkAreas : undefined
}

function matrixToTemplateAreas(matrix, separator) {
  return matrix.reduce((prev, item) => prev + `"${item.join(' ')}"${separator}`, '').trim()
}

export function gridTemplateAreas(area, separator = ' ') {
  const matrix = gridTemplateAreasMatrix(area)
  return matrix && matrixToTemplateAreas(matrix, separator)
}

export function gridRegionToGridArea(gridRegion) {
  const { row, col } = gridRegion
  return `${row.start} / ${col.start} / ${row.end} / ${col.end}`
}

export function gridAreaToGridRegion(gridArea) {
  const p = gridArea.split('/')
  return {
    row: { start: parseInt(p[0]), end: parseInt(p[2]) },
    col: { start: parseInt(p[1]), end: parseInt(p[3]) },
  }
}

function namedRegionSide(gridRegion, parentGrid, type, side) {
  let result = gridRegion[type][side]
  if (parentGrid) {
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

export function getGridArea(area, parentGrid) {
  // TODO: remove parentGrid
  if (area && area.gridRegion) {
    const rowStart = namedRegionSide(area.gridRegion, parentGrid, 'row', 'start')
    const colStart = namedRegionSide(area.gridRegion, parentGrid, 'col', 'start')
    const rowEnd = namedRegionSide(area.gridRegion, parentGrid, 'row', 'end')
    const colEnd = namedRegionSide(area.gridRegion, parentGrid, 'col', 'end')
    return `${rowStart} / ${colStart} / ${rowEnd} / ${colEnd}`
  } else return ''
}

function parseLineName(item) {
  return item.includes('[') ? item.match(/\[(.*)\]/)[1].trim() : null
}

export function toCssName(name) {
  return CSS.escape(name.replace(/\s/g, '-'))
}

export function generateNamedTemplate(templateArr, lineNames, css = true, repeat) {
  let str = ''
  for (var i = 0; i < lineNames.length; i++) {
    const { active, name } = lineNames[i]
    if (active && name) {
      str += `[${css ? toCssName(name) : name}] `
    }
    if (i < templateArr.length) {
      if (repeat) {
        str += repeatify(templateArr.slice(' '))
        break
      } else {
        str += templateArr[i] + ' '
      }
    }
  }
  return str.trim()
}

function repeatify(tokens) {
  for (;;) {
    const longestSequence = findRepeatingSequnce(tokens)
    if (!longestSequence) {
      break
    }
    tokens.splice(
      longestSequence.start,
      longestSequence.tokens.length * longestSequence.times,
      `repeat(${longestSequence.times}, ${longestSequence.tokens.join(' ')})`
    )
  }
  return tokens.join(' ')
}

function findRepeatingSequnce(tokens) {
  let data
  let longest = 0

  for (let start = 0; start < tokens.length - 1 - longest * 2; start++) {
    for (let size = 1; start + 2 * size <= tokens.length; size++) {
      const count = matchSequence(tokens, start, size)
      const times = count + 1
      if (count > 0 && times * size > longest) {
        data = { start, times, size }
        longest = times * size
      }
    }
  }
  return (
    data && {
      ...data,
      tokens: tokens.slice(data.start, data.start + data.size),
    }
  )
}

function matchSequence(tokens, start, size) {
  if (start + 2 * size > tokens.length) {
    return 0
  }
  for (let pos = 0, j = start, k = start + size; pos < size; pos++, j++, k++) {
    if (tokens[j] !== tokens[k]) {
      return 0
    }
  }
  return 1 + matchSequence(tokens, start + size, size)
}

// TODO:

export function parseGridTemplate(templateStr) {
  // splits at and space that isn't between two [ ] brackets
  const parsedArr = templateStr.split(/\s(?![^[]*])/)
  const lineNames = []
  const templateArr = []
  let position = 0
  parsedArr.forEach((item) => {
    const lineName = parseLineName(item)
    if (lineName) {
      while (lineNames.length < position) {
        lineNames.push('')
      }
      lineNames.push(lineName)
    } else {
      templateArr.push(item)
      ++position
    }
  })
  while (lineNames.length <= templateArr.length) {
    lineNames.push('')
  }

  return [templateArr, lineNames]
}

export function onCodeInputKeydown(event) {
  if (event.code === 'Space') {
    event.preventDefault()
    return
  }
  if (event.code === 'Enter' || event.code === 'NumpadEnter') {
    event.preventDefault()
    emit('move', { action: 'right' })
    return
  }
  if (event.code === 'ArrowRight') {
    if (getCaretCharacterOffsetWithin(event.target) === textFrom(event).length) {
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

function textFrom(event) {
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
