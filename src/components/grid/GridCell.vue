<template>
  <section
    :data-col-start="section.col.start"
    :data-row-start="section.row.start"
    :data-col-end="section.col.end"
    :data-row-end="section.row.end"
    :style="{
      gridArea: `${section.row.start} / ${section.col.start} / ${section.row.start + 1} / ${section.col.start + 1}`,
      background: grayed ? '#e8e8e8' : '#ffffff',
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
    @mouseover="$emit('overcell', { col: section.col.start, row: section.row.start })"
  />
</template>

<script setup>
import { defineProps, defineEmit } from 'vue'
import { dragging, setCurrentArea, parseValueUnit, valueUnitToString, pause, resume } from '../../store.js'
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
})
defineEmit(['pointerdown', 'overcell'])

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
</script>

<style scoped lang="postcss">
section {
  z-index: -1;
  pointer-events: initial;
  touch-action: none;
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
