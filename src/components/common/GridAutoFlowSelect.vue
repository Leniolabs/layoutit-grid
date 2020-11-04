<template>
  <div class="display-select-container">
    <p>grid-auto-flow</p>
    <div class="radio-toolbar">
      <template v-for="option in options" :key="option">
        <input
          :id="`direction-${option}`"
          :checked="modelValue.includes(option)"
          type="radio"
          name="grid-auto-flow-direction"
          :value="option"
          @input="$emit('update:modelValue', option + (modelValue.includes('dense') ? ' dense' : ''))"
        />
        <label :for="`direction-${option}`">{{ option }}</label>
      </template>
      <input
        id="dense"
        :checked="modelValue.includes('dense')"
        type="checkbox"
        name="grid-auto-flow-dense"
        value="dense"
        @input="
          $emit('update:modelValue', $event.target.checked ? modelValue + ' dense' : modelValue.split(' dense')[0])
        "
      />
      <label class="dense-label" for="dense">dense</label>
    </div>
  </div>
</template>

<script setup="props">
import { computed } from 'vue'

export default {
  props: {
    modelValue: { type: String, default: 'row' },
  },
  emits: ['update:modelValue'],
}

export const options = ['row', 'column']
</script>

<style scoped lang="scss">
p {
  font-size: 14px;
  padding-left: 5px;
  margin-bottom: 5px;
}
.display-select-container {
  display: grid;
  grid-template-rows: auto auto;
  margin-bottom: 25px;
  span {
    align-self: center;
    font-size: 12px;
    width: 100%;
  }
}

.radio-toolbar {
  display: flex;
  gap: 5px;
}

.radio-toolbar input[type='radio'],
.radio-toolbar input[type='checkbox'] {
  opacity: 0;
  position: fixed;
  width: 0;
}

.radio-toolbar label {
  color: #444;
  display: inline-block;
  background-color: #ddd;
  padding: 3px 6px;
  font-family: sans-serif, Arial;
  font-size: 14px;
  width: 60px;
  text-align: center;
  border: 2px solid #444;
  border-radius: 4px;
  opacity: 0.7;
}

.radio-toolbar label:hover {
  background-color: #dfd;
}

.radio-toolbar .dense-label {
  margin-left: 10px;
  background-color: #555;
  color: white;
  &:hover {
    background-color: #222;
  }
}

.radio-toolbar input[type='radio']:focus + label {
  border: 2px solid #444;
}

.radio-toolbar input[type='radio']:checked + label {
  opacity: 1;
  background-color: white;
  color: black;
  border-color: #4c4;
}

.radio-toolbar input[type='checkbox']:focus + label {
  border: 2px solid #444;
}

.radio-toolbar input[type='checkbox']:checked + label {
  opacity: 1;
  background-color: white;
  color: black;
}
</style>
