<template>
  <div class="area-type-select-container">
    <span>type</span>
    <select :value="modelValue" class="area-type-select" @input="$emit('update:modelValue', $event.target.value)">
      <option v-for="option in options" :key="option" :value="option">{{ option }}</option>
    </select>
  </div>
</template>

<script setup="props">
import { computed } from 'vue'

export default {
  props: {
    modelValue: { type: String, default: 'box' },
  },
  emits: ['update:modelValue'],
}

export const options = ['div', 'p', 'image', 'component']
</script>

<style scoped lang="scss">
.area-type-select-container {
  display: grid;
  grid-template-columns: 0.75fr 1fr;
  margin-bottom: 5px;
  span {
    align-self: center;
    font-size: 12px;
    width: 100%;
  }
}
.area-type-select {
  background: #fff;
  border: 0 none;
  border-radius: 2px;
  width: 100%;
  font-size: 12px;
}
</style>
