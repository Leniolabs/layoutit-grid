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

const optionsContent = ['start', 'stretch', 'center', 'end', 'space-around', 'space-between', 'space-evenly']
const optionsItems = ['start', 'stretch', 'center', 'end']

const optionsMap = {
  content: optionsContent,
  items: optionsItems,
  self: optionsItems,
}

const options = computed(() => optionsMap[props.type.split('-')[1]])
</script>

<style scoped lang="scss">
span {
  font-size: 14px;
  padding-left: 5px;
  margin-bottom: 5px;
}
.placement-select-container {
  display: grid;
  grid-template-rows: auto auto;
  margin-bottom: 10px;
  label {
    display: block;
    margin-bottom: 3px;
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
  color: #444;
  display: block;
  flex: 1;
  background-color: #ddd;
  padding: 5px 0px;
  font-family: sans-serif, Arial;
  font-size: 13px;
  text-align: center;
  // border: 2px solid #444;
  // border-radius: 4px;
  opacity: 0.7;

  &.long-name {
    width: 67px;
    height: 35px;
    &:last-child {
      width: 66px;
    }
  }
  &.default-value {
    opacity: 1;
    background-color: #bbb;
    color: black;
  }

  &:hover {
    background-color: #dfd;
  }
}

.radio-toolbar input[type='radio']:focus + label {
  // border: 2px solid #444;
}

.radio-toolbar input[type='radio']:checked + label {
  opacity: 1;
  background-color: white;
  color: black;
  // border-color: #4c4;
}
</style>
