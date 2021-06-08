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

<script setup>
import { dragging, currentArea, currentHover, currentFocus, isValidAreaName } from '../../store.js'
import { defineProps, ref, computed, nextTick } from 'vue'
import { onCodeInputKeydown, toCssName, targetText } from '../../utils.js'
import { pause, resume } from '../../store.js'
import { useInputSetter } from '../../composables'

const props = defineProps({
  area: { type: Object, required: true },
  color: { type: String, default: null },
})

const areaName = computed({
  get: () => toCssName(props.area.name),
  set: (str) => (props.area.name = str),
})

const el = ref(null)

const inputSetter = useInputSetter(areaName, isValidAreaName, targetText)
const onInput = (event) => {
  const { code } = event
  if (code === 'Enter' || code === 'NumpadEnter' || code === 'Escape') {
    event.preventDefault()
    el.value.blur()
    return
  }
  return inputSetter(event)
}
</script>

<style scoped lang="postcss">
span.token.class-name {
  color: #d7ba7d;
  &:hover {
    color: #eee;
  }
  &:focus {
    color: #eee;
  }
  cursor: text;
}
</style>
