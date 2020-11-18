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
export { onCodeInputKeydown, toCssName, targetText } from '../../utils.js'
export { pause, resume } from '../../store.js'
import { useInputSetter } from '../../composables'

export default {
  props: {
    area: { type: Object, required: true },
  },
}

export { currentArea }

export const areaName = computed({
  get: () => toCssName(props.area.name),
  set: (str) => (props.area.name = str),
})

const onInput = useInputSetter(areaName, isValidAreaName, targetText)
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
