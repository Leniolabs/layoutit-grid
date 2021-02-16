<template>
  <div class="placement-select-container">
    <label>{{ type }}: <span>{{modelValue}}</span></label>
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
          :for="`items-placement-${type}-${option}`">
          <template v-if="type === 'justify-items'">
            <component :is="optionIconsJustify[option]" v-if="optionIconsJustify[option]" />
          </template>
          <template v-if="type === 'justify-content'">
            <component :is="optionIconsJustify[option]" v-if="optionIconsJustify[option]" />
          </template>          
          <template v-if="type === 'align-items'">
            <component :is="optionIconsAlign[option]" v-if="optionIconsAlign[option]" />
          </template>
          <template v-if="type === 'align-content'">
            <component :is="optionIconsAlign[option]" v-if="optionIconsAlign[option]" />
          </template>          
        </label>
      </template>
    </div>
  </div>
</template>

<script setup>
import { computed, defineProps, defineEmit } from 'vue'
import { validGridUnits } from '../../store.js'
import IconJustifyStart from '../icons/IconJustifyStart.vue'
import IconJustifyStretch from '../icons/IconJustifyStretch.vue'
import IconJustifyCenter from '../icons/IconJustifyCenter.vue'
import IconJustifyEnd from '../icons/IconJustifyEnd.vue'
import IconJustifyAround from '../icons/IconJustifyAround.vue'
import IconJustifyBetween from '../icons/IconJustifyBetween.vue'
import IconJustifyEvenly from '../icons/IconJustifyEvenly.vue'

import IconAlignStart from '../icons/IconAlignStart.vue'
import IconAlignStretch from '../icons/IconAlignStretch.vue'
import IconAlignCenter from '../icons/IconAlignCenter.vue'
import IconAlignEnd from '../icons/IconAlignEnd.vue'
import IconAlignAround from '../icons/IconAlignAround.vue'
import IconAlignBetween from '../icons/IconAlignBetween.vue'
import IconAlignEvenly from '../icons/IconAlignEvenly.vue'

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

const optionIconsJustify = {
  stretch: IconJustifyStretch,
  start: IconJustifyStart,
  center: IconJustifyCenter,
  end: IconJustifyEnd,
  around: IconJustifyAround,
  between: IconJustifyBetween,
  evenly: IconJustifyEvenly  
}

const optionIconsAlign = {
  stretch: IconAlignStretch,
  start: IconAlignStart,
  center: IconAlignCenter,
  end: IconAlignEnd,
  around: IconAlignAround,
  between: IconAlignBetween,
  evenly: IconAlignEvenly
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
    span {
      color: #ce9178;
    }    
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
  flex: 1;
  font-size: 13px;
  text-shadow: none;
  font-family: Consolas, Monaco, 'Andale Mono', 'Ubuntu Mono', monospace;
  cursor: pointer;
  position: relative;
  margin: 0 0 6px 0;
  border: solid 1px #23241f;
  border-right: 0;
  background: #151515;
  height: 35px;
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  color: #aaa;
  &:last-child { border-right: solid 1px #23241f; }

  svg {
    stroke: #aaa;
    width: 20px;
    stroke-width: 5px;  
    rect {
      fill: transparent;
    }  
  }
  &:hover {
    color: #fff;
    svg {
      stroke: #fff;
    }    
  }
  &.default-value {
    opacity: 1;
    color: #fff;
    background: #01579b;
    border-radius: 2px;
    svg { stroke: #fff; }
  }
}
input[type='radio']:checked + label {
  opacity: 1;
  color: #fff;
  background: #01579b;
  border-radius: 2px;
  svg {
    stroke: #fff;
  }
}
    rect {
      fill: transparent;
    }  
</style>
