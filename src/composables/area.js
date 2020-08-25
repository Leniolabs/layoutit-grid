import { computed } from 'vue'
import { mainArea, currentArea } from '../store.js'

export function useIsCurrentArea(area) {
  return computed(() => area === currentArea.value)
}

export function useIsMainArea(area) {
  return computed(() => area === mainArea.value)
}

export function useGridDimensions(gridRef) {
  return {
    colsNumber: computed(() => gridRef.value.col.sizes.length),
    rowsNumber: computed(() => gridRef.value.row.sizes.length),
  }
}
