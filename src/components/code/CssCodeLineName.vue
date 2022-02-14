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

<script setup lang="ts">
import { useAppState, isValidLineName, parseGridTemplate } from '../../store.js'

let { dragging, currentFocus } = $(useAppState())

import { namedTemplateColumns, namedTemplateRows, onCodeInputKeydown, targetText } from '../../utils.js'
import { useInputSetter } from '../../composables/index.js'

const { grid, type, pos, el } = defineProps<{
  grid
  type: string
  pos: number
  el
}>()

let line = $computed(() => grid[type].lineNames[pos - 1])
let lineName = $computed({
  get: () => line.name,
  set: (str) => (line.name = str),
})

const onInput = useInputSetter($$(lineName), isValidLineName, targetText)
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
