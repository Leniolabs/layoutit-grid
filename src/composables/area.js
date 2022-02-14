import { mainArea, currentArea } from '../store.js'

export function useIsMainArea(area) {
  return computed(() => area.value === mainArea.value)
}

export function useIsCurrentArea(area) {
  return computed(() => area.value === currentArea.value)
}

function isActiveArea(area) {
  return (
    area === currentArea.value ||
    area.children.some((c) => c.children.length === 0 && c === currentArea.value) ||
    (area.parent ? isActiveArea(area.parent) : false)
  )
}

export function useIsActiveArea(area) {
  return computed(() => isActiveArea(area.value))
}

export function useGridDimensions(grid) {
  return {
    colsNumber: computed(() => grid.value.col.sizes.length),
    rowsNumber: computed(() => grid.value.row.sizes.length),
  }
}
