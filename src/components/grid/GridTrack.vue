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
      },
    ]"
    :style="{
      gridArea,
    }"
  ></section>
</template>

<script setup>
import { useIsCurrentArea } from '../../composables/area.js'
import { asValidGridArea } from '../../utils/grid.js'
import { dragging, currentFocus, currentHover, darkmode, parseValue } from '../../store.js'
import { defineProps, computed, toRefs } from 'vue'

const props = defineProps({
  type: { type: String, required: true },
  pos: { type: Number, required: true },
  area: { type: Object, required: true },
  implicitGrid: { type: Object, required: true },
})
const grid = computed(() => props.area.grid)

const isCurrent = useIsCurrentArea(toRefs(props).area)

const isDraggingGrid = computed(() => dragging.value && dragging.value.grid === grid.value)

function isHover(pos) {
  const f = currentHover.value
  return (
    !currentFocus.value && f && f.on === 'track' && f.grid === grid.value && f.type === props.type && f.track === pos
  )
}
const isTrackHover = computed(() => isHover(props.pos))
const isNextTrackHover = computed(() => isHover(props.pos + 1))

function isFocused(pos) {
  const f = currentFocus.value
  return f && f.on === 'track' && f.grid === grid.value && f.type === props.type && f.track === pos
}

const isTrackFocused = computed(() => isFocused(props.pos))
const isNextTrackFocused = computed(() => isFocused(props.pos + 1))

function isLineFocused(pos) {
  const f = currentFocus.value
  return f && f.on === 'line' && f.grid === grid.value && f.type === props.type && f.pos === pos
}
function isLineHover(pos) {
  const f = currentHover.value
  return !currentFocus.value && f && f.on === 'line' && f.grid === grid.value && f.type === props.type && f.pos === pos
}

const isLineDraggingPrev = computed(() => isDraggingGrid.value && dragging.value[props.type + 'Line'] === props.pos)
const isLineFocusedPrev = computed(() => isLineFocused(props.pos))
const isLineDraggingNext = computed(() => isDraggingGrid.value && dragging.value[props.type + 'Line'] === props.pos + 1)
const isLineFocusedNext = computed(() => isLineFocused(props.pos + 1))

const isExplicitPrev = computed(() => {
  return props.pos >= 1 && props.pos <= grid.value[props.type].lineNames.length
})
const isExplicitNext = computed(() => {
  return props.pos + 1 >= 1 && props.pos + 1 <= grid.value[props.type].lineNames.length
})

const gridArea = computed(() => {
  const { pos, implicitGrid } = props
  return props.type === 'row'
    ? asValidGridArea(pos, implicitGrid.ci, pos + 1, implicitGrid.cols + implicitGrid.ci, props.implicitGrid)
    : asValidGridArea(implicitGrid.ri, pos, implicitGrid.rows + implicitGrid.ri, pos + 1, props.implicitGrid)
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
    top: -100vh;
    height: 300vh;
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
    width: 300vw;
    left: -100vw;
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
    background: rgba(var(--color-green), 0.1);
  }
  &.remove-action {
    background: rgba(var(--color-remove), 0.1);
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
