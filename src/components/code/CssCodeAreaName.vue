<template>
  <span
    aria-label="area name"
    role="textbox"
    contenteditable
    spellcheck="false"
    :class="['input', 'token', 'class-name', { active: false }]"
    :style="{ color }"
    @keydown="onCodeInputKeydown($event, $emit)"
    @input="onInput"
    @focus=";(currentArea = area), pause()"
    @blur="resume(true)"
    >{{ areaName }}</span
  >
</template>

<script setup>
import { dragging, currentArea, isValidAreaName } from '../../store.js'
import { defineProps, computed, nextTick } from 'vue'
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

const onInput = useInputSetter(areaName, isValidAreaName, targetText)
</script>

<style scoped lang="postcss">
span.token.class-name {
  color: #d7ba7d;
  &:hover {
    color: white;
  }
  &:focus {
    color: white;
  }
  cursor: text;
}
</style>
