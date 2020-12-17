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

<script setup>
import { dragging, currentFocus, currentHover, isValidTrackSize, parseGridTemplate } from '../../store.js'
import { defineProps, computed } from 'vue'
import { useInputSetter } from '../../composables'

import { namedTemplateColumns, namedTemplateRows, onCodeInputKeydown, targetText } from '../../utils.js'

const props = defineProps({
  grid: { type: Object, required: true },
  type: { type: String, required: true },
  track: { type: Number, required: true },
  el: { type: Object, required: true },
})

const trackSize = computed({
  get: () => props.grid[props.type].sizes[props.track - 1],
  set: (value) => (props.grid[props.type].sizes[props.track - 1] = value),
})

const isFocused = computed(() => {
  const cf = currentFocus.value
  return cf && cf.on === 'track' && cf.grid === props.grid && cf.type === props.type && cf.track === props.track
})

const onInput = useInputSetter(trackSize, isValidTrackSize, targetText)

const isDraggingGrid = computed(() => dragging.value && dragging.value.grid === props.grid)

const isDraggingTrackLine = computed(
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
