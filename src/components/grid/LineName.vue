<template>
  <input
    v-show="line.active"
    ref="inputElement"
    :value="line.name"
    :style="style"
    :class="[type, { first: pos === 1, last: pos === grid[type].lineNames.length }]"
    aria-label="line name"
    maxlength="20"
    @input="line.name = $event.target.value"
    @keydown="onKeydown"
    @pointerdown.stop
    @focus="currentFocus = { on: 'line', grid, type, pos }"
    @blur="currentFocus = null"
  />
</template>

<script setup lang="ts">
import { useLineNameWidth } from '../../composables/lineName.js'
import { useAppState, parseValue } from '../../store.js'

let { currentFocus } = $(useAppState())

const {
  grid,
  type,
  pos,
  gap = '0px',
} = defineProps<{
  grid
  type: string
  pos: number
  gap?: string
}>()

let line = $computed(() => grid[type].lineNames[pos - 1])

let lineNameWidth = $(useLineNameWidth($$(line), '14px arial', 30))

let style = $computed(() => {
  const g = parseValue(gap)
  const s = { width: lineNameWidth + 'px' }
  if (pos > 1 && pos < grid[type].lineNames.length) {
    return { ...s, ...(type === 'row' ? { bottom: -11 - g / 2 + 'px' } : { right: -2 - g / 2 + 'px' }) }
  }
  return s
})

let inputElement = $ref(null)

function focus() {
  inputElement.focus()
}

function toggle() {
  if ((line.active = !line.active)) {
    nextTick(focus)
  }
}

function onKeydown(event) {
  const { code } = event
  if (code === 'Enter' || code === 'NumpadEnter' || code === 'Escape') {
    event.preventDefault()
    inputElement.blur()
    return
  }
}

defineExpose({ focus, toggle })
</script>

<style scoped lang="postcss">
.row,
.col {
  z-index: 1;
  pointer-events: initial;
  background: var(--color-green-ligth);
  border: 1px solid var(--color-green);
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
  bottom: 1px;
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
