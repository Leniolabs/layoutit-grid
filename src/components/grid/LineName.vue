<template>
  <input
    v-show="line.active"
    ref="inputElement"
    :value="line.name"
    :style="`width:${lineNameWidth}px`"
    :class="type"
    aria-label="line name"
    @input="line.name = $event.target.value"
    @pointerdown.stop
  />
</template>

<script setup="props">
import { useLineNameWidth } from '../../composables/lineName.js'

export default {
  props: {
    grid: { type: Object, required: true },
    type: { type: String, required: true }, // 'col' or 'row'
    pos: { type: Number, required: true },
  },
}

import { ref, computed, nextTick } from 'vue'

export const line = computed(() => props.grid[props.type].lineNames[props.pos - 1])

export const lineNameWidth = useLineNameWidth(line, '14px arial', 30)

export const inputElement = ref(null)

function focus() {
  inputElement.value.focus()
}

export function toggle() {
  if ((line.value.active = !line.value.active)) {
    nextTick(focus)
  }
}
</script>

<style scoped lang="scss">
.row,
.col {
  background: #bbe5b3;
  border: 1px solid green;
  font: 0.85rem arial;
  height: max-content;
  opacity: 1;
  padding: 2px 10px;
  position: absolute;
  touch-action: none;
  user-select: none;
  z-index: 199;
}
.row {
  border-right: 0;
  border-radius: 6px 0 0 6px;
  right: 0;
  top: -12px;
}
.col {
  border-left: 0;
  border-radius: 0 6px 6px 0;
  bottom: 0;
  transform: translateY(10px) rotate(-90deg);
  transform-origin: 0 12px;
}
</style>
