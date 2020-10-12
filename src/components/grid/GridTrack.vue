<template>
  <section
    :data-col="type === 'col' ? pos : undefined"
    :data-row="type === 'row' ? pos : undefined"
    :class="[
      'grid-track',
      type,
      {
        darkmode,
        'row-first': type === 'row' && pos === 1,
        'col-first': type === 'col' && pos === 1,
        'row-last': type === 'row' && pos === grid.row.sizes.length,
        'col-last': type === 'col' && pos === grid.col.sizes.length,
        'row-no-gap': type === 'row' && parseValue(grid.row.gap) === 0,
        'col-no-gap': type === 'col' && parseValue(grid.col.gap) === 0,
        'dragging-prev': isDraggingPrev,
        'dragging-next': isDraggingNext,
        'focused-prev': isFocusedPrev,
        'focused-next': isFocusedNext,
      },
    ]"
    :style="{
      gridArea,
    }"
  >
    <TrackSize v-if="isCurrent" :grid="grid" :type="type" :track="pos" />
  </section>
</template>

<script setup="props, { emit }">
export { default as TrackSize } from './TrackSize.vue'
import { useIsCurrentArea, useGridDimensions } from '../../composables/area.js'
export { dragging, currentFocus, darkmode, parseValue } from '../../store.js'
import { computed, toRefs } from 'vue'

export default {
  props: {
    type: { type: String, required: true },
    pos: { type: Number, required: true },
    area: { type: Object, required: true },
  },
}

export const grid = computed(() => props.area.grid)

export const isCurrent = useIsCurrentArea(toRefs(props).area)

export const isDraggingGrid = computed(() => dragging.value && dragging.value.grid === grid.value)

export function isFocused(pos) {
  const tf = currentFocus.value
  return tf && tf.on === 'line' && tf.grid === grid.value && tf.type === props.type && tf.pos === pos
}

export const isDraggingPrev = computed(() => isDraggingGrid.value && dragging.value[props.type + 'Line'] === props.pos)
export const isFocusedPrev = computed(() => isFocused(props.pos))
export const isDraggingNext = computed(
  () => isDraggingGrid.value && dragging.value[props.type + 'Line'] === props.pos + 1
)
export const isFocusedNext = computed(() => isFocused(props.pos + 1))

export const gridArea = computed(() => {
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
  border: 1px dashed #888; // #2c3e50;
  overflow: hidden;

  &.darkmode {
    border: 1px dashed #888;
  }

  &.row.dragging-prev,
  &.row.focused-prev {
    border-top: 1px solid #27ae60;
  }
  &.row.dragging-next,
  &.row.focused-next {
    border-bottom: 1px solid #27ae60;
  }
  &.col.dragging-prev,
  &.col.focused-prev {
    border-left: 1px solid #27ae60;
  }
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

  &.row-first {
    border-top: initial;
  }

  &.row-last {
    border-bottom: initial;
  }

  &:not(.darkmode) {
    &.col-first {
      border-left: initial;
    }

    &.col-last {
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
