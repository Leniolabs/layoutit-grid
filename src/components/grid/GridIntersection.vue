<template>
  <section
    class="grid-intersection"
    :style="{
      gridArea: `${row} / ${col} / ${row + 1} / ${col + 1}`,
    }"
  >
    <div
      :class="['intersection-handle', { 'dragging-something': dragging }]"
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
})
defineEmit(['down'])

const grid = computed(() => props.area.grid)
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
    left: calc(-10px - v-bind(colgap));
    top: calc(-10px - v-bind(rowgap));
    &:not(.dragging-something) {
      cursor: move;
    }
  }
}
</style>
