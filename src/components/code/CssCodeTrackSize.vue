<template>
  <span
    :ref="el"
    :aria-label="`${type} track ${track} size`"
    role="textbox"
    contenteditable
    spellcheck="false"
    :class="['input', type, { active: isDraggingTrackLine || isFocused }]"
    @keydown="onCodeInputKeydown"
    @input="onInput"
    @focus="currentFocus = { on: 'track', grid, type, track }"
    @blur="currentFocus = null"
    @mouseover="currentHover = { on: 'track', grid, type, track }"
    @mouseleave="currentHover = null"
    >{{ trackSize }}</span
  >
</template>

<script setup="props, { emit }">
import { dragging, currentFocus, currentHover, isValidTrackSize, parseGridTemplate } from '../../store.js'
import { computed } from 'vue'
import { useInputSetter } from '../../composables'

import { namedTemplateColumns, namedTemplateRows, onCodeInputKeydown, targetText } from '../../utils.js'

export default {
  props: {
    grid: { type: Object, required: true },
    type: { type: String, required: true },
    track: { type: Number, required: true },
    el: { type: Object, required: true },
  },
}

export { currentFocus, currentHover, onCodeInputKeydown }

export const trackSize = computed({
  get: () => props.grid[props.type].sizes[props.track - 1],
  set: (value) => (props.grid[props.type].sizes[props.track - 1] = value),
})

export const isFocused = computed(() => {
  const cf = currentFocus.value
  return cf && cf.on === 'track' && cf.grid === props.grid && cf.type === props.type && cf.track === props.track
})

export const onInput = useInputSetter(trackSize, isValidTrackSize, targetText)

export const isDraggingGrid = computed(() => dragging.value && dragging.value.grid === props.grid)

export const isDraggingTrackLine = computed(
  () =>
    isDraggingGrid.value &&
    (props.track === dragging.value[props.type + 'Line'] || props.track === dragging.value[props.type + 'Line'] - 1)
)
</script>

<style scoped lang="scss">
.col,
.row {
  &:hover {
    color: white;
  }
  &:focus {
    color: white;
    font-weight: 700;
  }
  &.active {
    color: white;
  }
}
</style>
