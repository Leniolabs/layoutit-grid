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
import { isValidGapSize } from '../../store.js'
export { onCodeInputKeydown, toCssName, targetText } from '../../utils.js'
import { useInputSetter } from '../../composables'

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

export const onInput = useInputSetter(gap, isValidGapSize, targetText)
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
