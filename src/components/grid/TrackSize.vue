<template>
  <div
    role="textbox"
    :aria-label="`${type} track ${track} size`"
    contenteditable
    :class="['editor-track-size', 'input', type, { active: isDraggingTrackLine, focused: isFocused }]"
    @pointerdown.stop
    @input="trackSizeChanged"
    @focus="currentFocus = { on: 'track', grid, type, track }"
    @blur="currentFocus = null"
  >
    {{ trackSize }}
  </div>
</template>

<script setup="props, { emit }">
import { dragging as ref_dragging, currentFocus, isValidTrackSize } from '../../store.js'

import { computed } from 'vue'
import { debounce } from 'lodash-es'

export default {
  props: {
    grid: { type: Object, required: true },
    type: { type: String, required: true },
    track: { type: Number, required: true },
  },
}

ref: dragging = ref_dragging

ref: isFocused = computed(() => {
  const cf = currentFocus.value
  return cf && cf.on === 'track' && cf.grid === props.grid && cf.type === props.type && cf.track === props.track
})

ref: trackSize = computed({
  get: () => props.grid[props.type].sizes[props.track - 1],
  set: (value) => (props.grid[props.type].sizes[props.track - 1] = value),
})

ref: trackSizeChanged = debounce((value) => {
  const textNode = value.target.childNodes[0]
  const text = textNode && textNode.data
  if (isValidTrackSize(text)) {
    trackSize = text
  }
}, 700)

ref: isDraggingGrid = computed(() => dragging && dragging.grid === props.grid)

ref: isDraggingTrackLine = computed(
  () =>
    isDraggingGrid &&
    (props.track === dragging[props.type + 'Line'] || props.track === dragging[props.type + 'Line'] - 1)
)
</script>

<style scoped lang="scss">
.col,
.row {
  pointer-events: initial;
  font-family: Consolas, Monaco, 'Andale Mono', 'Ubuntu Mono', monospace;
  font-size: 13px;
  color: #686868;
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
  right: 2px;
  display: grid;
  align-content: center;
}
</style>
