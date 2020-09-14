<template>
  <div
    role="textbox"
    contenteditable
    :class="['input', type, { active: isDraggingTrackLine }]"
    @pointerdown.stop
    @input="trackSizeChanged"
    @focus="$emit('focused')"
    @blur="$emit('blurred')"
  >
    {{ trackSize }}
  </div>
</template>

<script setup="props, { emit }">
import { dragging, isValidTrackSize } from '../../store.js'
import { computed } from 'vue'
import { debounce } from 'lodash-es'

export default {
  props: {
    grid: { type: Object, required: true },
    type: { type: String, required: true },
    track: { type: Number, required: true },
  },
}

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
  font-size: 14px;
  color: #888;
  position: absolute;

  padding: 2px;
  &.active {
    color: #27ae60;
  }
  &:focus {
    font-weight: 700;
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
