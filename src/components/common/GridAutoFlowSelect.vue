<template>
  <div class="display-select-container">
    <label title="Controls the auto-placement algorithm, specifying how items get flowed into the grid."
      >grid-auto-flow: <span :title="optionTooltipsFlow[modelValue]">{{ modelValue }}</span></label
    >
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
        <label :title="optionTooltipsFlow[option]" :for="`direction-${option}`"
          ><component :is="optionIconsFlow[option]" v-if="optionIconsFlow[option]"
        /></label>
      </template>
      <input
        id="dense"
        :checked="modelValue.includes('dense')"
        type="checkbox"
        name="grid-auto-flow-dense"
        value="dense"
        @input="onInput"
      />
      <label
        title="dense: the packing algorithm attempts to fill in holes in the grid if smaller items come up later. This may cause items to appear out-of-order."
        class="dense-label"
        for="dense"
        ><IconFlowDense
      /></label>
    </div>
  </div>
</template>
<script setup lang="ts">
import { defineProps, defineEmit } from 'vue'
import type { PropType } from 'vue'
import IconFlowCol from '../icons/IconFlowCol.vue'
import IconFlowDense from '../icons/IconFlowDense.vue'
import IconFlowRow from '../icons/IconFlowRow.vue'

const { modelValue } = defineProps({
  modelValue: { type: String as PropType<'column' | 'row'>, default: 'row' },
})

const options = ['row', 'column'] as const

const optionIconsFlow = {
  row: IconFlowRow,
  column: IconFlowCol,
  dense: IconFlowDense,
}

const emit = defineEmit(['update:modelValue'])

const onInput = (event: Event) => {
  emit(
    'update:modelValue',
    (event.target as HTMLInputElement).checked ? modelValue + ' dense' : modelValue.split(' dense')[0]
  )
}
const optionTooltipsFlow = {
  row:
    'row: items are placed by filling each row in turn, adding new rows as necessary. If neither row nor column is provided, row is assumed.',
  column: 'column: items are placed by filling each column in turn, adding new columns as necessary.',
}
</script>
<style scoped lang="postcss">
.display-select-container {
  margin-bottom: 10px;
  > label {
    display: block;
    flex: 1 1 0%;
    color: rgb(156, 220, 254);
    font-size: 13px;
    text-shadow: none;
    font-family: Consolas, Monaco, 'Andale Mono', 'Ubuntu Mono', monospace;
    direction: ltr;
    text-align: left;
    white-space: pre;
    word-spacing: normal;
    line-height: 30px;
    span {
      color: #ce9178;
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
  border: solid 1px #23241f;
  background: #151515;
  line-height: 30px;
  display: flex;
  align-items: center;
  text-align: center;
  justify-content: center;
  color: #eee;
  height: 35px;
  max-width: 60px;
  &.dense-label {
    margin-left: 10px;
  }
  &:last-child {
    border-right: 0;
  }
  svg {
    stroke: #eee;
    width: 20px;
    stroke-width: 6px;
  }
  &:hover {
    color: #fff;
    background: #23241f;
    svg {
      stroke: #fff;
    }
  }
  &.default-value > div {
    opacity: 1;
    color: #fff;
    background: #01579b;
    &:hover {
      background: #01579b;
    }
  }
}
input[type='checkbox']:checked + label,
input[type='radio']:checked + label {
  opacity: 1;
  color: #fff;
  background: #01579b;
  &:hover {
    background: #01579b;
  }
  &.dense-label {
  }
  svg {
    stroke: #eee;
  }
}
</style>
