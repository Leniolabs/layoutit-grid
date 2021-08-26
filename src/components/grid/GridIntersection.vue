<template>
  <section
    class="grid-intersection"
    :style="{
      gridArea,
    }"
  >
    <div
      :class="[
        'intersection-handle',
        r === row ? 'top' : 'bottom',
        c === col ? 'left' : 'right',
        { 'dragging-something': dragging },
      ]"
      @pointerdown.stop="$emit('down', $event, { row, col })"
    />
  </section>
</template>

<script setup>
import { useAppState } from '../../store.js'
import { asValidGridArea } from '../../utils/grid.js'

const { dragging } = useAppState()

const props = defineProps({
  row: { type: Number, required: true },
  col: { type: Number, required: true },
  area: { type: Object, required: true },
  colgap: { type: String, default: '0px' },
  rowgap: { type: String, default: '0px' },
  implicitGrid: { type: Object, required: true },
})
defineEmits(['down'])

const grid = computed(() => props.area.grid)

const r = computed(() => {
  const { rows, ri } = props.implicitGrid
  const rv = props.row
  return rv < rows + ri ? rv : rv - 1
})

const c = computed(() => {
  const { cols, ci } = props.implicitGrid
  const cv = props.col
  return cv < cols + ci ? cv : cv - 1
})

const gridArea = computed(() => {
  return asValidGridArea(r.value, c.value, r.value + 1, c.value + 1, props.implicitGrid)
})
</script>

<style scoped lang="postcss">
section {
  touch-action: none;
  pointer-events: none;
  height: 100%;
  position: relative;
  .intersection-handle {
    touch-action: none;
    pointer-events: initial;
    position: absolute;
    width: calc(20px + v-bind(colgap));
    height: calc(20px + v-bind(rowgap));
    border-radius: 50%;
    &.left {
      left: calc(-10px - v-bind(colgap));
    }
    &.right {
      right: calc(-10px - v-bind(colgap));
    }
    &.top {
      top: calc(-10px - v-bind(rowgap));
    }
    &.bottom {
      bottom: calc(-10px - v-bind(rowgap));
    }
    &:not(.dragging-something) {
      cursor: move;
    }
  }
}
</style>
