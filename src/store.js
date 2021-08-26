import { useRefHistory, useLocalStorage } from '@vueuse/core'

export * from './store/grid.ts'
export * from './store/flex.js'
export * from './store/area.js'

import {
  createAreaState,
  parseArea,
  serializeArea,
  getGridDimension,
  gridLimitsToGridArea,
  gridAreaToGridLimits,
  getRandomColor,
} from './store/area.js'
import { createGridState, isValidTrackSize } from './store/grid.ts'
import { gridRegionToGridArea } from './utils.js'
import { asValidGridArea } from './utils/grid.js'

function createMainAreaState() {
  return createAreaState({
    name: 'container',
    type: 'div',
    display: 'grid',
    grid: createGridState(),
    justifySelf: 'center',
    alignSelf: 'center',
    width: 'auto',
    height: 'auto',
    color: '#1e1e1e',
  })
}

export const mainArea = ref(createMainAreaState())
export const currentArea = ref(mainArea.value)
export const overArea = ref(null)
export const dragging = ref(null)
export const reordering = ref(null)
export const currentFocus = ref(null)
export const currentHover = ref(null)
export const currentView = ref('editor')
export const darkmode = ref(false)
export const selection = ref(null)

export const useMainArea = () => mainArea
export const useCurrentArea = () => currentArea
export const useOverArea = () => useOverArea
export const useDragging = () => dragging
export const useReordering = () => reordering
export const useCurrentFocus = () => currentFocus
export const useCurrentHover = () => currentHover
export const useCurrentView = () => currentView
export const useDarkmode = () => darkmode
export const useSelection = () => selection

export const preferredExport = useLocalStorage('layoutit-grid-preferred-export', 'codepen')

const areaNameCounter = ref(1)

function selectionDimension(type, start, end) {
  return {
    start: Math.min(start[type].start, end[type].start),
    end: Math.max(start[type].end, end[type].end),
  }
}

function selectionArea(selection) {
  const { start, end } = selection
  return {
    row: selectionDimension('row', start, end),
    col: selectionDimension('col', start, end),
  }
}

export function selectionGridArea(selection) {
  const gr = selectionArea(selection)
  return asValidGridArea(gr.row.start, gr.col.start, gr.row.end, gr.col.end, selection.implicitGrid)
}

export function newAreaName() {
  let name
  do {
    name = 'a' + areaNameCounter.value
    areaNameCounter.value++
  } while (!isValidAreaName(name))
  return name
}

watch(mainArea, (area) => setCurrentArea(area))

export const { undo, redo, clear, canUndo, canRedo, pause, resume, last } = useRefHistory(mainArea, {
  capacity: 100,
  parse: parseArea,
  dump: serializeArea,
  deep: true,
})

const stateStorage = useLocalStorage('layoutit-grid-app-state', serializeArea(mainArea.value))
watch(
  last,
  () => {
    stateStorage.value = last.value.snapshot
  },
  { deep: true }
)
export function loadFromStorage() {
  if (stateStorage.value) {
    try {
      const area = parseArea(stateStorage.value)
      area.alignSelf = 'center' // Some areas were saved with alignSelf start
      mainArea.value = area
      clear()
    } catch (error) {
      console.log(error)
      stateStorage.value = undefined
    }
  }
}

export function setCurrentArea(area) {
  if (selection.value && selection.value.area && selection.value.area !== area) {
    selection.value = null
  }
  currentArea.value = area
}

export function setMainArea(area) {
  mainArea.value = area
}

export function deselectCurrentArea() {
  setCurrentArea(mainArea.value)
}

// This function will be removed once we migrate to display types (block, flex, grid)
export function clearArea(area) {
  area.children = []

  area.display = 'block'
  area.grid = null
  area.flex = null
}

export function removeArea(area) {
  const parent = area.parent
  const { children } = parent
  children.splice(children.indexOf(area), 1)
  currentArea.value = parent
}

export function restart() {
  setMainArea(createMainAreaState())
  // Commented, preserve history after a restart
  // clear()
}

export function isValidAreaName(newName, area = mainArea.value) {
  const { name, grid } = area
  return newName && name !== newName && !(grid && !area.children.every((a) => isValidAreaName(newName, a)))
}

export const isValidFlexBasis = isValidTrackSize

export const isValidGapSize = isValidTrackSize

// This should go in grid.js, we need to check again if we can use sync:pre in the history management before

export function addToDimension(dimension, val) {
  selection.value = null
  dimension.sizes.push(val)
  dimension.lineNames.push({ active: false, name: '' })
}

export function addCol(grid, colStr) {
  addToDimension(grid.col, colStr)
}

export function addRow(grid, rowStr) {
  addToDimension(grid.row, rowStr)
}

function reduceLimit(l) {
  if (l.limit) {
    if (l.limit > 0) {
      l.limit--
    } else {
      l.limit++
    }
  } else if (l.span) {
    l.span--
  }
}

export function removeFromDimension(area, type, n) {
  selection.value = null
  const { grid, children } = area
  const toRemove = [],
    toChange = []
  for (let i = 0; i < children.length; ++i) {
    const limits = gridAreaToGridLimits(children[i].gridArea)
    const dim = getGridDimension(children[i], type, limits)
    const { start, end } = limits[type]
    if (limits.valid && !limits[type].auto) {
      if (n + 1 < dim.start) {
        reduceLimit(start)
        reduceLimit(end)
      } else if (n + 1 < dim.end) {
        limits[type].span--
        if (start.limit) {
          reduceLimit(end)
        } else {
          reduceLimit(start)
        }
      } else if (n + 1 >= dim.end) {
        if (start.limit && start.limit < -1) {
          start.limit++
        }
        if (end.limit && end.limit < -1) {
          end.limit++
        }
      }
      if (limits[type].span === 0) {
        // delete area if it collapses
        toRemove.push(i)
      } else {
        toChange.push({ i, gridArea: gridLimitsToGridArea(limits) })
      }
    } else {
      ++i
    }
  }
  for (let i = toChange.length - 1; i >= 0; i--) {
    children[toChange[i].i].gridArea = toChange[i].gridArea
  }
  for (let i = toRemove.length - 1; i >= 0; i--) {
    area.children.splice(toRemove[i], 1)
  }
  grid[type].sizes.splice(n, 1)
  grid[type].lineNames.splice(n, 1)
}

export function removeCol(area, n) {
  removeFromDimension(area, 'col', n)
}

export function removeRow(area, n) {
  removeFromDimension(area, 'row', n)
}

const counter = ref(1)
export function addImplicitArea(area) {
  selection.value = null
  area.children.push(
    createAreaState({
      name: 'i' + counter.value++,
      parent: area,
      color: getRandomColor(),
    })
  )
}

export function subGrid(area) {
  selection.value = null
  clearArea(area)
  if (!area.grid) {
    area.type = 'div'
    area.display = 'grid'
    area.grid = createGridState()
  }
  setCurrentArea(area)
}

const appState = {
  mainArea,
  currentArea,
  overArea,
  dragging,
  reordering,
  currentFocus,
  currentHover,
  currentView,
  darkmode,
  selection,
  preferredExport,
  canUndo,
  canRedo,
}

export const useAppState = () => appState
