<template>
  <span
    :aria-label="`${type} gap size`"
    role="textbox"
    contenteditable
    spellcheck="false"
    :class="['input', { active: false }]"
    @keydown="onCodeInputKeydown"
    @input="onInput"
    >{{ gap }}</span
  >
</template>

<script setup="props, { emit }">
import { computed, nextTick } from 'vue'
import { onCodeInputKeydown, toCssName } from '../../utils.js'

export default {
  props: {
    grid: { type: Object, required: true },
    type: { type: String, required: true },
  },
}

ref: gap = computed({
  get: () => props.grid[props.type].gap,
  set: (value) => (props.grid[props.type].gap = value),
})

function textFrom(event) {
  const textNode = event.target.childNodes[0]
  return textNode && textNode.data
}

function onInput(event) {
  gapSizeChanged(event)
}

const gapSizeChanged = (event) => {
  const text = textFrom(event)
  if (text) {
    gap = text
  }
}
</script>

<style scoped lang="scss">
span {
  &:hover {
    color: white;
  }
  &:focus {
    color: white;
  }
}
</style>
