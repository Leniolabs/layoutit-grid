<template>
  <div class="area-size">
    <label>{{ type }}</label>
    <div class="input-container">
      <input
        v-if="size.unit !== 'initial'"
        :value="size.value"
        aria-label="size value"
        type="number"
        min="0"
        @input="onSizeInput($event.target.value)"
      />
      <UnitSelect type="size" :value="size.unit" aria-label="size unit" @input="setSizeUnit($event.target.value)" />
    </div>
  </div>
</template>

<script setup>
import UnitSelect from './UnitSelect.vue'

import { defineProps, computed } from 'vue'
import { parseValueUnit } from '../../store.js'
import { unitMeasureMap } from '../../utils.js'
import { inputSetter } from '../../composables'

const props = defineProps({
  area: { type: Object, required: true },
  type: { type: String, required: true }, // 'width' or 'height'
})
const size = computed({
  get() {
    return parseValueUnit(props.area[props.type])
  },
  set(s) {
    props.area[props.type] = s
  },
})

function setSizeValue(value) {
  size.value = value + size.value.unit
}

function setSizeUnit(unit) {
  // TODO: Adjust value to avoid jump
  size.value = unitMeasureMap[unit] + unit
}

const onSizeInput = inputSetter(setSizeValue)
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
  padding: 0 15px;
  &:hover {
    background: #1C1D19;
    .input-container .unit-select,
    .input-container input {
      background: #1C1D19;
    }
  }
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
      height: 38px;
      text-align: right;
      flex: 1;
      font-size: 13px;
      text-shadow: none;
      font-family: Consolas, Monaco, 'Andale Mono', 'Ubuntu Mono', monospace;
      direction: ltr;
      padding: 0;
      padding-top: 1px;      
      &:focus,
      &:hover {
        color: #eee;
      }
    }
    .unit-select {
      appearance: none;
      height: 38px;
      background: rgb(35, 36, 31);
      color: rgb(206, 145, 120);
      flex: 1;
      font-size: 13px;
      text-shadow: none;
      font-family: Consolas, Monaco, 'Andale Mono', 'Ubuntu Mono', monospace;
      direction: ltr;
      cursor: pointer;
      text-align: center;
      padding-left: 3px;
      &:first-child:last-child {
        text-align-last: center;
      }
      &:focus,
      &:hover {
        color: #eee;
      }
    }
  }
}
</style>
