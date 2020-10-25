<template>
  <div class="display-select-container">
    <span>display</span>
    <select :value="modelValue" class="display-select" @input="$emit('update:modelValue', $event.target.value)">
      <option v-for="option in options" :key="option" :value="option">{{ option }}</option>
    </select>
  </div>
</template>

<script setup="props">
import { computed } from 'vue'

export default {
  props: {
    modelValue: { type: String, default: 'block' },
  },
  emits: ['update:modelValue'],
}

export const options = ['block', 'grid', 'flex']
</script>

<style scoped lang="scss">
.display-select-container {
  display: grid;
  grid-template-columns: 0.75fr 1fr;
  margin-bottom: 5px;
  span {
    align-self: center;
    font-size: 12px;
    width: 100%;
  }
}
.display-select {
  background: #fff;
  border: 0 none;
  border-radius: 2px;
  width: 100%;
  font-size: 12px;
}
</style>
