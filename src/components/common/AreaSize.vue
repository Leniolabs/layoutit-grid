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
.area-size {
  display: block;
  margin-right: 10px;
  .input-container {
    display: grid;
    grid-template-columns: 100px 90px;
    grid-template-rows: 30px;
    gap: 0 8px;
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
    height: 24px;
  }
  .unit-select {
    border-radius: 0 2px 2px 0;
  }
  &:nth-child(3) {
    margin-right: 0;
  }
}
</style>
