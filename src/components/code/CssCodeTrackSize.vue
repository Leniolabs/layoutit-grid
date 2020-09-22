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
    >{{ trackSize }}</span
  >
</template>

<script setup="props, { emit }">
import { dragging, currentFocus, isValidTrackSize } from '../../store.js'
import { computed } from 'vue'
import { debounce } from 'lodash-es'

import { namedTemplateColumns, namedTemplateRows, parseGridTemplate, onCodeInputKeydown } from '../../utils.js'

export default {
  props: {
    grid: { type: Object, required: true },
    type: { type: String, required: true },
    track: { type: Number, required: true },
    el: { type: Object, required: true },
  },
}

export { currentFocus, onCodeInputKeydown }

export const trackSize = computed({
  get: () => props.grid[props.type].sizes[props.track - 1],
  set: (value) => (props.grid[props.type].sizes[props.track - 1] = value),
})

export const isFocused = computed(() => {
  const cf = currentFocus.value
  return cf && cf.on === 'track' && cf.grid === props.grid && cf.type === props.type && cf.track === props.track
})

function textFrom(event) {
  const textNode = event.target.childNodes[0]
  return textNode && textNode.data
}

export function onInput(event) {
  trackSizeChanged(event)
}

export const trackSizeChanged = debounce((event) => {
  const text = textFrom(event)
  if (isValidTrackSize(text)) {
    trackSize.value = text
  }
}, 700)

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
