<template>
  <section
    :data-col-start="section.col.start"
    :data-row-start="section.row.start"
    :data-col-end="section.col.end"
    :data-row-end="section.row.end"
    :class="{
      lastcol: section.col.end - 1 === colsNumber && section.row.start === 1,
      lastrow: section.row.end - 1 === rowsNumber && section.col.start === 1,
      dragging: isDraggingSection,
      grayed,
      focused,
    }"
    class="grid-section"
  >
    <div
      :class="{ dragging: isDraggingCol }"
      class="col-handle"
      @pointerdown.stop="handleDown($event, section, { col: true })"
    />

    <div
      :class="{ dragging: isDraggingRow }"
      class="row-handle"
      @pointerdown="handleDown($event, section, { row: true })"
    />

    <div class="multi-handle" @pointerdown="handleDown($event, section, { row: true, col: true })" />

    <slot />
  </section>
</template>

<script setup="props, { emit }">
import {
  dragging,
  setCurrentArea,
  parseValueUnit,
  valueUnitToString,
  startAtomicChange,
  endAtomicChange,
} from '../../store.js'
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

export default {
  props: {
    section: { type: Object, required: true },
    area: { type: Object, required: true },
    gridComputedStyles: { type: Function, required: true },
    grayed: { type: Boolean, default: false },
    focused: { type: Boolean, default: false },
  },
}

import { computed } from 'vue'

export const grid = computed(() => props.area.grid)

export const { colsNumber, rowsNumber } = useGridDimensions(grid)

export const isDraggingGrid = computed(() => dragging.value && dragging.value.grid === grid.value)

export const isDraggingSection = computed(
  () =>
    isDraggingGrid.value &&
    (dragging.value.colLine === props.section.col.start || dragging.value.rowLine === props.section.row.start)
)

export const isDraggingCol = computed(
  () => isDraggingGrid.value && dragging.value.colLine === props.section.col.start && props.section.row.start === 1
)

export const isDraggingRow = computed(
  () => isDraggingGrid.value && dragging.value.rowLine === props.section.row.start && props.section.col.start === 1
)

export function showInsideColSize(col) {
  return isDraggingGrid.value && (col === dragging.value.colLine - 1 || col === dragging.value.colLine - 2)
}
export function showInsideRowSize(row) {
  return isDraggingGrid.value && (row === dragging.value.rowLine - 1 || row === dragging.value.rowLine - 2)
}

export function handleDown(event, section, { row, col }) {
  event.stopPropagation() // TODO: ...
  event.preventDefault()
  if (document.activeElement) {
    document.activeElement.blur()
  }

  if (dragging.value) {
    return
  }

  setCurrentArea(props.area)

  const initialPos = { x: event.clientX, y: event.clientY }
  const initialTime = new Date().getTime()
  const rowLine = row ? section.row.start : undefined
  const colLine = col ? section.col.start : undefined
  const computedStyles = props.gridComputedStyles()
  const initialRowSizes = [...grid.value.row.sizes]
  const initialRowComputedSizes = computedStyles.gridTemplateRows.split(/\s/g)
  const initialColSizes = [...grid.value.col.sizes]
  const initialColComputedSizes = computedStyles.gridTemplateColumns.split(/\s/g)

  const handleMove = (event) => {
    const pos = { x: event.clientX, y: event.clientY }

    if (!dragging.value && (new Date().getTime() - initialTime > 500 || farEnough(initialPos, pos))) {
      // Start dragging grid lines
      dragging.value = { grid: grid.value, rowLine, colLine }
      document.body.style.cursor = col && row ? 'move' : col ? 'col-resize' : 'row-resize'
      startAtomicChange()
    }
    if (dragging.value) {
      if (dragging.value.rowLine !== null) {
        // Drag row line by updating row sizes
        grid.value.row.sizes = resizeGridSizes(
          initialRowSizes,
          initialRowComputedSizes,
          pos.y - initialPos.y,
          dragging.value.rowLine
        )
      }
      if (dragging.value.colLine !== undefined) {
        // Drag col line by updating col sizes
        grid.value.col.sizes = resizeGridSizes(
          initialColSizes,
          initialColComputedSizes,
          pos.x - initialPos.x,
          dragging.value.colLine
        )
      }
    }
  }

  const handleUp = () => {
    if (dragging.value) {
      // Finish dragging grid lines
      dragging.value = null
      document.body.style.cursor = 'default'
      endAtomicChange()
    } else if (new Date().getTime() - initialTime < 500) {
      // click
      emit('togglelinename', row ? `rowLine-${rowLine}` : `colLine-${colLine}`)
    }

    window.removeEventListener('pointermove', handleMove)
    window.removeEventListener('pointerup', handleUp)
  }
  window.addEventListener('pointermove', handleMove)
  window.addEventListener('pointerup', handleUp)
}
</script>

