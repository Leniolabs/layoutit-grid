<template>
  <span
    >[<span
      :ref="el"
      :aria-label="`${type} line ${pos} name`"
      role="textbox"
      contenteditable
      spellcheck="false"
      :class="['input', type, { active: false }]"
      @keydown="onCodeInputKeydown"
      @input="onInput"
      @focus="currentFocus = { on: 'line', grid, type, pos }"
      @blur="currentFocus = null"
      >{{ lineName }}</span
    >]</span
  >
</template>

<script setup="props, { emit }">
import { dragging, currentFocus, isValidLineName, parseGridTemplate } from '../../store.js'
import { computed } from 'vue'

import { namedTemplateColumns, namedTemplateRows, onCodeInputKeydown } from '../../utils.js'
import { useInputSetter } from '../../composables/index.js'

export default {
  props: {
    grid: { type: Object, required: true },
    type: { type: String, required: true },
    pos: { type: Number, required: true },
    el: { type: Object, required: true },
  },
}

export { currentFocus, onCodeInputKeydown }

const line = computed(() => props.grid[props.type].lineNames[props.pos - 1])
export const lineName = computed({
  get: () => line.value.name,
  set: (str) => (line.value.name = str),
})

export const onInput = useInputSetter(lineName, isValidLineName, targetText)
</script>

<style scoped lang="scss">
.col,
.row {
  &:hover {
    color: white;
  }
  &:focus {
    color: white;
  }
}
</style>
