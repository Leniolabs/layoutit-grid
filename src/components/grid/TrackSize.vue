<template>
  <div
    role="textbox"
    :aria-label="`${type} track ${track} size`"
    contenteditable
    :class="['input', type, { active: isDraggingTrackLine, focused: isFocused }]"
    @pointerdown.stop
    @input="trackSizeChanged"
    @focus="currentFocus = { on: 'track', grid, type, track }"
    @blur="currentFocus = null"
  >
    {{ trackSize }}
  </div>
</template>

<script setup="props, { emit }">
import { dragging, currentFocus, isValidTrackSize } from '../../store.js'

import { computed } from 'vue'
import { debounce } from 'lodash-es'

export default {
  props: {
    grid: { type: Object, required: true },
    type: { type: String, required: true },
    track: { type: Number, required: true },
  },
}

export { currentFocus }

export const isFocused = computed(() => {
  const cf = currentFocus.value
  return cf && cf.on === 'track' && cf.grid === props.grid && cf.type === props.type && cf.track === props.track
})

export const trackSize = computed({
  get: () => props.grid[props.type].sizes[props.track - 1],
  set: (value) => (props.grid[props.type].sizes[props.track - 1] = value),
})

export const trackSizeChanged = debounce((value) => {
  const textNode = value.target.childNodes[0]
  const text = textNode && textNode.data
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
  font-family: Consolas, Monaco, 'Andale Mono', 'Ubuntu Mono', monospace;
  font-size: 13px;
  color: #888;
  position: absolute;
  padding: 2px;
    user-select: none;
  &.active {
    color: #27ae60;
  }
  &:focus {
    color: black;
  }
  &.focused {
    color: black;
  }
}


.col {
  bottom: 0;
  right: 0;
  left: 0;
  text-align: center;
}
.row {
  top: 0;
  bottom: 0;
  right: 0;
  display: grid;
  align-content: center;
}
</style>
