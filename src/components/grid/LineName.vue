<template>
  <input
    ref="inputElement"
    v-show="line.active"
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
  touch-action: none;
  position: absolute;
  background: #bbe5b3;
  z-index: 9;
  top: -12px;
  right: 0;
  padding: 2px 10px;
  height: max-content;
  border: 1px solid green;
  border-right: 0;
  border-top-left-radius: 6px;
  border-bottom-left-radius: 6px;
  font: 14px arial;
  z-index: 999;
  opacity: 1;
}

.col {
  right: initial;
  top: initial;
  left: -1px;
  bottom: 2px;
  transform: translateY(12px) rotate(90deg) translateX(-100%);
  transform-origin: 0 12px;
}
</style>
