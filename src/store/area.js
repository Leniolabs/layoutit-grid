import { parseGridTemplate, lineNamesToState } from './grid.js'
import { isValidTrackSize } from '../utils/grid.js'
export { isValidTrackSize }
export {
  findImplicitGrid,
  isValidGridArea,
  gridAreaToGridLimits,
  limitToString,
  gridLimitsToGridArea,
  getGridDimension,
  getGridRegion,
} from '../utils/grid.js'

export function getGridArea(area) {
  return area.gridArea
}

function removeExtraSpaces(str) {
  return str.replace(/\s+/g, ' ').trim()
}

function isValidSpacing(str) {
  const parts = removeExtraSpaces(str).split(' ')
  return parts.length >= 1 && parts.length <= 4 && parts.every(isValidTrackSize)
}

export const isValidMargin = isValidSpacing
export const isValidPadding = isValidSpacing

//OLD COLORS
/* const colors = [
  'rgba(230, 25, 75, 0.8)',
  'rgba(60, 180, 75, 0.8)',
  'rgba(245, 130, 48, 0.8)',
  'rgba(240, 50, 230, 0.8)',
  'rgba(0, 128, 128, 0.8)',
] */

//MATERIAL UI COLORS
const colors = [
  'rgba(244, 67, 54, 0.8)',
  'rgba(233, 30, 99, 0.8)',
  'rgba(156, 39, 176, 0.8)',
  'rgba(103, 58, 183, 0.8)',
  'rgba(63, 81, 181, 0.8)',
  'rgba(33, 150, 243, 0.8)',
  'rgba(3, 169, 244, 0.8)',
  'rgba(0, 188, 212, 0.8)',
  'rgba(0, 150, 136, 0.8)',
  'rgba(76, 175, 80, 0.8)',
  'rgba(139, 195, 74, 0.8)',
  'rgba(205, 220, 57, 0.8)',
  'rgba(255, 235, 59, 0.8)',
  'rgba(255, 193, 7, 0.8)',
  'rgba(255, 152, 0, 0.8)',
  'rgba(255, 87, 34, 0.8)',
]

export function createAreaState({
  name = 'area',
  color = colors[0],
  type = 'div',
  display = 'block',
  grid = null,
  flex = null,
  gridArea = 'auto',
  width = 'initial',
  height = 'initial',
  margin = '0',
  padding = '0',
  justifySelf = 'initial',
  alignSelf = 'initial',
  flexGrow = 0,
  flexShrink = 1,
  flexBasis = '100%',
  text = '',
  items = null,
  children = [],
  parent = null,
}) {
  return {
    name,
    color,
    type,
    display,
    grid,
    flex,
    gridArea,
    width,
    height,
    margin,
    padding,
    justifySelf,
    alignSelf,
    flexGrow,
    flexShrink,
    flexBasis,
    text,
    items,
    children,
    parent,
  }
}

export function parentify(area, parent = null) {
  area.parent = parent
  area.children.forEach((child) => parentify(child, area))
  return area
}

export function generateNamedTemplate(templateArr, lineNames, css = true, repeat = false) {
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

function _serializeTemplate(dim) {
  return generateNamedTemplate(dim.sizes, dim.lineNames, false)
}

function _serializeArea({ items, parent, children, ...areaData }) {
  // Drop parent
  // items is not used at this point
  return { ...areaData, ...(children.length > 0 && { children }) }
}

function _serializeGrid({ col, row, ...gridData }) {
  return {
    ...gridData,
    gap: row.gap + ' ' + col.gap,
    ...(col.sizes.length && { templateColumns: _serializeTemplate(col) }),
    ...(row.sizes.length && { templateRows: _serializeTemplate(row) }),
    ...(col.auto.length && { autoColumns: col.auto.join(' ') }),
    ...(row.auto.length && { autoRows: row.auto.join(' ') }),
  }
}
export function serializeArea(area) {
  return JSON.stringify({ area: _serializeArea(area), version: 1 }, (key, value) => {
    if (key === 'grid' && value) {
      return _serializeGrid(value)
    }
    if (key === 'children' && value) {
      return value.map(_serializeArea)
    }
    return value
  })
}

// Support for serialization before version 1, area.children was in area.grid.areas
export function rewireAreas(area) {
  if (area.grid && area.grid.areas) {
    area.children = area.grid.areas
  } else if (!area.children) {
    area.children = []
  }
  area.children.forEach(rewireAreas)
  return area
}

function parseAutoSizes(s) {
  return s ? s.split(/\s/) : []
}

export function parseArea(json) {
  const design = JSON.parse(json, (key, value) => {
    if (key === 'grid' && value) {
      const { gap, templateColumns, templateRows, autoColumns, autoRows, ...gridData } = value
      const [colSizes, colLineNames] = templateColumns ? parseGridTemplate(templateColumns) : [[], ['']]
      const [rowSizes, rowLineNames] = templateRows ? parseGridTemplate(templateRows) : [[], ['']]
      const colAutoSizes = autoColumns ? parseAutoSizes(autoColumns) : []
      const rowAutoSizes = autoRows ? parseAutoSizes(autoRows) : []
      const gridGap = value.gap.split(' ')
      const grid = {
        row: { sizes: rowSizes, lineNames: lineNamesToState(rowLineNames), gap: gridGap[0], auto: rowAutoSizes },
        col: { sizes: colSizes, lineNames: lineNamesToState(colLineNames), gap: gridGap[1], auto: colAutoSizes },
        ...gridData,
      }
      return grid
    }
    if (key === 'flex' && value) {
      return createFlexState(value)
    }
    if (key === 'children' || key === 'areas') {
      // In v1, area.children was in area.grid.areas
      return value.map(createAreaState)
    }
    return value
  })
  return parentify(rewireAreas(design.version ? design.area : design))
}

export function getRandomColor() {
  return colors[Math.floor(Math.random() * colors.length)]
}

export function getAreaDepth(area) {
  const parent = area.parent
  if (parent) {
    return getAreaDepth(parent) + 1
  } else {
    return 0
  }
}
