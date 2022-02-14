<template>
  <span
    :aria-label="`${type} gap size`"
    role="textbox"
    contenteditable
    spellcheck="false"
    :class="['input', { active: false }]"
    @keydown="onCodeInputKeydown($event, $emit)"
    @input="onInput"
    >{{ gap }}</span
  >
</template>

<script setup lang="ts">
import { isValidGapSize } from '../../store.js'
import { onCodeInputKeydown, toCssName, targetText } from '../../utils.js'
import { useInputSetter } from '../../composables'

const { grid, type } = defineProps<{
  grid
  type: string
}>()

let gap = $computed({
  get: () => grid[type].gap,
  set: (value) => (grid[type].gap = value),
})

const onInput = useInputSetter($$(gap), isValidGapSize, targetText)
</script>

<style scoped lang="postcss">
span {
  &:hover {
    color: var(--color-gray-lightest);
  }
  &:focus {
    color: var(--color-gray-lightest);
  }
}
</style>
