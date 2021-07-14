<template>
  <span
    >[<span
      :ref="el"
      :aria-label="`${type} line ${pos} name`"
      role="textbox"
      contenteditable
      spellcheck="false"
      :class="['input', type, { active: false }]"
      @keydown="onCodeInputKeydown($event, $emit)"
      @input="onInput"
      @focus="currentFocus = { on: 'line', grid, type, pos }"
      @blur="currentFocus = null"
      >{{ lineName }}</span
    >]</span
  >
</template>

<script setup>
import { dragging, currentFocus, isValidLineName, parseGridTemplate } from '../../store.js'

import { namedTemplateColumns, namedTemplateRows, onCodeInputKeydown, targetText } from '../../utils.js'
import { useInputSetter } from '../../composables/index.js'

const props = defineProps({
  grid: { type: Object, required: true },
  type: { type: String, required: true },
  pos: { type: Number, required: true },
  el: { type: Object, required: true },
})

const line = computed(() => props.grid[props.type].lineNames[props.pos - 1])
const lineName = computed({
  get: () => line.value.name,
  set: (str) => (line.value.name = str),
})

const onInput = useInputSetter(lineName, isValidLineName, targetText)
</script>

<style scoped lang="postcss">
.col,
.row {
  &:hover {
    color: var(--color-gray-lightest);
  }
  &:focus {
    color: var(--color-gray-lightest);
  }
}
</style>
