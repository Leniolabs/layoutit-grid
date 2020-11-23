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
