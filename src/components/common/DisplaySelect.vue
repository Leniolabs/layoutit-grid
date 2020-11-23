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

<script setup="props">
import { computed } from 'vue'

export default {
  props: {
    modelValue: { type: String, default: 'block' },
  },
  emits: ['update:modelValue'],
}

export const options = ['block', 'flex', 'grid']
</script>

<style scoped lang="scss">
.display-select-container {
  //display: grid;
  //grid-template-columns: 0.75fr 1fr;
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
