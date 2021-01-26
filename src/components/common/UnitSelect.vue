<template>
  <select
    :value="modelValue"
    :class="['unit-select', { focused }]"
    @input="$emit('update:modelValue', $event.target.value)"
  >
    <option v-for="option in options" :key="option" :value="option">{{ option }}</option>
  </select>
</template>

<script setup>
import { computed, defineProps, defineEmit } from 'vue'
import { validGridUnits } from '../../store.js'

const units = {
  grid: validGridUnits,
  flex: ['px', '%', 'em'],
  default: ['px', '%', 'em'],
  size: ['px', '%', 'em', 'initial'],
  auto: [...validGridUnits, 'initial'],
}

const props = defineProps({
  modelValue: { type: String, default: 'px' },
  type: { type: String, default: 'default' }, //  default, grid, flex
  focused: { type: Boolean, default: false },
})
defineEmit(['update:modelValue'])

const options = computed(() => units[props.type])
</script>

<style scoped lang="scss">
.unit-select {
  background: #fff;
  border: 0 none;
  border-radius: 2px;
  
  width: 100%;
  height: 24px;
  font-size: 14px;
}
.unit-select.focused {
  background: #e4f5e4;
}
</style>
