<template>
  <div class="placement-select-container">
    <input :id="type" type="checkbox" :checked="modelValue != 'initial'" />

    <label :for="type" :title="optionTooltipsType[type]">
      {{ type }}:
      <span :title="optionTooltips[modelValue]">{{ modelValue }}</span>
    </label>
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
        >
          <template v-if="type.includes('justify')">
            <div :title="optionTooltips[option]">
              <component :is="optionIconsJustify[option]" v-if="optionIconsJustify[option]" />
            </div>
          </template>
          <template v-if="type.includes('align')">
            <div :title="optionTooltips[option]">
              <component :is="optionIconsAlign[option]" v-if="optionIconsAlign[option]" />
            </div>
          </template>
        </label>
      </template>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { ContentProperties, AlignOptionsType } from '../../types'
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

const optionsContent = ['stretch', 'start', 'center', 'end', 'space-around', 'space-between', 'space-evenly']

const optionsItems = ['stretch', 'start', 'center', 'end']

const alignOptionsMap = {
  content: optionsContent,
  items: optionsItems,
  self: optionsItems,
}

const {
  modelValue = 'stretch',
  type = 'justify-content', // [ justify | align ]-[ content, items, self ]
  focused = false,
  initial = 'initial',
} = defineProps<{
  modelValue?: ContentProperties
  type?: OptionTooltipsType // [ justify | align ]-[ content, items, self ]
  focused?: boolean
  initial?: string
}>()
defineEmits(['update:modelValue'])

const optionIconsJustify = {
  stretch: IconJustifyStretch,
  start: IconJustifyStart,
  center: IconJustifyCenter,
  end: IconJustifyEnd,
  'space-around': IconJustifyAround,
  'space-between': IconJustifyBetween,
  'space-evenly': IconJustifyEvenly,
}

const optionIconsAlign = {
  stretch: IconAlignStretch,
  start: IconAlignStart,
  center: IconAlignCenter,
  end: IconAlignEnd,
  'space-around': IconAlignAround,
  'space-between': IconAlignBetween,
  'space-evenly': IconAlignEvenly,
}

const optionTooltips = {
  stretch:
    'stretch: if the combined size of items is less than the size of the container, any auto-sized items have their size increased equally, so that they fill the container.',
  start: 'start: items are packed flush to each other toward the start edge of the container.',
  center: 'center: items are packed flush to each other toward the center of the container.',
  end: 'end: items are packed flush to each other toward the end edge of the container.',
  'space-around':
    'space-around: items are evenly distributed. The empty space before the first and after the last item equals half of the space between each pair of adjacent items.',
  'space-between':
    'space-between: items are evenly distributed. The first item is flush with the main-start, and the last item is flush with the main-end.',
  'space-evenly':
    'space-evenly: items are evenly distributed. The spacing between each pair of adjacent items, the main-start and the first item, and the main-end and the last item, are all the same.',
}

const optionTooltipsType = {
  'justify-items':
    'Defines the default justify-self for all items of the box, giving them all a default way of justifying each box along the appropriate axis.',
  'justify-content':
    'Defines how the browser distributes space between and around content items along the inline axis of a container.',
  'justify-self': 'Sets the way a box is justified inside its alignment container along the appropriate axis.',
  'align-items':
    'Sets the align-self value on all direct children as a group, controlling the alignment of items on the Block Axis within their grid area.',
  'align-content': 'Sets the distribution of space between and around content items along a grid block axis.',
  'align-self': 'Overrides a grid item align-items value, aligning it inside the grid area.',
}

type OptionTooltipsType = keyof typeof optionTooltipsType

let options = $computed(() => alignOptionsMap[type.split('-')[1] as AlignOptionsType])
</script>

<style scoped lang="postcss">
.placement-select-container {
  input,
  input ~ .radio-toolbar {
    display: none;
  }
  input:checked ~ .radio-toolbar {
    display: flex;
  }
  input:checked + label {
    opacity: 1;
  }
  > label {
    display: block;
    flex: 1 1 0%;
    color: var(--color-blue-lightest);
    font-size: 13px;
    text-shadow: none;
    font-family: Consolas, Monaco, 'Andale Mono', 'Ubuntu Mono', monospace;
    direction: ltr;
    text-align: left;
    white-space: pre;
    word-spacing: normal;
    cursor: pointer;
    opacity: 0.7;
    transition: all 0.2s ease-in-out;
    line-height: 30px;
    &:hover {
      opacity: 1;
    }
    span {
      color: var(--color-orange);
    }
  }
}

.radio-toolbar {
  display: flex;
  flex-wrap: wrap;
  gap: 0px;
  margin-bottom: 6px;
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
  border: solid 1px var(--color-gray-darkest);
  border-right: 0;
  background: var(--color-black);
  height: 35px;
  min-width: 60px;
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  color: var(--color-gray);
  &:last-child {
    border-right: solid 1px var(--color-gray-darkest);
  }
  > div {
    position: absolute;
    top: 0;
    right: 0;
    left: 0;
    bottom: 0;
    display: flex;
    justify-content: center;
    &:hover {
      background: var(--color-gray-darkest);
    }
  }
  svg {
    stroke: var(--color-gray-lightest);
    fill: var(--color-gray-lightest);
    width: 20px;
    stroke-width: 6px;
    rect {
      fill: var(--color-gray-lightest);
    }
  }
  &:hover {
    color: var(--color-white);
    svg {
      stroke: var(--color-white);
    }
  }
  &.default-value > div {
    opacity: 1;
    color: var(--color-white);
    background: rgba(var(--color-blue-rgb), 0.45);
    &:hover {
      background: rgba(var(--color-blue-rgb), 0.6);
    }
    svg {
      stroke: var(--color-white);
    }
  }
}
input[type='radio']:checked + label {
  opacity: 1;
  color: var(--color-white);
  > div {
    background: var(--color-blue);
  }
  svg {
    stroke: var(--color-white);
  }
}
rect {
  fill: var(--color-gray-lightest);
}
</style>
