<template>
  <section
    :data-col-start="section.col.start"
    :data-row-start="section.row.start"
    :data-col-end="section.col.end"
    :data-row-end="section.row.end"
    :style="{
      gridArea: `${section.row.start} / ${section.col.start} / ${section.row.start + 1} / ${section.col.start + 1}`,
    }"
    :class="{
      lastcol: section.col.start === colsNumber && section.row.start === 1,
      lastrow: section.row.start === rowsNumber && section.col.start === 1,
      dragging,
      grayed,
      focused,
    }"
    class="grid-section"
    @pointerdown="$emit('pointerdown', $event)"
    @mouseover="onMouseOver"
  />
</template>

<script setup>
import { defineProps, defineEmit } from 'vue'
import { dragging, setCurrentArea, parseValueUnit, valueUnitToString, pause, resume, overArea } from '../../store.js'
import { explicitGridAreaToGridRegion } from '../../utils/grid.js'
import { useGridDimensions } from '../../composables/area.js'

function calcValue(prev, prevComp, delta) {
  const sizeAdd = (prev.value * delta) / prevComp.value

  let value = +(prev.value + sizeAdd).toFixed(1)

  if (value <= 0) {
    value = 0.1
  }

  return { value, unit: prev.unit }
}

function resizableUnit(unit) {
  return !(unit === 'auto' || unit === 'max-content' || unit === 'min-content' || unit === 'minmax')
}

function calcSize(size, computedSize, delta) {
  const value = parseValueUnit(size)
  if (resizableUnit(value.unit)) {
    const computedValue = parseValueUnit(computedSize)
    return valueUnitToString(calcValue(value, computedValue, delta))
  }
  return size
}

function resizeGridSizes(sizes, computedSizes, delta, line) {
  const newSizes = [...sizes],
    leftPos = line - 2,
    rightPos = line - 1
  newSizes[leftPos] = calcSize(sizes[leftPos], computedSizes[leftPos], delta)
  newSizes[rightPos] = calcSize(sizes[rightPos], computedSizes[rightPos], -delta)
  return newSizes
}

function farEnough(a, b, delta = 5) {
  return Math.abs(a.x - b.x) > delta || Math.abs(a.y - b.y) > delta
}

const props = defineProps({
  section: { type: Object, required: true },
  area: { type: Object, required: true },
  grayed: { type: Boolean, default: false },
  focused: { type: Boolean, default: false },
  explicitAreas: { type: Object, required: true },
})
defineEmit(['pointerdown'])

import { computed } from 'vue'

const grid = computed(() => props.area.grid)

const { colsNumber, rowsNumber } = useGridDimensions(grid)

const isDraggingGrid = computed(() => dragging.value && dragging.value.grid === grid.value)

const isDraggingSection = computed(
  () =>
    isDraggingGrid.value &&
    (dragging.value.colLine === props.section.col.start || dragging.value.rowLine === props.section.row.start)
)

const isDraggingCol = computed(() => isDraggingGrid.value && dragging.value.colLine === props.section.col.start)

const isDraggingRow = computed(() => isDraggingGrid.value && dragging.value.rowLine === props.section.row.start)

const gridRegions = computed(() => props.explicitAreas.gridAreas.map(explicitGridAreaToGridRegion))

function onMouseOver() {
  const { children } = props.area
  const { row, col } = props.section
  for (let i = children.length - 1; i >= 0; i--) {
    const r = gridRegions.value[i]
    if (r.row.start <= row.start && r.row.end >= row.end && r.col.start <= col.start && r.col.end >= col.end) {
      overArea.value = children[i]
      return
    }
  }
  overArea.value = props.area
}
</script>

<style scoped lang="scss">
section {
  z-index: -1;
  pointer-events: initial;
  touch-action: none;
  background: #ffffff;
  height: 100%;
  position: relative;
  &:not(.dragging) {
    cursor: pointer;
  }
  /*&.grayed {
    background: #ddddddcc;
  }*/
  &:not(.dragging):hover {
    background: #f6fbf6;
  }
  &.focused {
    background: #ecf8eccc;
  }
}
</style>
