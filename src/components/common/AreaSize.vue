<template>
  <div class="area-size">
    <div class="input-container">
      <input
        :value="size.value"
        aria-label="size value"
        type="number"
        min="0"
        @input="setSizeValue($event.target.value)"
      />
      <UnitSelect :value="size.unit" aria-label="size unit" @input="setSizeUnit($event.target.value)" />
    </div>
  </div>
</template>

<script setup="props">
export { default as UnitSelect } from './UnitSelect.vue'

import { computed } from 'vue'
import { parseValueUnit } from '../../store.js'

export default {
  props: {
    area: { type: Object, required: true },
    type: { type: String, required: true }, // 'width' or 'height'
  },
}

export const size = computed(() => {
  return parseValueUnit(props.area[props.type])
})

export function setSize(s) {
  props.area[props.type] = s
}

export function setSizeValue(value) {
  setSize(value + size.value.unit)
}

export function setSizeUnit(unit) {
  // TODO: Adjust value to avoid jump
  setSize(size.value.value + unit)
}
</script>

<style scoped lang="scss">
.area-size {
  display: inline-block;
  margin-right: 10px;
  .input-container {
    display: grid;
    grid-template-columns: 45px 40px;
    grid-template-rows: 30px;
    input {
      text-align: center;
      font-size: 14px;
      border: 0;
      width: auto;
      background: #fff;
      color: #333;
    }
    .unit-select {
      min-width: 45px;
    }
  }
  input {
    border-radius: 2px 0 0 2px;
  }
  .unit-select {
    border-radius: 0 2px 2px 0;
  }
  &:nth-child(3) {
    margin-right: 0;
  }
}
</style>
