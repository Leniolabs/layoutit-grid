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
  const rowStart = parseGridLimit(parts[0])
  const colStart = parseGridLimit(parts[1])
  const rowEnd = parseGridLimit(parts[2])
  const colEnd = parseGridLimit(parts[3])
  const valid = rowStart && rowEnd && colStart && colEnd
  let colSpan, rowSpan
  if (valid) {
    rowSpan = isLimit(rowStart)
      ? isLimit(rowEnd)
        ? Math.abs(rowEnd.limit - rowStart.limit)
        : rowEnd.span
      : rowStart.span
    colSpan = isLimit(colStart)
      ? isLimit(colEnd)
        ? Math.abs(colEnd.limit - colStart.limit)
        : colEnd.span
      : colStart.span
  }
  const auto = !valid || !((isLimit(rowStart) || isLimit(rowEnd)) && (isLimit(colStart) || isLimit(colEnd)))
  const rowAuto = !valid || (auto && !isLimit(rowStart) && !isLimit(rowEnd))
  const colAuto = !valid || (auto && !isLimit(colStart) && !isLimit(colEnd))
  return { rowStart, colStart, rowEnd, colEnd, rowSpan, colSpan, valid, auto, rowAuto, colAuto }
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

export function getGridRegion(area) {
  // https://developer.mozilla.org/en-US/docs/Web/CSS/grid-area
  const { rowStart, colStart, rowEnd, colEnd, auto } = gridAreaToGridLimits(area.gridArea)
  if (!auto) {
    const grid = area.parent && area.parent.grid
    if (grid) {
      const cols = grid.col.sizes.length
      const rows = grid.row.sizes.length
      const rs = limitToLineNumber(rowStart, rows)
      const re = limitToLineNumber(rowEnd, rows)
      const cs = limitToLineNumber(colStart, cols)
      const ce = limitToLineNumber(colEnd, cols)
      const row = { start: isLimit(rowStart) ? rs : re - rowStart.span, end: isLimit(rowEnd) ? re : rs + rowEnd.span }
      const col = { start: isLimit(colStart) ? cs : ce - colStart.span, end: isLimit(colEnd) ? ce : cs + colEnd.span }
      return { row: swapedIfInverted(row), col: swapedIfInverted(col) }
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
      const { rowStart, rowEnd, colSpan, rowAuto, colAuto } = gridAreaToGridLimits(area.gridArea)
      if (colAuto && !rowAuto) {
        // rowStart, rowStart, colSpan
        // TODO:
      }
    })
    // Process the items locked to a given column
    children.forEach((area) => {
      const { colStart, colEnd, rowSpan, rowAuto, colAuto } = gridAreaToGridLimits(area.gridArea)
      if (rowAuto && !colAuto) {
        // colStart, colEnd, rowSpan
        // TODO:
      }
    })

    // TODO: add rows or columns to accomodate max span for auto placed items
    if (grid.autoFlow === 'row' || grid.autoFlow === 'row dense') {
      const maxColSpan = children.reduce((span, current) => {
        const { colSpan, colAuto } = gridAreaToGridLimits(current.gridArea)
        return colAuto && span < colSpan ? colSpan : span
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
        const { rowSpan, rowAuto } = gridAreaToGridLimits(current.gridArea)
        return rowAuto && span < rowSpan ? rowSpan : span
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
      const { rowSpan, colSpan, auto } = gridAreaToGridLimits(area.gridArea)
      if (!auto) {
        return getGridArea(area)
      } else {
        if (grid.autoFlow === 'row' || grid.autoFlow === 'row dense') {
          // TODO: take into account grid-area span
          for (let r = 0; r < rows; r++) {
            for (let c = 0; c < cols; c++) {
              if (rowIsTherePlace(pg, r, c, rowSpan, colSpan)) {
                // TODO: rowSpan
                fillSpace(pg, r, c, rowSpan, colSpan)
                return toValidGridArea(r + ri, c + ci, r + ri + rowSpan, c + ci + colSpan, rd, cd)
              }
            }
          }
          // TODO: rowSpan
          rows++
          pg.push(new Array(cols).fill(false))
          pg[rows - 1][0] = true
          return toValidGridArea(rows - 1 + ri, ci, rows - 1 + ri + rowSpan, ci + colSpan, rd, cd)
        } else {
          // auto flow column
          for (let c = 0; c < cols; c++) {
            for (let r = 0; r < rows; r++) {
              if (colIsTherePlace(pg, r, c, rowSpan, colSpan)) {
                // TODO: colSpan
                fillSpace(pg, r, c, rowSpan, colSpan)
                return toValidGridArea(r + ri, c + ci, r + ri + rowSpan, c + ci + colSpan, rd, cd)
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
          return toValidGridArea(ri, cols - 1 + ci, ri + rowSpan, cols - 1 + ci + colSpan, rd, cd)
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
