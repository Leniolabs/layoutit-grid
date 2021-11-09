<template>
  <section
    :data-col="type === 'col' ? pos : undefined"
    :data-row="type === 'row' ? pos : undefined"
    :class="[
      'grid-track',
      type,
      {
        darkmode,
        compact: area.padding === '0',
        'row-first': type === 'row' && pos === 1,
        'col-first': type === 'col' && pos === 1,
        'row-last': type === 'row' && pos === grid.row.sizes.length,
        'col-last': type === 'col' && pos === grid.col.sizes.length,
        'row-no-gap': type === 'row' && parseValue(grid.row.gap) === 0,
        'col-no-gap': type === 'col' && parseValue(grid.col.gap) === 0,
        'is-explicit-prev': isExplicitPrev,
        'is-explicit-next': isExplicitNext,
        'dragging-prev': isLineDraggingPrev,
        'dragging-next': isLineDraggingNext,
        'focused-prev': isLineFocusedPrev,
        'focused-next': isLineFocusedNext,
        focused: isTrackFocused || isTrackHover,
        'focused-track-next': isNextTrackFocused || isNextTrackHover,
        'remove-action': isTrackHover && currentHover.action === 'remove',
        // There is a bug that prevents extending the grid lines with the current
        // implementation if there aren't at least 2 explicit tracks
        extend: grid.col.sizes.length > 1 && grid.row.sizes.length > 1,
      },
    ]"
    :style="{
      gridArea,
    }"
  ></section>
</template>

<script setup lang="ts">
import { useIsCurrentArea } from '../../composables/area.js'
import { asValidGridArea } from '../../utils/grid.js'
import { useAppState, parseValue } from '../../store.js'

let { dragging, currentFocus, currentHover, darkmode } = $(useAppState())

const { type, pos, area, implicitGrid } = defineProps<{
  type: string
  pos: number
  area
  implicitGrid
}>()

let grid = $computed(() => area.grid)

let isCurrent = $(useIsCurrentArea(computed(() => area)))

let isDraggingGrid = $computed(() => dragging && dragging.grid === grid)

function isHover(pos) {
  const f = currentHover
  return !currentFocus && f && f.on === 'track' && f.grid === grid && f.type === type && f.track === pos
}
let isTrackHover = $computed(() => isHover(pos))
let isNextTrackHover = $computed(() => isHover(pos + 1))

function isFocused(pos) {
  const f = currentFocus
  return f && f.on === 'track' && f.grid === grid && f.type === type && f.track === pos
}

let isTrackFocused = $computed(() => isFocused(pos))
let isNextTrackFocused = $computed(() => isFocused(pos + 1))

function isLineFocused(pos) {
  const f = currentFocus
  return f && f.on === 'line' && f.grid === grid && f.type === type && f.pos === pos
}
function isLineHover(pos) {
  const f = currentHover
  return !currentFocus && f && f.on === 'line' && f.grid === grid && f.type === type && f.pos === pos
}

let isLineDraggingPrev = $computed(() => isDraggingGrid && dragging[type + 'Line'] === pos)
let isLineFocusedPrev = $computed(() => isLineFocused(pos))
let isLineDraggingNext = $computed(() => isDraggingGrid && dragging[type + 'Line'] === pos + 1)
let isLineFocusedNext = $computed(() => isLineFocused(pos + 1))

let isExplicitPrev = $computed(() => {
  return pos >= 1 && pos <= grid[type].lineNames.length
})
let isExplicitNext = $computed(() => {
  return pos + 1 >= 1 && pos + 1 <= grid[type].lineNames.length
})

let gridArea = $computed(() => {
  return type === 'row'
    ? asValidGridArea(pos, implicitGrid.ci, pos + 1, implicitGrid.cols + implicitGrid.ci, implicitGrid)
    : asValidGridArea(implicitGrid.ri, pos, implicitGrid.rows + implicitGrid.ri, pos + 1, implicitGrid)
})
</script>

<style scoped lang="postcss">
section {
  touch-action: none;
  pointer-events: none;
  height: 100%;
  position: relative;
  overflow: hidden;
  &.col {
    /*
    &.extend {
      top: -100vh;
      height: 300vh;
    }
    */
    border-right: 1px dashed var(--color-gray);
    &.col-first {
      border-left: 1px solid var(--color-gray);
    }
    &:not(.col-first):not(.col-no-gap) {
      border-left: 1px dashed var(--color-gray);
    }
    &.col-last {
      border-right: 1px solid var(--color-gray);
      & ~ .col {
        border-right: 1px dotted var(--color-gray);
      }
    }
  }
  &.row {
    /*
    &.extend {
      width: 300vw;
      left: -100vw;
    }
    */

    border-bottom: 1px dashed var(--color-gray);
    &:not(.row-first):not(.row-no-gap) {
      border-top: 1px dashed var(--color-gray);
    }
    &.row-first {
      border-top: 1px solid var(--color-gray);
    }
    &.row-last {
      border-bottom: 1px solid var(--color-gray);
      & ~ .row {
        border-bottom: 1px dotted var(--color-gray);
      }
    }
  }
  &.focused {
    background: rgba(var(--color-green-rgb), 0.1);
  }
  &.remove-action {
    background: rgba(var(--color-remove-rgb), 0.1);
  }
  &.darkmode {
    border: 1px dashed var(--color-gray);
  }
  &:not(.row-no-gap).row.dragging-prev {
    border-top: 1px solid var(--color-green) !important;
  }
  &.row.dragging-next {
    border-bottom: 1px solid var(--color-green) !important;
  }
  &:not(.col-no-gap).col.dragging-prev {
    border-left: 1px solid var(--color-green) !important;
  }
  &.col.dragging-next {
    border-right: 1px solid var(--color-green) !important;
  }
}
</style>
