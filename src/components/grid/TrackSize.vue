<template>
  <div
    ref="el"
    role="textbox"
    :aria-label="`${type} track ${track} size`"
    contenteditable
    :class="['editor-track-size', 'input', type, { active: isDraggingTrackLine, focused: isFocused }]"
    @pointerdown.stop
    @keydown.stop="onInput"
    @focus="currentFocus = { on: 'track', grid, type, track }"
    @blur="currentFocus = null"
  >
    {{ trackSize }}
  </div>
</template>

<script setup>
import { useAppState, isValidTrackSize } from '../../store.js'
import { targetText } from '../../utils.js'
import { useInputSetter } from '../../composables'

let { dragging, currentFocus } = $(useAppState())

const props = defineProps({
  grid: { type: Object, required: true },
  type: { type: String, required: true },
  track: { type: Number, required: true },
})

let el = $ref(null)

let isFocused = $computed(() => {
  const cf = currentFocus
  return cf && cf.on === 'track' && cf.grid === props.grid && cf.type === props.type && cf.track === props.track
})

let trackSize = $computed({
  get: () => props.grid[props.type].sizes[props.track - 1],
  set: (value) => (props.grid[props.type].sizes[props.track - 1] = value),
})

const inputSetter = useInputSetter($$(trackSize), isValidTrackSize, targetText)

const onInput = (event) => {
  const { code } = event
  if (code === 'Space') {
    event.preventDefault()
    return
  }
  if (code === 'Enter' || code === 'NumpadEnter' || code === 'Escape') {
    event.preventDefault()
    el.blur()
    return
  }
  return inputSetter(event)
}

let isDraggingGrid = $computed(() => dragging && dragging.grid === props.grid)

let isDraggingTrackLine = $computed(
  () =>
    isDraggingGrid &&
    (props.track === dragging[props.type + 'Line'] || props.track === dragging[props.type + 'Line'] - 1)
)
</script>

<style scoped lang="postcss">
.col,
.row {
  pointer-events: initial;
  font-family: Consolas, Monaco, 'Andale Mono', 'Ubuntu Mono', monospace;
  font-size: 13px;
  /* todo@fix:a11y: #757575 */
  /*color: #757575;*/
  color: var(--color-gray);
  padding: 2px;
  &.row {
    padding-right: 4px;
  }
  user-select: none;
  &.active {
    color: var(--color-green);
  }
  &:focus {
    color: black;
  }
  &.focused {
    color: black;
  }
}
</style>
