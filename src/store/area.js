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
  justifySelf = 'stretch',
  alignSelf = 'stretch',
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

const parentRemover = (key, value) => (key === 'parent' ? null : value)

export function serializeArea(area) {
  return JSON.stringify({ area: area, version: 1 }, parentRemover)
}
export function parseArea(area) {
  return parentify(JSON.parse(area).area)
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
  const valid = !!(row.start && row.end && col.start && col.end)
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

export function getGridRegion(area) {
  // https://developer.mozilla.org/en-US/docs/Web/CSS/grid-area
  const limits = gridAreaToGridLimits(area.gridArea)
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

function fillSpace(pg, r, c, rowSpan, colSpan) {
  for (let ci = c; ci < c + colSpan; ci++) {
    for (let ri = r; ri < r + rowSpan; ri++) {
      pg[ri][ci] = true
    }
  }
}

export function findImplicitGrid(area) {
  const children = area.children
  const grid = area.grid
  let gridAreas, rows, cols, ri, ci
  if (area.display === 'grid' && grid) {
    const rd = grid.row.sizes.length
    const cd = grid.col.sizes.length
    rows = rd
    cols = cd
    ri = 1
    ci = 1
    const pg = new Array(rows)
    for (let r = 0; r < rows; r++) {
      pg[r] = new Array(cols).fill(false)
    }
    children.forEach((area) => {
      const gridRegion = getGridRegion(area)
      if (gridRegion) {
        const { row, col } = gridRegion
        if (row.start < ri) {
          const diff = ri - row.start
          for (let i = 0; i < diff; i++) {
            pg.unshift(new Array(cols).fill(false))
          }
          ri -= diff
          rows += diff
        }
        if (row.end - 1 > rows) {
          const diff = row.end - 1 - rows
          for (let i = 0; i < diff; i++) {
            pg.push(new Array(cols).fill(false))
          }
          rows += diff
        }
        if (col.start < ci) {
          const diff = ci - col.start
          for (let r = 0; r < rows; r++) {
            for (let i = 0; i < diff; i++) {
              pg[r].unshift(false)
            }
          }
          ci -= diff
          cols += diff
        }
        if (col.end - 1 > cols) {
          const diff = col.end - 1 - cols
          for (let r = 0; r < rows; r++) {
            for (let i = 0; i < diff; i++) {
              pg[r].push(false)
            }
          }
          cols += diff
        }
        for (let r = row.start; r < row.end; ++r) {
          for (let c = col.start; c < col.end; ++c) {
            pg[r - ri][c - ci] = true
          }
        }
      }
    })

    // Process the items locked to a given row
    children.forEach((area) => {
      const { row, col } = gridAreaToGridLimits(area.gridArea)
      if (col.auto && !row.auto) {
        // row.start, row.start, col.span
        // TODO:
      }
    })
    // Process the items locked to a given column
    children.forEach((area) => {
      const { col, row } = gridAreaToGridLimits(area.gridArea)
      if (row.auto && !col.auto) {
        // col.start, col.end, row.span
        // TODO:
      }
    })

    // TODO: add rows or columns to accomodate max span for auto placed items
    if (grid.autoFlow === 'row' || grid.autoFlow === 'row dense') {
      const maxColSpan = children.reduce((span, current) => {
        const { col } = gridAreaToGridLimits(current.gridArea)
        return col.auto && span < col.span ? col.span : span
      }, 1)
      if (cols < maxColSpan) {
        const diff = maxColSpan - cols
        for (let r = 0; r < rows; r++) {
          for (let i = 0; i < diff; i++) {
            pg[r].push(false)
          }
        }
        cols += diff
      }
    } else {
      const maxRowSpan = children.reduce((span, current) => {
        const { row } = gridAreaToGridLimits(current.gridArea)
        return row.auto && span < row.span ? row.span : span
      }, 1)
      if (rows < maxRowSpan) {
        const diff = maxRowSpan - rows
        for (let i = 0; i < diff; i++) {
          pg.push(new Array(cols).fill(false))
        }
        rows += diff
      }
    }

    gridAreas = children.map((area) => {
      const { row, col, auto } = gridAreaToGridLimits(area.gridArea)
      if (!auto) {
        return getGridArea(area)
      } else {
        if (grid.autoFlow === 'row' || grid.autoFlow === 'row dense') {
          // TODO: take into account grid-area span
          for (let r = 0; r < rows; r++) {
            for (let c = 0; c < cols; c++) {
              if (rowIsTherePlace(pg, r, c, row.span, col.span)) {
                // TODO: rowSpan
                fillSpace(pg, r, c, row.span, col.span)
                return toValidGridArea(r + ri, c + ci, r + ri + row.span, c + ci + col.span, rd, cd)
              }
            }
          }
          // TODO: rowSpan
          rows++
          pg.push(new Array(cols).fill(false))
          pg[rows - 1][0] = true
          return toValidGridArea(rows - 1 + ri, ci, rows - 1 + ri + row.span, ci + col.span, rd, cd)
        } else {
          // auto flow column
          for (let c = 0; c < cols; c++) {
            for (let r = 0; r < rows; r++) {
              if (colIsTherePlace(pg, r, c, row.span, col.span)) {
                // TODO: colSpan
                fillSpace(pg, r, c, row.span, col.span)
                return toValidGridArea(r + ri, c + ci, r + ri + row.span, c + ci + col.span, rd, cd)
              }
            }
          }
          // TODO: colSpan
          cols++
          for (let r = 0; r < rows; r++) {
            pg[r].push(false)
          }
          pg.push(new Array(cols).fill(false))
          pg[0][cols - 1] = true
          return toValidGridArea(ri, cols - 1 + ci, ri + row.span, cols - 1 + ci + col.span, rd, cd)
        }
      }
    })
  } else {
    gridAreas = children.map(() => undefined)
    rows = cols = 1
    ri = ci = 1
  }
  return { gridAreas, implicitGrid: { cols, rows, ri, ci } }
}
