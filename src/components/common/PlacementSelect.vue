<template>
  <div class="placement-select-container">
    <label>{{ type }}</label>
    <select
      :value="modelValue"
      :class="['placement-select', { focused }]"
      @input="$emit('update:modelValue', $event.target.value)"
    >
      <option v-for="option in options" :key="option" :value="option">{{ option }}</option>
    </select>
  </div>
</template>

<script setup>
import { computed, defineProps, defineEmit } from 'vue'
import { validGridUnits } from '../../store.js'

const props = defineProps({
  modelValue: { type: String, default: 'stretch' },
  type: { type: String, default: 'justify-content' }, // [ justify | align ]-[ content, items, self ]
  focused: { type: Boolean, default: false },
})
defineEmit(['update:modelValue'])

const optionsContent = ['initial', 'start', 'end', 'center', 'stretch', 'space-around', 'space-between', 'space-evenly']
const optionsItems = ['initial', 'start', 'end', 'center', 'stretch']

const optionsMap = {
  content: optionsContent,
  items: optionsItems,
  self: optionsItems,
}

const options = computed(() => optionsMap[props.type.split('-')[1]])
</script>

<style scoped lang="scss">
.placement-select-container {
  display: grid;
  grid-template-columns: 0.75fr 1fr;
  margin-bottom: 5px;
  label {
    display: block;
    margin-bottom: 3px;
  }
}
.placement-select {
  background: #fff;
  border: 0 none;
  border-radius: 2px;
  width: 100%;
  font-size: 12px;
}
.placement-select.focused {
  background: #e4f5e4;
}
</style>
