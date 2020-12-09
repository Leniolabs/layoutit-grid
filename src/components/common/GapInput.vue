<template>
  <div class="gap-input">
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
.gap-input {
  display: inline-block;
  margin-right: 10px;
  .input-container {
    display: grid;
    grid-template-columns: 45px 40px;
    grid-template-rows: 30px;
    input {
      text-align: center;
      font-size: 14px;
      height: 24px;
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
