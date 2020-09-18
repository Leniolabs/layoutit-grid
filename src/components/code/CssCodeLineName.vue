<template>
  <span
    >[<span
      :ref="el"
      role="textbox"
      contenteditable
      spellcheck="false"
      :class="['input', type, { active: false }]"
      @keydown="onCodeInputKeydown"
      @input="onInput"
      >{{ lineName }}</span
    >]</span
  >
</template>

<script setup="props, { emit }">
import { dragging, lineNameFocus, isValidLineName } from '../../store.js'
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

export { lineNameFocus, onCodeInputKeydown }

const line = computed(() => props.grid[props.type].lineNames[props.pos])
export const lineName = computed({
  get: () => line.value.name,
  set: (str) => (line.value.name = str),
})

function textFrom(event) {
  const textNode = event.target.childNodes[0]
  return textNode && textNode.data
}

export function onInput(event) {
  lineNameChanged(event)
}

export const lineNameChanged = (event) => {
  const text = textFrom(event)
  if (isValidLineName(text)) {
    lineName.value = text
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
