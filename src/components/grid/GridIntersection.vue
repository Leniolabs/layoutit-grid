<template>
  <section
    class="grid-intersection"
    :style="{
      gridArea: `${row} / ${col} / ${row + 1} / ${col + 1}`,
    }"
  >
    <div class="intersection-handle" @pointerdown.stop="$emit('down', $event, { row, col })" />
  </section>
</template>

<script setup="props, { emit }">
export default {
  props: {
    row: { type: Number, required: true },
    col: { type: Number, required: true },
    area: { type: Object, required: true },
    colgap: { type: String, default: '0px' },
    rowgap: { type: String, default: '0px' },
  },
  emits: ['down'],
}

import { computed } from 'vue'

export const grid = computed(() => props.area.grid)
</script>

<style scoped lang="scss" vars="{ colgap, rowgap }">
section {
  touch-action: none;
  pointer-events: none;
  height: 100%;
  position: relative;
  .intersection-handle {
    touch-action: none;
    pointer-events: initial;
    position: absolute;
    width: calc(20px + var(--colgap));
    height: calc(20px + var(--rowgap));
    border-radius: 50%;
    left: calc(-10px - var(--colgap));
    top: calc(-10px - var(--rowgap));
    cursor: move;
  }
}
</style>
