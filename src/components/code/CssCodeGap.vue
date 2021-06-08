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

<script setup>
import { defineProps, computed, nextTick } from 'vue'
import { isValidGapSize } from '../../store.js'
import { onCodeInputKeydown, toCssName, targetText } from '../../utils.js'
import { useInputSetter } from '../../composables'

const props = defineProps({
  grid: { type: Object, required: true },
  type: { type: String, required: true },
})
const gap = computed({
  get: () => props.grid[props.type].gap,
  set: (value) => (props.grid[props.type].gap = value),
})

const onInput = useInputSetter(gap, isValidGapSize, targetText)
</script>

<style scoped lang="postcss">
span {
  &:hover {
    color: #eee;
  }
  &:focus {
    color: #eee;
  }
}
</style>
