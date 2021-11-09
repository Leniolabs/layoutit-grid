<template>
  <div class="display-select-container">
    <label title="Controls the auto-placement algorithm, specifying how items get flowed into the grid.">
      grid-auto-flow:
      <span :title="optionTooltipsFlow[direction]">{{ modelValue }}</span>
    </label>
    <div class="radio-toolbar">
      <template v-for="option in options" :key="option">
        <input
          :id="`direction-${option}`"
          :checked="direction === option"
          type="radio"
          name="grid-auto-flow-direction"
          :value="option"
          @input="$emit('update:modelValue', option + (dense ? ' dense' : ''))"
        />
        <label :title="optionTooltipsFlow[option]" :for="`direction-${option}`">
          <component :is="optionIconsFlow[option]" v-if="optionIconsFlow[option]" />
        </label>
      </template>
      <input id="dense" :checked="dense" type="checkbox" name="grid-auto-flow-dense" value="dense" @input="onInput" />
      <label
        title="dense: the packing algorithm attempts to fill in holes in the grid if smaller items come up later. This may cause items to appear out-of-order."
        class="dense-label"
        for="dense"
      >
        <IconFlowDense />
      </label>
    </div>
  </div>
</template>
<script setup lang="ts">
import IconFlowCol from '../icons/IconFlowCol.vue'
import IconFlowDense from '../icons/IconFlowDense.vue'
import IconFlowRow from '../icons/IconFlowRow.vue'
import type { AutoFlowProperties } from '../../types'

const { modelValue = 'row' } = defineProps<{
  modelValue: AutoFlowProperties
}>()

const options = ['row', 'column'] as const

const optionIconsFlow = {
  row: IconFlowRow,
  column: IconFlowCol,
  dense: IconFlowDense,
}

const emit = defineEmits(['update:modelValue'])

let direction = $computed(() => modelValue.split(' dense')[0])
let dense = $computed(() => modelValue.includes('dense'))

const onInput = (event: Event) => {
  emit('update:modelValue', direction + (dense ? '' : ' dense'))
}
const optionTooltipsFlow = {
  row: 'row: items are placed by filling each row in turn, adding new rows as necessary. If neither row nor column is provided, row is assumed.',
  column: 'column: items are placed by filling each column in turn, adding new columns as necessary.',
}
</script>
<style scoped lang="postcss">
.display-select-container {
  margin-bottom: 10px;
  > label {
    display: block;
    flex: 1 1 0%;
    color: var(--color-blue-lightest);
    font-size: 13px;
    text-shadow: none;
    font-family: Consolas, Monaco, 'Andale Mono', 'Ubuntu Mono', monospace;
    direction: ltr;
    text-align: left;
    word-spacing: normal;
    line-height: 30px;
    span {
      color: var(--color-orange);
    }
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
  border: solid 1px var(--color-gray-darkest);
  background: var(--color-black);
  line-height: 30px;
  display: flex;
  align-items: center;
  text-align: center;
  justify-content: center;
  color: var(--color-gray-lightest);
  height: 35px;
  max-width: 60px;
  &.dense-label {
    margin-left: 10px;
  }
  &:last-child {
    border-right: 0;
  }
  svg {
    stroke: var(--color-gray-lightest);
    width: 20px;
    stroke-width: 6px;
  }
  &:hover {
    color: var(--color-white);
    background: var(--color-gray-darkest);
    svg {
      stroke: var(--color-white);
    }
  }
  &.default-value > div {
    opacity: 1;
    color: var(--color-white);
    background: var(--color-blue);
    &:hover {
      background: var(--color-blue);
    }
  }
}
input[type='checkbox']:checked + label,
input[type='radio']:checked + label {
  opacity: 1;
  color: var(--color-white);
  background: var(--color-blue);
  &:hover {
    background: var(--color-blue);
  }
  &.dense-label {
  }
  svg {
    stroke: var(--color-gray-lightest);
  }
}
</style>
