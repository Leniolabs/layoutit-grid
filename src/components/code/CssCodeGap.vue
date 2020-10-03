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
export { onCodeInputKeydown, toCssName } from '../../utils.js'

export default {
  props: {
    grid: { type: Object, required: true },
    type: { type: String, required: true },
  },
}

export const gap = computed({
  get: () => props.grid[props.type].gap,
  set: (value) => (props.grid[props.type].gap = value),
})

function textFrom(event) {
  const textNode = event.target.childNodes[0]
  return textNode && textNode.data
}

export function onInput(event) {
  gapSizeChanged(event)
}

const gapSizeChanged = (event) => {
  const text = textFrom(event)
  if (text) {
    gap.value = text
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
