<template>
  <div class="placement-select-container">
    <label>{{ type }}</label>
    <div class="radio-toolbar">
      <template v-for="option in options" :key="option">
        <input
          :id="`items-placement-${type}-${option}`"
          :checked="modelValue === option"
          type="radio"
          :name="`items-placement-${type}`"
          :value="option"
          @input="$emit('update:modelValue', option)"
          @click="option === modelValue && $emit('update:modelValue', 'initial')"
        />
        <label
          :class="{
            'default-value': option === (initial === 'initial' ? 'stretch' : initial) && modelValue === 'initial',
            'long-name': option.includes('space'),
          }"
          :for="`items-placement-${type}-${option}`"
          >{{ option }}</label
        >
      </template>
    </div>
  </div>
</template>

<script setup>
import { computed, defineProps, defineEmit } from 'vue'
import { validGridUnits } from '../../store.js'

const props = defineProps({
  modelValue: { type: String, default: 'stretch' },
  type: { type: String, default: 'justify-content' }, // [ justify | align ]-[ content, items, self ]
  focused: { type: Boolean, default: false },
  initial: { type: String, default: 'initial' },
})
defineEmit(['update:modelValue'])

const optionsContent = ['initial', 'start', 'end', 'center', 'stretch', 'around', 'between', 'evenly']
const optionsItems = ['initial', 'start', 'end', 'stretch', 'center']

const optionsMap = {
  content: optionsContent,
  items: optionsItems,
  self: optionsItems,
}

const options = computed(() => optionsMap[props.type.split('-')[1]])
</script>

<style scoped lang="scss">
.placement-select-container {
  background: rgb(35, 36, 31);
  padding: 10px 0px 5px 10px;
  border-bottom: 1px solid rgba(68, 68, 68, 0.5);
  > label {
    display: block;
    flex: 1 1 0%;
    max-width: max-content;
    color: rgb(156, 220, 254);
    font-size: 13px;
    text-shadow: none;
    font-family: Consolas, Monaco, 'Andale Mono', 'Ubuntu Mono', monospace;
    direction: ltr;
    text-align: left;
    white-space: pre;
    word-spacing: normal;
    margin-bottom: 5px;
  }
}

.radio-toolbar {
  display: flex;
  flex-wrap: wrap;
  gap: 0px;
}

.radio-toolbar input {
  display: none;
}
.radio-toolbar label {
  color: rgb(206, 145, 120);
  display: block;
  flex: 1;
  padding: 5px 0;
  font-family: sans-serif, Arial;
  text-align: center;
  font-size: 13px;
  text-shadow: none;
  font-family: Consolas, Monaco, 'Andale Mono', 'Ubuntu Mono', monospace;
  opacity: 0.7;
  cursor: pointer;
  min-width: 33.333%;
  max-width: 33.333%;
  position: relative;
  &:hover {
    opacity: 1;
  }
  &.default-value {
    &:after { content: "*"; position: absolute; right: 0; }
  }
}
input[type='radio']:checked + label {
  opacity: 1;
  color: #fff;
}
</style>
