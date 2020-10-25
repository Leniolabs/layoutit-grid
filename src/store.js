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
    case 'initial':
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
}
*/

export function createGridDimension(n) {
  return {
    sizes: new Array(n).fill('1fr'),
    auto: 'initial',
    lineNames: newLineNames(n + 1),
    gap: '0px',
    justifyContent: 'stretch',
    alignContent: 'stretch',
    justifyItems: 'stretch',
    alignItems: 'stretch',
  }
}

export function createGridState(r = 2, c = 3) {
  return {
    row: createGridDimension(r),
    col: createGridDimension(c),
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

export function withChangedValue(current, newValue) {
  return valueUnitToString({ value: newValue, unit: parseUnit(current) })
}

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
export function withChangedUnit(current, newUnit) {
  return valueUnitToString({ value: unitMeasureMap[newUnit], unit: newUnit })
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

export function removeFromDimension(area, type, n) {
  const { grid, children } = area
  for (let i = 0; i < children.length; ) {
    const { gridRegion } = children[i]
    if (gridRegion) {
      if (n + 1 < gridRegion[type].start) {
        --gridRegion[type].start
        --gridRegion[type].end
      } else if (n + 1 < gridRegion[type].end) {
        --gridRegion[type].end
      }
      if (gridRegion[type].end <= gridRegion[type].start) {
        // delete area if it collapses
        children.splice(i, 1)
      } else {
        ++i
      }
    } else {
      ++i
    }
  }
  batch(() => {
    grid[type].sizes.splice(n, 1)
    grid[type].lineNames.splice(n, 1)
  })
}

export function removeCol(area, n) {
  removeFromDimension(area, 'col', n)
}

export function removeRow(area, n) {
  removeFromDimension(area, 'row', n)
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
  type = 'div',
  display = 'block',
  grid = null,
  flex = null,
  gridRegion = null,
  width = '100%',
  height = '100%',
  justifySelf = 'stretch',
  alignSelf = 'stretch',
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
    gridRegion,
    width,
    height,
    justifySelf,
    alignSelf,
    items,
    children,
    parent,
  }
}

function createMainAreaState() {
  return createAreaState({
    name: 'grid-container',
    color: colors[0],
    type: 'div',
    display: 'grid',
    grid: createGridState(3, 4),
    justifySelf: 'center',
    alignSelf: 'start',
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
  area.children.forEach((child) => parentify(child, area))
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
  return name !== newName && !(grid && !area.children.every((a) => isValidAreaName(newName, a)))
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
  const { children } = area.parent
  children.splice(children.indexOf(area), 1)
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
