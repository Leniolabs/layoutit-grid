import { reactive } from 'vue'

function createTemplateArr(number) {
  return '1fr '.repeat(number).trim().split(' ')
}

export function gridTemplateToArr(str) {
  return str.split(/(?!\(.*)\s(?![^(]*?\))/g)
}

export function parseValue(str) {
  return str ? (str.startsWith('minmax') ? str.slice(7, -1) : parseFloat(str, 10)) : 0
}

export function parseUnit(str) {
  return str ? (str.startsWith('minmax') ? 'minmax' : str.match(/[\d.\-+]*\s*(.*)/)[1] || '') : 'fr'
}

export function parseValueUnit(str) {
  return {
    value: parseValue(str),
    unit: parseUnit(str),
  }
}
export function valueUnitToString({ value, unit }) {
  return unit === 'minmax' ? `minmax(${value})` : `${value}${unit}`
}

function newLineNames(n) {
  return lineNamesToState(Array(n).fill(''))
}
export function lineNamesToState(names) {
  return names.map((name) => {
    return { active: name != '', name }
  })
}

function typeIndex(type) {
  return type === 'row' ? 0 : 1
}

/*
{
  col {
    sizes,
    lineNames,
    gap
  },
  row {
    sizes,
    lineNames
    gap
  }
  areas
}
*/

export function createGridDimension(n) {
  return {
    sizes: new Array(n).fill('1fr'),
    lineNames: newLineNames(n + 1),
    gap: '1px',
  }
}

export function createGridState(r = 2, c = 3) {
  return {
    row: createGridDimension(r),
    col: createGridDimension(c),
    areas: [],
  }
}

export function getRowValue(grid, n) {
  return parseValue(grid.row.sizes[n])
}

export function getRowUnit(grid, n) {
  return parseUnit(grid.row.sizes[n])
}

export function getColValue(grid, n) {
  return parseValue(grid.col.sizes[n])
}

export function getColUnit(grid, n) {
  return parseUnit(grid.col.sizes[n])
}

export function setRowValueUnit(grid, n, x) {
  grid.row.sizes[n] = valueUnitToString(x)
}

export function setRowValue(grid, n, value) {
  setRowValueUnit(grid, n, { value, unit: getRowUnit(grid, n) })
}

export function setColValueUnit(grid, n, x) {
  grid.col.sizes[n] = valueUnitToString(x)
}

export function setColValue(grid, n, value) {
  setColValueUnit(grid, n, { value, unit: getColUnit(grid, n) })
}

export function addToDimension(dimension, val) {
  dimension.sizes.push(val)
  dimension.lineNames.push({ active: false, name: '' })
}

export function addCol(grid, colStr) {
  addToDimension(grid.col, colStr)
}

export function addRow(grid, rowStr) {
  addToDimension(grid.row, rowStr)
}

export function removeFromDimension(grid, type, n) {
  const { areas } = grid
  for (let i = 0; i < areas.length; ) {
    const { gridRegion } = areas[i]
    if (n + 1 < gridRegion[type].start) {
      --gridRegion[type].start
      --gridRegion[type].end
    } else if (n + 1 < gridRegion[type].end) {
      --gridRegion[type].end
    }
    if (gridRegion[type].end <= gridRegion[type].start) {
      // delete area if it collapses
      areas.splice(i, 1)
    } else {
      ++i
    }
  }
  grid[type].sizes.splice(n, 1)
  grid[type].lineNames.splice(n, 1)
}

export function removeCol(grid, n) {
  removeFromDimension(grid, 'col', n)
}

export function removeRow(grid, n) {
  removeFromDimension(grid, 'row', n)
}

// FlexItem { name, color, grow, shrink, basis }

export function createFlexItemState({
  name = 'default',
  color = 'rgba(253, 216, 53, 0.3)',
  grow = 0,
  shrink = 1,
  basis = '100%',
} = {}) {
  return { name, color, grow, shrink, basis }
}

export function createFlexState({
  direction = 'row',
  wrap = 'nowrap',
  defaultItem = createFlexItemState(),
  items = [defaultItem, defaultItem, defaultItem, defaultItem],
} = {}) {
  return { direction, wrap, items, defaultItem }
}

const colors = [
  'rgba(230, 25, 75, 0.8)',
  'rgba(60, 180, 75, 0.8)',
  'rgba(245, 130, 48, 0.8)',
  'rgba(240, 50, 230, 0.8)',
  'rgba(0, 128, 128, 0.8)',
]

export function createAreaState() {
  return {
    name: 'grid-container',
    color: colors[0],
    grid: createGridState(3, 4),
    flex: null,
    gridRegion: null,
  }
}

function findAreaParent(area, parent) {
  const { grid } = parent
  if (!grid) {
    return undefined
  }
  if (grid.areas.find((a) => a.name === area.name)) {
    return parent
  }
  let p
  grid.areas.forEach((ap) => {
    if (!p) {
      p = findAreaParent(area, ap)
    }
  })
  return p
}

const data = reactive({
  area: createAreaState(),
  currentArea: null,
  currentItem: null,
  dragging: null,
  colors,
})

data.currentArea = data.area

export function isValidAreaName(newName, area = data.area) {
  const { name, grid } = area
  return name !== newName && !(grid && !grid.areas.every((a) => isValidAreaName(newName, a)))
}

export var store = {
  data,
  getRandomColor() {
    const { colors } = this.data
    return colors[Math.floor(Math.random() * colors.length)]
  },
  setCurrentArea(area) {
    this.data.currentArea = area
  },
  setArea(area) {
    debugger
    this.data.area = area
    this.setCurrentArea(area)
  },
  getAreaParent(area) {
    return findAreaParent(area, this.data.area)
  },
  getAreaDepth(area) {
    const parent = this.getAreaParent(area)
    if (parent) {
      return this.getAreaDepth(parent) + 1
    } else {
      return 0
    }
  },
}

export default store