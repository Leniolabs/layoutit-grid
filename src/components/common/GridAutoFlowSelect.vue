<template>
  <div class="display-select-container">
    <label>grid-auto-flow</label>
    <div class="radio-toolbar">
      <div class="flow-direction">
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
      </div>
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
.flow-direction {
  display: flex;
  flex: 1 1 0%;
}

.display-select-container {
  border-bottom: 1px solid rgba(68, 68, 68, 0.5);
  background: rgb(35, 36, 31);
  padding: 10px 0px 5px 10px;
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
  &:hover {
    opacity: 1;
  }
  &.default-value {
    &:after { content: "*"; }
  }
}
input[type='checkbox']:checked + label,
input[type='radio']:checked + label {
  opacity: 1;
  color: #fff;
}
</style>
