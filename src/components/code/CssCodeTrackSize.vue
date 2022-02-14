<template>
  <span
    :ref="el"
    :aria-label="`${type} track ${track} size`"
    role="textbox"
    contenteditable
    spellcheck="false"
    :class="['input', type, { active: isDraggingTrackLine || isFocused }]"
    @keydown="onCodeInputKeydown($event, $emit)"
    @input="onInput"
    @focus="currentFocus = { on: 'track', grid, type, track }"
    @blur="currentFocus = null"
    @mouseover="currentHover = { on: 'track', grid, type, track }"
    @mouseleave="currentHover = null"
    >{{ trackSize }}</span
  >
</template>

<script setup lang="ts">
import { useAppState, isValidTrackSize, parseGridTemplate } from '../../store.js'
import { useInputSetter } from '../../composables'

import { namedTemplateColumns, namedTemplateRows, onCodeInputKeydown, targetText } from '../../utils.js'

let { dragging, currentFocus, currentHover } = $(useAppState())

const { grid, type, track, el } = defineProps<{
  grid
  type: string
  track: number
  el
}>()

let trackSize = $computed({
  get: () => grid[type].sizes[track - 1],
  set: (value) => (grid[type].sizes[track - 1] = value),
})

let isFocused = $computed(() => {
  const cf = currentFocus
  return cf && cf.on === 'track' && cf.grid === grid && cf.type === type && cf.track === track
})

const onInput = useInputSetter($$(trackSize), isValidTrackSize, targetText)

let isDraggingGrid = $computed(() => dragging && dragging.grid === grid)

let isDraggingTrackLine = $computed(
  () => isDraggingGrid && (track === dragging[type + 'Line'] || track === dragging[type + 'Line'] - 1)
)
</script>

<style scoped lang="postcss">
.col,
.row {
  &:hover {
    color: var(--color-gray-lightest);
  }
  &:focus {
    color: var(--color-gray-lightest);
    font-weight: 700;
  }
  &.active {
    color: var(--color-gray-lightest);
  }
}
</style>
