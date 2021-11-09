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

<script setup lang="ts">
import { useAppState } from '../../store.js'
import { asValidGridArea } from '../../utils/grid.js'

let { dragging } = $(useAppState())

const {
  row,
  col,
  area,
  implicitGrid,
  colgap = '0px',
  rowgap = '0px',
} = defineProps<{
  row: number
  col: number
  area
  implicitGrid
  colgap?: string
  rowgap?: string
}>()

defineEmits(['down'])

let grid = $computed(() => area.grid)

let r = $computed(() => {
  const { rows, ri } = implicitGrid
  const rv = row
  return rv < rows + ri ? rv : rv - 1
})

let c = $computed(() => {
  const { cols, ci } = implicitGrid
  const cv = col
  return cv < cols + ci ? cv : cv - 1
})

let gridArea = $computed(() => {
  return asValidGridArea(r, c, r + 1, c + 1, implicitGrid)
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
