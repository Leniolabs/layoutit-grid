<template>
  <input
    v-show="line.active"
    ref="inputElement"
    :value="line.name"
    :style="style"
    :class="[type, { first: pos === 1, last: pos === grid[type].lineNames.length }]"
    aria-label="line name"
    @input="line.name = $event.target.value"
    @pointerdown.stop
    @focus="currentFocus = { on: 'line', grid, type, pos }"
    @blur="currentFocus = null"
  />
</template>

<script setup="props">
import { useLineNameWidth } from '../../composables/lineName.js'
export { parseValue, currentFocus } from '../../store.js'

export default {
  props: {
    grid: { type: Object, required: true },
    type: { type: String, required: true }, // 'col' or 'row'
    pos: { type: Number, required: true },
    gap: { type: String, default: '0px' },
  },
}

import { ref, computed, nextTick } from 'vue'

export const line = computed(() => props.grid[props.type].lineNames[props.pos - 1])

export const lineNameWidth = useLineNameWidth(line, '14px arial', 30)

export const style = computed(() => {
  const g = parseValue(props.gap)
  const s = { width: lineNameWidth.value + 'px' }
  if (props.pos > 1 && props.pos < props.grid[props.type].lineNames.length) {
    return { ...s, ...(props.type === 'row' ? { bottom: -11 - g / 2 + 'px' } : { right: -2 - g / 2 + 'px' }) }
  }
  return s
})

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
  pointer-events: initial;
  background: #bbe5b3;
  border: 1px solid green;
  font: 0.85rem arial;
  height: max-content;
  opacity: 1;
  padding: 2px 10px;
  overflow: visible;
  position: absolute;
  touch-action: none;
  user-select: none;
}
.row {
  border-right: 0;
  &:not(.first) {
    border-top-left-radius: 6px;
  }
  &:not(.last) {
    border-bottom-left-radius: 6px;
  }
  right: 0;
  bottom: -12px;
  &.first {
    top: 0px;
  }
  &.last {
    bottom: 0px;
  }
}
.col {
  border-left: 0;
  &:not(.first) {
    border-top-right-radius: 6px;
  }
  &:not(.last) {
    border-bottom-right-radius: 6px;
  }
  bottom: 0;
  right: -2px;
  transform-origin: 0 12px;
  transform: translateX(100%) translateY(10px) rotate(-90deg);
  &.first {
    left: 11px;
    transform: translateY(10px) rotate(-90deg);
  }
  &.last {
    transform: translateX(calc(100% - 11px)) translateY(10px) rotate(-90deg);
  }
}
</style>
