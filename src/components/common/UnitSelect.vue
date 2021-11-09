<template>
  <select :value="modelValue" :class="['unit-select', { focused }]" @input="onInput">
    <option v-for="option in options" :key="option" :value="option">{{ option }}</option>
  </select>
</template>

<script setup lang="ts">
import type { UnitSelectType, UnitsInterface } from '../../types'
// @ts-ignore
import { validGridUnits } from '../../store.js'

const units = {
  grid: validGridUnits,
  flex: ['px', '%', 'em'],
  default: ['px', '%', 'em'],
  size: ['px', '%', 'em', 'auto'],
  auto: [...validGridUnits, 'initial'],
} as UnitsInterface

const {
  modelValue = 'px',
  type = 'default',
  focused = false,
} = defineProps<{
  modelValue?: string
  type?: UnitSelectType
  focused?: boolean
}>()

const emit = defineEmits(['update:modelValue'])

let options = $computed(() => units[type])

const onInput = (event: Event) => {
  emit('update:modelValue', (event.target as HTMLInputElement).value)
}
</script>

<style scoped lang="postcss">
.unit-select {
  background: var(--color-white);
  border: 0 none;
  border-radius: 2px;

  width: 100%;
  height: 24px;
  font-size: 14px;
}
.unit-select.focused {
  background: var(--color-lightest-white);
}
</style>
