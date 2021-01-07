<template>
  <div class="display-select-container">
    <div class="radio-toolbar">
      <template v-for="option in options" :key="option">
        <input
          :id="`display-${option}`"
          :checked="modelValue === option"
          type="radio"
          name="display"
          :value="option"
          @input="$emit('update:modelValue', option)"
        />
        <label :for="`display-${option}`">{{ option }}</label>
      </template>
    </div>
  </div>
</template>

<script setup>
import { computed, defineProps, defineEmit } from 'vue'

defineProps({
  modelValue: { type: String, default: 'block' },
})
defineEmit(['update:modelValue'])

const options = ['block', 'flex', 'grid']
</script>

<style scoped lang="scss">
.display-select-container {
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
