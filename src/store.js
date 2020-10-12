import { ref, computed, watch } from 'vue'

function createTemplateArr(number) {
  return '1fr '.repeat(number).trim().split(' ')
}

export function gridTemplateToArr(str) {
  return str.split(/(?!\(.*)\s(?![^(]*?\))/g)
}

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

export function isValidLineName(str) {
  return true
}

export function valueUnitToString({ value, unit }) {
  switch (unit) {
    case 'minmax':
      return `minmax(${value})`
    case 'min-content':
    case 'max-content':
    case 'auto':
      return unit
    default:
      return `${value}${unit}`
  }
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
    gap: '0px',
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
  batch(() => {
    dimension.sizes.push(val)
    dimension.lineNames.push({ active: false, name: '' })
  })
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
  batch(() => {
    grid[type].sizes.splice(n, 1)
    grid[type].lineNames.splice(n, 1)
  })
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

export function createAreaState({
  name = 'area',
  color = colors[0],
  grid = null,
  flex = null,
  gridRegion = null,
  parent = null,
}) {
  return { name, color, grid, flex, gridRegion, parent }
}

function createMainAreaState() {
  return createAreaState({
    name: 'grid-container',
    color: colors[0],
    grid: createGridState(3, 4),
  })
}

export const mainArea = ref(createMainAreaState())
export const currentArea = ref(mainArea.value)
export const currentItem = ref(null)
export const dragging = ref(null)
export const currentFocus = ref(null)
export const currentHover = ref(null)
export const currentView = ref('editor')
export const darkmode = ref(false)

function parentify(area, parent = null) {
  area.parent = parent
  if (area.grid) {
    area.grid.areas.forEach((child) => parentify(child, area))
  }
  return area
}

const parentRemover = (key, value) => (key === 'parent' ? null : value)

function serializeArea(area) {
  return JSON.stringify({ area: area, version: 1 }, parentRemover)
}
function parseArea(area) {
  return parentify(JSON.parse(area).area)
}

import { useRefHistory } from '@vueuse/core'

export const { undo, redo, undoStack, redoStack, pause, resume, batch } = useRefHistory(mainArea, {
  capacity: 100,
  parse: parseArea,
  dump: serializeArea,
  deep: true,
})

export function isValidAreaName(newName, area = mainArea.value) {
  const { name, grid } = area
  return name !== newName && !(grid && !grid.areas.every((a) => isValidAreaName(newName, a)))
}

export function getRandomColor() {
  return colors[Math.floor(Math.random() * colors.length)]
}

export function setCurrentArea(area) {
  currentArea.value = area
}

export function setMainArea(area) {
  mainArea.value = area
}

watch(mainArea, (area) => setCurrentArea(area))

export function deselectCurrentArea() {
  setCurrentArea(mainArea.value)
}

export function clearArea(area) {
  area.grid = null
  area.flex = null
  deselectCurrentArea()
}

export function removeArea(area) {
  const { areas } = area.parent.grid
  areas.splice(areas.indexOf(area), 1)
  deselectCurrentArea()
}

export function restart() {
  setMainArea(createMainAreaState())
  // Commented, preserve history after a restart
  // clear()
}

export function getAreaDepth(area) {
  const parent = area.parent
  if (parent) {
    return getAreaDepth(parent) + 1
  } else {
    return 0
  }
}