<style scoped lang="scss">
section {
  touch-action: none;
  background: #fff;
  height: 100%;
  position: relative;
  cursor: pointer;
  &.dragging {
    cursor: default;
  }
  &.grayed {
    background: #dddddd;
  }
  &:hover,
  &.focused {
    background: #ecf8ec;
  }
  .multi-handle {
    touch-action: none;
    position: absolute;
    width: 30px;
    height: 30px;
    border-radius: 50%;
    top: -15px;
    left: -15px;
    z-index: 9;
    cursor: move;
  }
  .col-handle {
    touch-action: none;
    position: absolute;
    width: 20px;
    height: 100%;
    left: -10px;
    //z-index: 9;
    top: 0;
    cursor: col-resize;
    &.dragging:after {
      content: '';
      width: 1px;
      position: absolute;
      top: 0;
      left: 9px;
      height: 100vh;
      background: #27ae60;
      z-index: 99;
      pointer-events: none;
    }
  }
  .row-handle {
    touch-action: none;
    position: absolute;
    width: 100%;
    height: 20px;
    left: 0;
    top: -10px;
    cursor: row-resize;
    //z-index: 9;
    &.dragging:after {
      content: '';
      height: 1px;
      position: absolute;
      top: 9px;
      left: 0;
      width: 100vw;
      background: #27ae60;
      z-index: 99;
    }
  }
  &:before {
    content: '';
    position: absolute;
    left: 0;
    top: 0;
    display: block;
    width: 100%;
    height: 100%;
    pointer-events: none;
    outline: 1px dashed #fff;
  }

  &:after {
    content: '';
    position: absolute;
    font-size: 10px;
    width: 14px;
    border-radius: 3px;
    color: #666;
    background: #fff;
    line-height: 15px;
    text-align: center;
  }
  &.dragging:after {
    background: #27ae60;
    color: #fff;
    z-index: 99999;
  }
  &[data-col-start='1'][data-row-start]:after {
    content: attr(data-row-start);
    top: -8.2px;
    left: 0px;
    width: 15px;
    text-align: left;
    border-bottom-left-radius: 0;
    border-bottom-right-radius: 5px;
    border-top-right-radius: 5px;
    border-top-left-radius: 0;
    padding-left: 4px;
  }
  &[data-row-start='1'][data-col-start]:after {
    content: attr(data-col-start);
    left: -7.5px;
    top: 0px;
    border-top-left-radius: 0;
    border-top-right-radius: 0;
    border-bottom-right-radius: 5px;
    border-bottom-left-radius: 5px;
    height: 16px;
  }

  &.lastcol:before {
    content: attr(data-col-end);
    position: absolute;
    font-size: 10px;
    width: 14px;
    border-radius: 50%;
    color: #666;
    background: #fff;
    right: 0;
    left: initial;
    top: 2px !important;
    height: auto;
    outline: 0;
  }
  &.lastrow::before {
    content: attr(data-row-end);
    position: absolute;
    font-size: 10px;
    width: 14px;
    border-radius: 50%;
    color: #666;
    background: #fff;
    bottom: 2px;
    top: initial;
    left: 0;
    height: auto;
    outline: 0;
  }
}

// Hide draggable elements for grid edges

[data-col-start='1'] .col-handle {
  display: none;
  .multi-handle {
    display: none;
  }
}
[data-row-start='1'] .row-handle {
  display: none;
  .multi-handle {
    display: none;
  }
}

.grid section section:before {
  outline: 1px dashed #ccc;
}
</style>
