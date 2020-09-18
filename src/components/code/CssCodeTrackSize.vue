<template>
  <span
    :ref="el"
    role="textbox"
    contenteditable
    spellcheck="false"
    :class="['input', type, { active: isDraggingTrackLine }]"
    @keydown="onCodeInputKeydown"
    @input="onInput"
    @focus="trackFocus = { grid, type, track }"
    @blur="trackFocus = null"
    >{{ trackSize }}</span
  >
</template>

<script setup="props, { emit }">
import { dragging, trackFocus, isValidTrackSize } from '../../store.js'
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

export { trackFocus, onCodeInputKeydown }

export const trackSize = computed({
  get: () => props.grid[props.type].sizes[props.track - 1],
  set: (value) => (props.grid[props.type].sizes[props.track - 1] = value),
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
