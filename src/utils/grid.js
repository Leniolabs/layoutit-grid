// TODO: review if default parsed value is needed

function internalParseValue(str) {
  return str.startsWith('minmax') ? str.slice(7, -1) : parseFloat(str, 10)
}
export function parseValue(str) {
  return str ? internalParseValue(str) : 0
}

function internalParseUnit(str) {
  return str.startsWith('minmax') ? 'minmax' : str.match(/[\d.\-+]*\s*(.*)/)[1] || ''
}

export const validGridUnits = ['fr', 'px', '%', 'em', 'auto', 'min-content', 'max-content', 'minmax']

export function parseUnit(str) {
  return str ? internalParseUnit(str) : 'fr'
}

export function parseValueUnit(str) {
  return {
    value: parseValue(str),
    unit: parseUnit(str),
  }
}

export function isValidTrackSize(str) {
  const unit = internalParseUnit(str)
  return validGridUnits.includes(unit) && (unit === 'minmax' || str.replace(unit, '').match(/^[-+]?[0-9]*\.?[0-9]+$/))
}

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
    return { auto: true, span: 1 }
  }
  const parts = trimSplit(s, 'span ')
  if (parts.length > 1) {
    const span = parseInt(parts[1])
    if (Number.isNaN(span) || span < 1) {
      return undefined
    }
    return { auto: false, span }
  } else {
    const limit = parseLimit(s)
    if (Number.isNaN(limit)) {
      return undefined
    }
    return { auto: false, limit }
  }
}

function isLimit(l) {
  return l && l.limit !== undefined
}

function dimensionSpan({ start, end }) {
  const sl = isLimit(start)
  const el = isLimit(end)
  if (!sl && !el) {
    return start.auto ? end.span : start.span
  }
  if (sl && el) {
    return Math.max(1, Math.abs(end.limit - start.limit))
  }
  return sl ? end.span : start.span
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
    row.span = dimensionSpan(row)
    col.span = dimensionSpan(col)
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

function swappedIfInverted({ start, end }) {
  if (start > end) {
    return { start: end, end: start }
  } else return { start, end }
}
function handleEqualLimits(limits) {
  return limits.start === limits.end ? { start: limits.start, end: limits.end + 1 } : limits
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
      return handleEqualLimits(
        swappedIfInverted({
          start: isLimit(dim.start) ? s : e - dim.start.span,
          end: isLimit(dim.end) ? e : s + dim.end.span,
        })
      )
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

export function explicitGridAreaToGridRegion(gridArea) {
  const p = gridArea.split('/')
  return {
    row: { start: parseInt(p[0]), end: parseInt(p[2]) },
    col: { start: parseInt(p[1]), end: parseInt(p[3]) },
  }
}

export function asValidLineNumber(n, type, implicitGrid) {
  return n - (n > 0 ? 0 : type === 'row' ? implicitGrid.rd + 2 : implicitGrid.cd + 2)
}

export function asValidGridArea(rs, cs, re, ce, implicitGrid) {
  return `${asValidLineNumber(rs, 'row', implicitGrid)} / ${asValidLineNumber(
    cs,
    'col',
    implicitGrid
  )} / ${asValidLineNumber(re, 'row', implicitGrid)} / ${asValidLineNumber(ce, 'col', implicitGrid)}`
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

function ensureRowSpace(ig, row) {
  if (row.start < ig.ri) {
    addTopRows(ig, ig.ri - row.start)
  }
  if (row.end - ig.ri > ig.rows) {
    addBottomRows(ig, row.end - ig.ri - ig.rows)
  }
}

function ensureColSpace(ig, col) {
  if (col.start < ig.ci) {
    addLeftColumns(ig, ig.ci - col.start)
  }
  if (col.end - ig.ci > ig.cols) {
    addRightColumns(ig, col.end - ig.ci - ig.cols)
  }
}

function fillGridRegion(ig, gridRegion) {
  const { row, col } = gridRegion
  ensureRowSpace(ig, row)
  ensureColSpace(ig, col)
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
  return asValidGridArea(rs + ig.ri, cs + ig.ci, re + ig.ri, ce + ig.ci, ig)
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
  ensureRowSpace(ig, gd)
  cursor.row = gd.start - ig.ri
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
  const gd = getGridDimension(area, 'col', limits)
  ensureColSpace(ig, gd)
  cursor.col = gd.start - ig.ci
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
  // https://www.w3.org/TR/css-grid-1/#auto-placement-algo

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
      let cursor = { row: 0, col: 0 }

      // Process the items locked to a given row
      areas.forEach((a) => {
        denseReset(cursor)
        if (a.limits.col.auto && !a.limits.row.auto) {
          a.gridArea = placeRowLockedArea(ig, a.area, cursor, a.limits)
        }
      })

      // Process the items locked to a given column
      areas.forEach((a) => {
        if (a.limits.row.auto && !a.limits.col.auto) {
          const col = getGridDimension(a.area, 'col', a.limits)
          ensureColSpace(ig, col)
        }
      })

      // Add columns to accommodate max span for auto placed items
      const maxColSpan = areas.reduce((span, current) => {
        const { col, row } = current.limits
        return col.auto && row.auto && span < col.span ? col.span : span
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

      let cursor = { row: 0, col: 0 }

      // Process the items locked to a given column
      areas.forEach((a) => {
        denseReset(cursor)
        if (a.limits.row.auto && !a.limits.col.auto) {
          a.gridArea = placeColLockedArea(ig, a.area, cursor, a.limits)
        }
      })

      // Ensure space for the items locked to a given row
      areas.forEach((a) => {
        if (a.limits.col.auto && !a.limits.row.auto) {
          const row = getGridDimension(a.area, 'row', a.limits)
          ensureRowSpace(ig, row)
        }
      })

      // Add rows to accommodate max span for auto placed items
      const maxRowSpan = areas.reduce((span, current) => {
        const { row, col } = current.limits
        return row.auto && col.auto && span < row.span ? row.span : span
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
  return { gridAreas, implicitGrid: { cols: ig.cols, rows: ig.rows, ri: ig.ri, ci: ig.ci, rd: ig.rd, cd: ig.cd } }
}
