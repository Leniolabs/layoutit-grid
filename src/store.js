import { ref, watch } from 'vue'
import { useRefHistory } from '@vueuse/core'

export * from './store/grid.js'
export * from './store/flex.js'
export * from './store/area.js'

import { createAreaState, parseArea, serializeArea } from './store/area.js'
import { createGridState } from './store/grid.js'

function createMainAreaState() {
  return createAreaState({
    name: 'grid-container',
    type: 'div',
    display: 'grid',
    grid: createGridState(3, 4),
    justifySelf: 'center',
    alignSelf: 'start',
  })
}

export const mainArea = ref(createMainAreaState())
export const currentArea = ref(mainArea.value)
export const dragging = ref(null)
export const currentFocus = ref(null)
export const currentHover = ref(null)
export const currentView = ref('editor')
export const darkmode = ref(false)

watch(mainArea, (area) => setCurrentArea(area))

export const { undo, redo, undoStack, redoStack, pause, resume, batch } = useRefHistory(mainArea, {
  capacity: 100,
  parse: parseArea,
  dump: serializeArea,
  deep: true,
})

export function setCurrentArea(area) {
  currentArea.value = area
}

export function setMainArea(area) {
  mainArea.value = area
}

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

export function isValidAreaName(newName, area = mainArea.value) {
  const { name, grid } = area
  return name !== newName && !(grid && !area.children.every((a) => isValidAreaName(newName, a)))
}

// This should go in grid.js, we need to check again if we can use sync:pre in the history management before

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
