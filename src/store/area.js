import { parseGridTemplate, lineNamesToState, isValidTrackSize } from './grid.js'

const colors = [
  'rgba(230, 25, 75, 0.8)',
  'rgba(60, 180, 75, 0.8)',
  'rgba(245, 130, 48, 0.8)',
  'rgba(240, 50, 230, 0.8)',
  'rgba(0, 128, 128, 0.8)',
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
    templateColumns: _serializeTemplate(col),
    templateRows: _serializeTemplate(row),
    autoColumns: col.auto.join(' '),
    autoRows: row.auto.join(' '),
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
      const [colSizes, colLineNames] = parseGridTemplate(templateColumns)
      const [rowSizes, rowLineNames] = parseGridTemplate(templateRows)
      const colAutoSizes = parseAutoSizes(autoColumns)
      const rowAutoSizes = parseAutoSizes(autoRows)
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

function removeExtraSpaces(str) {
  return str.replace(/\s+/g, ' ').trim()
}

function isValidSpacing(str) {
  const parts = removeExtraSpaces(str).split(' ')
  return parts.length >= 1 && parts.length <= 4 && parts.every(isValidTrackSize)
}

export const isValidMargin = isValidSpacing
export const isValidPadding = isValidSpacing

export function isValidGridArea(gridArea) {
  return gridAreaToGridLimits(gridArea).valid
}

function trimSplit(s, sep) {
  return s.split(sep).map((p) => p.trim())
}

function parseLimit(limit) {
  return parseInt(limit)
}

function parseGridLimit(s) {
  if (s === undefined || s === 'auto') {
    return { span: 1 }
  }
  const parts = trimSplit(s, 'span')
  if (parts.length > 1) {
    const span = parseInt(parts[1])
    if (Number.isNaN(span) || span < 1) {
      return undefined
    }
    return { span }
  } else {
    const limit = parseLimit(s)
    if (Number.isNaN(limit)) {
      return undefined
    }
    return { limit }
  }
}

function isLimit(l) {
  return l && l.limit !== undefined
}

export function gridAreaToGridLimits(gridArea) {
  const parts = trimSplit(gridArea, '/')
  const row = {
    start: parseGridLimit(parts[0]),
    end: parseGridLimit(parts[2]),
  }
  const col = {
    start: parseGridLimit(parts[1]),
    end: parseGridLimit(parts[3]),
  }
  const valid = parts.length <= 4 && !!(row.start && row.end && col.start && col.end)
  if (valid) {
    row.span = isLimit(row.start)
      ? isLimit(row.end)
        ? Math.abs(row.end.limit - row.start.limit)
        : row.end.span
      : row.start.span
    col.span = isLimit(col.start)
      ? isLimit(col.end)
        ? Math.abs(col.end.limit - col.start.limit)
        : col.end.span
      : col.start.span
  }
  const auto = !valid || !((isLimit(row.start) || isLimit(row.end)) && (isLimit(col.start) || isLimit(col.end)))
  row.auto = !valid || (auto && !isLimit(row.start) && !isLimit(row.end))
  col.auto = !valid || (auto && !isLimit(col.start) && !isLimit(col.end))
  return { row, col, valid, auto }
}

export function limitToString(l) {
  if (l !== undefined) {
    return l.limit ? l.limit.toString() : `span ${l.span.toString}`
  } else {
    return 'auto'
  }
}

// TODO: Test
export function gridLimitsToGridArea({ row, col }) {
  let ga = limitToString(row.start)
  if (!col.start.auto) {
    ga += ' / ' + limitToString(col.start)
  }
  if (!row.end.auto) {
    ga += ' / ' + limitToString(row.end)
  }
  if (!col.end.auto) {
    ga += ' / ' + limitToString(col.end)
  }
  return ga
}

// We may change how we store grid area state in the future, we use
// these getters to help us while refactoring the code later

function limitToLineNumber(l, count) {
  return isLimit(l) ? (l.limit > 0 ? l.limit : count + 2 + l.limit) : 0
}

function swapedIfInverted({ start, end }) {
  if (start > end) {
    return { start: end, end: start }
  } else return { start, end }
}

export function getGridDimension(area, type, limits) {
  if (!limits) {
    limits = gridAreaToGridLimits(area.gridArea)
  }
  const dim = limits[type]
  if (!dim.auto) {
    const grid = area.parent && area.parent.grid
    if (grid) {
      const count = grid[type].sizes.length
      const s = limitToLineNumber(dim.start, count)
      const e = limitToLineNumber(dim.end, count)
      return swapedIfInverted({
        start: isLimit(dim.start) ? s : e - dim.start.span,
        end: isLimit(dim.end) ? e : s + dim.end.span,
      })
    }
  }
}

export function getGridRegion(area, limits) {
  // https://developer.mozilla.org/en-US/docs/Web/CSS/grid-area
  if (!limits) {
    limits = gridAreaToGridLimits(area.gridArea)
  }
  if (!limits.auto) {
    return {
      row: getGridDimension(area, 'row', limits),
      col: getGridDimension(area, 'col', limits),
    }
  }
  return undefined // This is an auto placed grid area
}

export function getGridArea(area) {
  return area.gridArea
}

// Old naive version
/*
export function gridAreaToGridRegion(gridArea) {
  const p = gridArea.split('/')
  return {
    row: { start: parseInt(p[0]), end: parseInt(p[2]) },
    col: { start: parseInt(p[1]), end: parseInt(p[3]) },
  }
}
*/

function toValidLineNumber(l, rd) {
  return l > 0 ? l : l - (rd + 1) - 1
}
function toValidGridArea(rs, cs, re, ce, rd, cd) {
  const vrs = toValidLineNumber(rs, rd)
  const vcs = toValidLineNumber(cs, cd)
  const vre = toValidLineNumber(re, rd)
  const vce = toValidLineNumber(ce, cd)
  return `${vrs} / ${vcs} / ${vre} / ${vce}`
}

function rowIsTherePlace(pg, r, c, rowSpan, colSpan) {
  if (rowSpan === 1 && colSpan === 1) {
    return !pg[r][c]
  }
  for (let ri = r; ri < r + rowSpan; ri++) {
    for (let ci = c; ci < c + colSpan; ci++) {
      if (ri > pg.length - 1) {
        return true
      }
      if (ci > pg[0].length - 1 || pg[ri][ci]) {
        return false
      }
    }
  }
  return true
}

function colIsTherePlace(pg, r, c, rowSpan, colSpan) {
  if (rowSpan === 1 && colSpan === 1) {
    return !pg[r][c]
  }
  for (let ci = c; ci < c + colSpan; ci++) {
    for (let ri = r; ri < r + rowSpan; ri++) {
      if (ci > pg[0].length - 1) {
        return true
      }
      if (ri > pg.length - 1 || pg[ri][ci]) {
        return false
      }
    }
  }
  return true
}

function initialImplicitGrid(rows, cols) {
  const grid = new Array(rows)
  for (let r = 0; r < rows; r++) {
    grid[r] = new Array(cols).fill(false)
  }
  return {
    rd: rows,
    cd: cols,
    rows,
    cols,
    ri: 1,
    ci: 1,
    grid,
  }
}

function addTopRows(ig, count) {
  for (let i = 0; i < count; i++) {
    ig.grid.unshift(new Array(ig.cols).fill(false))
  }
  ig.ri -= count
  ig.rows += count
}

function addBottomRows(ig, count) {
  for (let i = 0; i < count; i++) {
    ig.grid.push(new Array(ig.cols).fill(false))
  }
  ig.rows += count
}

function addLeftColumns(ig, count) {
  for (let r = 0; r < ig.rows; r++) {
    for (let i = 0; i < count; i++) {
      ig.grid[r].unshift(false)
    }
  }
  ig.ci -= count
  ig.cols += count
}

function addRightColumns(ig, count) {
  for (let r = 0; r < ig.rows; r++) {
    for (let i = 0; i < count; i++) {
      ig.grid[r].push(false)
    }
  }
  ig.cols += count
}

function fillCell(ig, r, c) {
  ig.grid[r - ig.ri][c - ig.ci] = true
}

function fillGridRegion(ig, gridRegion) {
  const { row, col } = gridRegion
  if (row.start < ig.ri) {
    addTopRows(ig, ig.ri - row.start)
  }
  if (row.end - 1 > ig.rows) {
    addBottomRows(ig, row.end - 1 - ig.rows)
  }
  if (col.start < ig.ci) {
    addLeftColumns(ig, ig.ci - col.start)
  }
  if (col.end - 1 > ig.cols) {
    addRightColumns(ig, col.end - 1 - ig.cols)
  }
  for (let r = row.start; r < row.end; ++r) {
    for (let c = col.start; c < col.end; ++c) {
      fillCell(ig, r, c)
    }
  }
}

function directFillGrid(grid, r, c, rowSpan, colSpan) {
  for (let ci = c; ci < c + colSpan; ci++) {
    for (let ri = r; ri < r + rowSpan; ri++) {
      grid[ri][ci] = true
    }
  }
}

function directToValidGridArea(ig, rs, cs, re, ce) {
  return toValidGridArea(rs + ig.ri, cs + ig.ci, re + ig.ri, ce + ig.ci, ig.rd, ig.cd)
}

function fillSpan(ig, cursor, rspan, cspan) {
  const r = cursor.row,
    c = cursor.col
  if (ig.rows < r + rspan) {
    addBottomRows(ig, r + rspan - ig.rows)
  }
  if (ig.cols < c + cspan) {
    addRightColumns(ig, c + cspan - ig.cols)
  }
  directFillGrid(ig.grid, r, c, rspan, cspan)
  return directToValidGridArea(ig, r, c, r + rspan, c + cspan)
}

function placeRowLockedArea(ig, area, cursor, limits) {
  if (!limits) {
    limits = gridAreaToGridLimits(area.gridArea)
  }
  const { row, col } = limits
  const gd = getGridDimension(area, 'row', limits)
  cursor.row = gd.start + ig.ri
  for (let c = cursor.col; c < ig.cols; c++) {
    if (colIsTherePlace(ig.grid, cursor.row, c, row.span, col.span)) {
      cursor.col = c
      return fillSpan(ig, cursor, row.span, col.span)
    }
  }
  cursor.col = ig.cols
  return fillSpan(ig, cursor, row.span, col.span)
}

function placeColLockedArea(ig, area, cursor, limits) {
  if (!limits) {
    limits = gridAreaToGridLimits(area.gridArea)
  }
  const { row, col } = limits
  const gd = getGridDimension(limits, 'col')
  cursor.col = gd.start + ig.ci
  for (let r = cursor.row; r < ig.rows; r++) {
    if (rowIsTherePlace(ig.grid, r, cursor.col, row.span, col.span)) {
      cursor.row = r
      return fillSpan(ig, cursor, row.span, col.span)
    }
  }
  cursor.row = ig.rows
  return fillSpan(ig, cursor, row.span, col.span)
}

function placeAutoAreaForRowDir(ig, area, cursor, limits) {
  if (!limits) {
    limits = gridAreaToGridLimits(area.gridArea)
  }
  const { row, col } = limits
  for (let r = cursor.row; r < ig.rows; r++) {
    for (let c = cursor.col; c < ig.cols; c++) {
      if (rowIsTherePlace(ig.grid, r, c, row.span, col.span)) {
        cursor.row = r
        cursor.col = c
        return fillSpan(ig, cursor, row.span, col.span)
      }
    }
    cursor.col = 0
  }
  cursor.row = ig.rows
  cursor.col = 0
  return fillSpan(ig, cursor, row.span, col.span)
}

function placeAutoAreaForColDir(ig, area, cursor, limits) {
  if (!limits) {
    limits = gridAreaToGridLimits(area.gridArea)
  }
  const { row, col } = limits
  for (let c = cursor.col; c < ig.cols; c++) {
    for (let r = cursor.row; r < ig.rows; r++) {
      if (colIsTherePlace(ig.grid, r, c, row.span, col.span)) {
        cursor.row = r
        cursor.col = c
        return fillSpan(ig, cursor, row.span, col.span)
      }
    }
    cursor.row = 0
  }
  cursor.row = 0
  cursor.col = ig.cols
  return fillSpan(ig, cursor, row.span, col.span)
}

export function findImplicitGrid(area) {
  // https://drafts.csswg.org/css-grid/#auto-placement-algo

  const children = area.children
  const grid = area.grid
  let gridAreas
  let ig
  if (area.display === 'grid' && grid) {
    ig = initialImplicitGrid(grid.row.sizes.length, grid.col.sizes.length)

    // Preprocess areas computing limits
    const areas = children.map((area) => {
      return {
        area,
        limits: gridAreaToGridLimits(area.gridArea),
        gridArea: null,
      }
    })

    // Process the areas with a definite position (gridRegion !== undefined)
    areas.forEach((a) => {
      const gridRegion = getGridRegion(a.area, a.limits)
      if (gridRegion) {
        fillGridRegion(ig, gridRegion)
        a.gridArea = a.area.gridArea
      }
    })

    // Grid auto flow logic
    const dir = grid.autoFlow === 'row' || grid.autoFlow === 'row dense' ? 'row' : 'col'
    const dense = grid.autoFlow.includes('dense')
    const denseReset = (cursor) => {
      if (dense) {
        cursor.row = 0
        cursor.col = 0
      }
    }
    if (dir === 'row') {
      // Process the items locked to a given row
      let cursor = { row: 0, col: 0 }
      areas.forEach((a) => {
        denseReset(cursor)
        if (a.limits.col.auto && !a.limits.row.auto) {
          a.gridArea = placeRowLockedArea(ig, a.area, cursor, a.limits)
        }
      })

      // Add columns to accomodate max span for auto placed items
      const maxColSpan = areas.reduce((span, current) => {
        const { col } = current.limits
        return col.auto && span < col.span ? col.span : span
      }, 1)
      if (ig.cols < maxColSpan) {
        addRightColumns(ig, maxColSpan - ig.cols)
      }

      // Place remaining areas
      cursor = { row: 0, col: 0 }
      gridAreas = areas.map(({ area, limits, gridArea }) => {
        if (gridArea) {
          // already positioned areas:
          //  - areas with a definite position
          //  - row and column locked areas depending on grid flow
          return gridArea
        }
        denseReset(cursor)
        if (!limits.col.auto) {
          // only for autoFlow.dir === 'row', for 'col' these are already placed
          return placeColLockedArea(ig, area, cursor, limits)
        } else {
          return placeAutoAreaForRowDir(ig, area, cursor, limits)
        }
      })
    } else {
      // dir === 'col'

      // Process the items locked to a given column
      let cursor = { row: 0, col: 0 }
      areas.forEach((a) => {
        denseReset(cursor)
        if (a.limits.row.auto && !a.limits.col.auto) {
          a.gridArea = placeColLockedArea(ig, a.area, cursor, a.limits)
        }
      })

      // Add rows to accomodate max span for auto placed items
      const maxRowSpan = areas.reduce((span, current) => {
        const { row } = current.limits
        return row.auto && span < row.span ? row.span : span
      }, 1)
      if (ig.rows < maxRowSpan) {
        addBottomRows(ig, maxRowSpan - ig.rows)
      }

      // Place remaining areas
      cursor = { row: 0, col: 0 }
      gridAreas = areas.map(({ area, limits, gridArea }) => {
        if (gridArea) {
          // already positioned areas:
          //  - areas with a definite position
          //  - row and column locked areas depending on grid flow
          return gridArea
        }
        denseReset(cursor)
        if (!limits.row.auto) {
          // only for autoFlow.dir === 'col', for 'row' these are already placed
          return placeRowLockedArea(ig, area, cursor, limits)
        } else {
          return placeAutoAreaForColDir(ig, area, cursor, limits)
        }
      })
    }
  } else {
    gridAreas = children.map(() => undefined)
    ig = { rows: 1, cols: 1, ri: 1, ci: 1 }
  }
  return { gridAreas, implicitGrid: { cols: ig.cols, rows: ig.rows, ri: ig.ri, ci: ig.ci } }
}
