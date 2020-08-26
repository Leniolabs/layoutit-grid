import { computed } from 'vue'
import { mainArea, currentArea } from '../store.js'

export function useIsMainArea(area) {
  return computed(() => area === mainArea.value)
}

export function useIsCurrentArea(area) {
  return computed(() => area === currentArea.value)
}

function isActiveArea(area) {
  return area === currentArea.value || (area.parent ? isActiveArea(area.parent) : false)
}

export function useIsActiveArea(area) {
  return computed(() => isActiveArea(area))
}

export function useGridDimensions(gridRef) {
  return {
    colsNumber: computed(() => gridRef.value.col.sizes.length),
    rowsNumber: computed(() => gridRef.value.row.sizes.length),
  }
}
