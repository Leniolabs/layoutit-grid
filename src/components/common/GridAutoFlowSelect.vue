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
        @input="
          $emit('update:modelValue', $event.target.checked ? modelValue + ' dense' : modelValue.split(' dense')[0])
        "
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

<script setup>
import { computed, defineProps, defineEmit } from 'vue'
import IconFlowCol from '../icons/IconFlowCol.vue'
import IconFlowDense from '../icons/IconFlowDense.vue'
import IconFlowRow from '../icons/IconFlowRow.vue'

defineProps({
  modelValue: { type: String, default: 'row' },
})
defineEmit(['update:modelValue'])

const options = ['row', 'column']

const optionIconsFlow = {
  row: IconFlowRow,
  column: IconFlowCol,
  dense: IconFlowDense,
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
    margin-right: 0;
  }
  svg {
    stroke: #eee;
  }
}
</style>
