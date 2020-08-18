<template>
  <select
    :value="modelValue"
    class="unit-select"
    @input="$emit('update:modelValue', $event.target.value)"
  >
    <option v-for="option in options" :value="option" :key="option">{{ option }}</option>
  </select>
</template>

<script setup="props">
import { computed } from 'vue'

const units = {
  grid: ['fr', 'px', '%', 'em', 'auto', 'min-content', 'max-content', 'minmax'],
  flex: ['px', '%', 'em'],
  default: ['px', '%', 'em'],
}

export default {
  props: {
    modelValue: { type: String, default: 'px' },
    type: { type: String, default: 'default' }, //  default, grid, flex
  },
}

export const options = computed(() => units[props.type])
</script>

<style scoped lang="scss">
.unit-select {
  background: #fff;
  border: 0;
  width: 100%;
  font-size: 14px;
}
</style>
