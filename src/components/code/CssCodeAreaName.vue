<template>
  <span
    aria-label="area name"
    role="textbox"
    contenteditable
    spellcheck="false"
    :class="['input', { active: false }]"
    @keydown="onCodeInputKeydown"
    @input="onInput"
    @focus="pause"
    @blur="resume(true)"
    >{{ areaName }}</span
  >
</template>

<script setup="props, { emit }">
import { dragging, currentArea, isValidAreaName } from '../../store.js'
import { computed, nextTick } from 'vue'
import { onCodeInputKeydown, toCssName } from '../../utils.js'
import { pause, resume } from '../../store.js'

export default {
  props: {
    area: { type: Object, required: true },
  },
}

ref: areaName = computed({
  get: () => toCssName(props.area.name),
  set: (str) => (props.area.name = str),
})

function textFrom(event) {
  const textNode = event.target.childNodes[0]
  return textNode && textNode.data
}

function onInput(event) {
  areaNameChanged(event)
}

const areaNameChanged = (event) => {
  const text = textFrom(event)
  if (text && isValidAreaName(text)) {
    areaName = text
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
