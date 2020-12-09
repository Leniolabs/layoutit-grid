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

<script setup="props">
export { default as UnitSelect } from './UnitSelect.vue'

import { computed } from 'vue'
import { parseValueUnit } from '../../store.js'
import { unitMeasureMap } from '../../utils.js'
import { useInputSetter } from '../../composables'

export default {
  props: {
    area: { type: Object, required: true },
    type: { type: String, required: true }, // 'width' or 'height'
  },
}

export const size = computed({
  get() {
    return parseValueUnit(props.area[props.type])
  },
  set(s) {
    props.area[props.type] = s
  },
})

export function setSizeValue(value) {
  size.value = value + size.value.unit
}

export function setSizeUnit(unit) {
  // TODO: Adjust value to avoid jump
  size.value = unitMeasureMap[unit] + unit
}

export const onSizeInput = useInputSetter(size)
</script>

<style scoped lang="scss">
input::-webkit-outer-spin-button,
input::-webkit-inner-spin-button {
  -webkit-appearance: none;
  margin: 0;
}

/* Firefox */
input[type=number] {
  -moz-appearance: textfield;
}
.area-size {
  display: flex;
  align-items: center;
  padding: 5px 0 5px 10px;
  
  label {
    display: block;
    flex: 1;
    max-width: max-content;
    color: rgb(156, 220, 254);
    font-size: 13px;
    text-shadow: none;
    font-family: Consolas, Monaco, "Andale Mono", "Ubuntu Mono", monospace;
    direction: ltr;
    text-align: left;
    white-space: pre;
    word-spacing: normal;    
  }
  .input-container {
    display: grid;
    grid-template-columns: 1fr 1fr;
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
      font-family: Consolas, Monaco, "Andale Mono", "Ubuntu Mono", monospace;
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
      font-family: Consolas, Monaco, "Andale Mono", "Ubuntu Mono", monospace;
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
