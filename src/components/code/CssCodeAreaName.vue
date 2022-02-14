<template>
  <span
    ref="el"
    aria-label="area name"
    role="textbox"
    contenteditable
    spellcheck="false"
    :class="['input', 'token', 'class-name', { active: false }]"
    :style="{ color }"
    @keydown.stop="onInput"
    @focus=";(currentFocus = { on: 'area', area }), (currentArea = area), pause()"
    @blur=";(currentFocus = null), resume(true)"
    @mouseover="currentHover = { on: 'html-area', area }"
    @mouseleave="currentHover = null"
    >{{ areaName }}</span
  >
</template>

<script setup lang="ts">
import { useAppState, isValidAreaName, pause, resume } from '../../store.js'
import { onCodeInputKeydown, toCssName, targetText } from '../../utils.js'
import { useInputSetter } from '../../composables'

let { dragging, currentArea, currentHover, currentFocus } = $(useAppState())

const { area, color } = defineProps<{ area; color?: string }>()

let areaName = $computed({
  get: () => toCssName(area.name),
  set: (str) => (area.name = str),
})

let el = $ref(null)

const inputSetter = useInputSetter($$(areaName), isValidAreaName, targetText)
const onInput = (event) => {
  const { code } = event
  if (code === 'Enter' || code === 'NumpadEnter' || code === 'Escape') {
    event.preventDefault()
    el.blur()
    return
  }
  return inputSetter(event)
}
</script>

<style scoped lang="postcss">
span.token.class-name {
  color: var(--color-golden);
  &:hover {
    color: var(--color-gray-lightest);
  }
  &:focus {
    color: var(--color-gray-lightest);
  }
  cursor: text;
}
</style>
