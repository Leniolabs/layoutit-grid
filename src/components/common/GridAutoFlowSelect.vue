<template>
  <div class="display-select-container">
    <label>grid-auto-flow</label>
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

<script setup>
import { computed, defineProps, defineEmit } from 'vue'

defineProps({
  modelValue: { type: String, default: 'row' },
})
defineEmit(['update:modelValue'])

const options = ['row', 'column']
</script>

<style scoped lang="scss">
.display-select-container {
  padding-top: 10px;
  margin-bottom: 10px;
  > label {
    display: block;
    flex: 1 1 0%;
    max-width: max-content;
    color: rgb(156, 220, 254);
    font-size: 13px;
    text-shadow: none;
    font-family: Consolas, Monaco, 'Andale Mono', 'Ubuntu Mono', monospace;
    direction: ltr;
    text-align: left;
    white-space: pre;
    word-spacing: normal;
    margin-bottom: 5px;
  }
}

.radio-toolbar {
  display: flex;
  flex-wrap: wrap;
}

.radio-toolbar input {
  display: none;
}
.radio-toolbar label {
  flex: 1;
  font-family: sans-serif, Arial;
  text-align: center;
  font-size: 13px;
  text-shadow: none;
  font-family: Consolas, Monaco, 'Andale Mono', 'Ubuntu Mono', monospace;
  cursor: pointer;
  position: relative;
  margin: 0 6px 0 0;
  border: solid 1px #23241f;
  background: #151515;
  line-height: 30px;
  display: flex;
  align-items: center;  
  text-align: center;
  justify-content: center;
  color: #aaa;
  svg {
    stroke: #aaa;
    width: 20px;
  }
  &:hover {
    color: #fff;
    svg {
      stroke: #fff;
    }      
  }
  &.dense-label {
    background: transparent;
    border: 0;
  }
  &.default-value {
    opacity: 1;
    color: #fff;
    background: #01579b;
    border-radius: 2px;
  }
}
input[type='checkbox']:checked + label,
input[type='radio']:checked + label {
  opacity: 1;
  color: #fff;
  background: #01579b;
  border-radius: 2px;
  &.dense-label {
    background: transparent;
  }  
  svg {
    color: #fff;
  }
}
</style>
