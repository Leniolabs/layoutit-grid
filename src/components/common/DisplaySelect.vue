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
    background: #1e1e1e;
    display: block;
    flex: 1;
    font-family: sans-serif, Arial;
    text-align: center;
    font-size: 13px;
    text-shadow: none;
    font-family: Consolas, Monaco, "Andale Mono", "Ubuntu Mono", monospace;
    opacity: 1;
    cursor: pointer;
    position: relative;
    margin: 0 10px 10px 0;
    border: solid 1px #23241f;
    line-height: 30px;
  &:hover {
    opacity: 1;
  }
  &.default-value {
    &:after { content: "*"; }
  }
}
input[type='radio']:checked + label {
  opacity: 1;
  color: #fff;
      background: #01579b;
    border-radius: 2px;
}
</style>
