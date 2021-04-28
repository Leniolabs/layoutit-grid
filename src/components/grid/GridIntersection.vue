<template>
  <section
    class="grid-intersection"
    :style="{
      gridArea: `${r} / ${c} / ${r + 1} / ${c + 1}`,
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
import { dragging } from '../../store.js'
import { computed, defineProps, defineEmit } from 'vue'

const props = defineProps({
  row: { type: Number, required: true },
  col: { type: Number, required: true },
  area: { type: Object, required: true },
  colgap: { type: String, default: '0px' },
  rowgap: { type: String, default: '0px' },
  implicitGrid: { type: Object, required: true },
})
defineEmit(['down'])

const grid = computed(() => props.area.grid)

const r = computed(() => {
  const { rows, ri } = props.implicitGrid
  const rv = props.row
  return rv < rows + 2 - ri ? rv : rv - 1
})

const c = computed(() => {
  const { cols, ci } = props.implicitGrid
  const cv = props.col
  return cv < cols + 2 - ci ? cv : cv - 1
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
