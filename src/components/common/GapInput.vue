<template>
  <div class="area-size">
    <label>{{ type }}-gap</label>

    <div class="input-container">
      <input
        :value="gap.value"
        aria-label="gap value"
        type="number"
        min="0"
        @input="onSizeValueInput($event.target.value)"
      />
      <UnitSelect :value="gap.unit" aria-label="gap unit" @input="setGapUnit($event.target.value)" />
    </div>
  </div>
</template>

<script setup>
import UnitSelect from './UnitSelect.vue'

import { defineProps, computed } from 'vue'
import { parseValueUnit } from '../../store.js'
import { inputSetter } from '../../composables'

const props = defineProps({
  grid: { type: Object, required: true },
  type: { type: String, required: true }, // 'row' or 'col'
})
const gap = computed({
  get() {
    return parseValueUnit(props.grid[props.type].gap)
  },
  set(value) {
    props.grid[props.type].gap = value
  },
})

function setGapUnit(unit) {
  // TODO: Adjust value to avoid jump
  gap.value = gap.value.value + unit
}

const onSizeValueInput = inputSetter((value) => {
  gap.value = value + gap.value.unit
})
</script>

<style scoped lang="scss">
input::-webkit-outer-spin-button,
input::-webkit-inner-spin-button {
  -webkit-appearance: none;
  margin: 0;
}

/* Firefox */
input[type='number'] {
  -moz-appearance: textfield;
}
.area-size {
  display: flex;
  align-items: center;
  padding: 5px 0 5px 10px;

  label {
    display: block;
    flex: 1;
    max-width: 80px;
    color: rgb(156, 220, 254);
    font-size: 13px;
    text-shadow: none;
    font-family: Consolas, Monaco, 'Andale Mono', 'Ubuntu Mono', monospace;
    direction: ltr;
    text-align: left;
    white-space: pre;
    word-spacing: normal;
  }
  .input-container {
    display: flex;
    flex: 1;
    input {
      font-size: 14px;
      border: 0;
      width: 100%;
      background: rgb(35, 36, 31);
      color: rgb(206, 145, 120);
      height: 25px;
      text-align: right;
      flex: 1;
      font-size: 13px;
      text-shadow: none;
      font-family: Consolas, Monaco, 'Andale Mono', 'Ubuntu Mono', monospace;
      direction: ltr;
      padding: 0;
      &:hover {
        color: #eee;
      }
    }
    .unit-select {
      appearance: none;
      height: 25px;
      background: rgb(35, 36, 31);
      color: rgb(206, 145, 120);
      flex: 1;
      font-size: 13px;
      text-shadow: none;
      font-family: Consolas, Monaco, 'Andale Mono', 'Ubuntu Mono', monospace;
      direction: ltr;
      cursor: text;
      text-align: center;
      padding-left: 3px;
      &:hover {
        color: #eee;
      }
    }
  }
}
</style>
