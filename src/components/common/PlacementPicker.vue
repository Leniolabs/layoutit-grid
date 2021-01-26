<template>
  <div class="placement-select-container">
    <label>{{ type }}</label>
    <div class="radio-toolbar">
      <template v-for="option in options" :key="option">
        <input
          :id="`items-placement-${type}-${option}`"
          :checked="modelValue === option"
          type="radio"
          :name="`items-placement-${type}`"
          :value="option"
          @input="$emit('update:modelValue', option)"
          @click="option === modelValue && $emit('update:modelValue', 'initial')"
        />
        <label
          :class="{
            'default-value': option === (initial === 'initial' ? 'stretch' : initial) && modelValue === 'initial',
            'long-name': option.includes('space'),
          }"
          :for="`items-placement-${type}-${option}`"
          ><component :is="optionIcons[option]" v-if="optionIcons[option]" /><template v-else>{{
            option
          }}</template></label
        >
      </template>
    </div>
  </div>
</template>

<script setup>
import { computed, defineProps, defineEmit } from 'vue'
import { validGridUnits } from '../../store.js'
import IconStart from '../icons/IconStart.vue'
import IconCenter from '../icons/IconCenter.vue'
import IconEnd from '../icons/IconEnd.vue'

const props = defineProps({
  modelValue: { type: String, default: 'stretch' },
  type: { type: String, default: 'justify-content' }, // [ justify | align ]-[ content, items, self ]
  focused: { type: Boolean, default: false },
  initial: { type: String, default: 'initial' },
})
defineEmit(['update:modelValue'])

const optionsContent = ['stretch', 'start', 'center', 'end', 'around', 'between', 'evenly']
const optionsItems = ['stretch', 'start', 'center', 'end']

const optionsMap = {
  content: optionsContent,
  items: optionsItems,
  self: optionsItems,
}

const optionIcons = {
  start: IconStart,
  center: IconCenter,
  end: IconEnd,
}

const options = computed(() => optionsMap[props.type.split('-')[1]])
</script>

<style scoped lang="scss">
.placement-select-container {
  padding: 10px 0px 0 0;
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
  font-family: Consolas, Monaco, 'Andale Mono', 'Ubuntu Mono', monospace;
  opacity: 1;
  cursor: pointer;
  position: relative;
  margin: 0 10px 10px 0;
  border: solid 1px #23241f;
  line-height: 30px;
  padding: 0 10px;
  &:hover {
    opacity: 1;
  }
  &.default-value {
    &:after {
      content: '*';
    }
  }
}
input[type='radio']:checked + label {
  opacity: 1;
  color: #fff;
  background: #01579b;
  border-radius: 2px;
}
</style>
