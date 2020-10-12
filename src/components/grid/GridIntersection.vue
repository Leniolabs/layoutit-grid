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
  },
  emits: ['down'],
}

import { computed } from 'vue'

export const grid = computed(() => props.area.grid)
</script>

<style scoped lang="scss">
section {
  touch-action: none;
  pointer-events: none;
  height: 100%;
  position: relative;
  .intersection-handle {
    touch-action: none;
    pointer-events: initial;
    position: absolute;
    width: 30px;
    height: 30px;
    border-radius: 50%;
    top: -15px;
    left: -15px;
    cursor: move;
  }
}
</style>
