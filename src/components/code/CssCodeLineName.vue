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
import { dragging, currentFocus, isValidLineName } from '../../store.js'
import { computed } from 'vue'

import { namedTemplateColumns, namedTemplateRows, parseGridTemplate, onCodeInputKeydown } from '../../utils.js'

export default {
  props: {
    grid: { type: Object, required: true },
    type: { type: String, required: true },
    pos: { type: Number, required: true },
    el: { type: Object, required: true },
  },
}

ref: line = computed(() => props.grid[props.type].lineNames[props.pos - 1])
ref: lineName = computed({
  get: () => line.name,
  set: (str) => (line.name = str),
})

function textFrom(event) {
  const textNode = event.target.childNodes[0]
  return textNode && textNode.data
}

function onInput(event) {
  lineNameChanged(event)
}

ref: lineNameChanged = (event) => {
  const text = textFrom(event)
  if (isValidLineName(text)) {
    lineName = text
  }
}
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
