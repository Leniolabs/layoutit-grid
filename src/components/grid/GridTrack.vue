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
  >
    <TrackSize v-if="isCurrent" :grid="grid" :type="type" :track="pos" />
  </section>
</template>

<script setup>
import TrackSize from './TrackSize.vue'
import { useIsCurrentArea, useGridDimensions } from '../../composables/area.js'
import { dragging, currentFocus, currentHover, darkmode, parseValue } from '../../store.js'
import { defineProps, computed, toRefs } from 'vue'

const props = defineProps({
  type: { type: String, required: true },
  pos: { type: Number, required: true },
  area: { type: Object, required: true },
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

const gridArea = computed(() => {
  const { pos } = props
  return props.type === 'row' ? `${pos} / 1 / ${pos + 1} / -1` : `1 / ${pos} / -1 / ${pos + 1}`
})
</script>

<style scoped lang="scss">
section {
  touch-action: none;
  pointer-events: none;
  height: 100%;
  position: relative;
  border: 1px dashed #ccc; // #2c3e50;
  overflow: hidden;

  &.focused {
    background: #27ae6011;
  }
  &.remove-action {
    background: #ac1e3d11;
  }

  &.darkmode {
    border: 1px dashed #888;
  }

  &.row.focused,
  &.row.dragging-prev,
  &.row.focused-prev {
    border-top: 1px solid #27ae60;
  }
  &.row.focused,
  &.row-no-gap.row.focused-track-next,
  &.row.dragging-next,
  &.row.focused-next {
    border-bottom: 1px solid #27ae60;
  }

  &.col.focused,
  &.col.dragging-prev,
  &.col.focused-prev {
    border-left: 1px solid #27ae60;
  }
  &.col.focused,
  &.col-no-gap.col.focused-track-next,
  &.col.dragging-next,
  &.col.focused-next {
    border-right: 1px solid #27ae60;
  }

  &.row {
    border-left: initial;
    border-right: initial;
  }
  &.col {
    border-top: initial;
    border-bottom: initial;
  }

  &.row-first.compact {
    border-top: initial;
  }

  &.row-last.compact {
    border-bottom: initial;
  }

  &:not(.darkmode) {
    &.col-first.compact {
      border-left: initial;
    }

    &.col-last.compact {
      border-right: initial;
    }
  }

  &:not(.row-first).row-no-gap {
    border-top: initial;
  }
  &:not(.col-first).col-no-gap {
    border-left: initial;
  }
}
</style>
