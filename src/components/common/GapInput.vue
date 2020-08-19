<template>
  <div class="gap-input">
    <div class="input-container">
      <input :value="gap.value" type="number" min="0" @input="setGapValue($event.target.value)" />
      <unit-select :value="gap.unit" @input="setGapUnit($event.target.value)" />
    </div>
  </div>
</template>

<script setup="props">
import { computed } from 'vue'
import UnitSelect from './UnitSelect.vue'
import { parseValueUnit } from '../../store.js'

export default {
  components: { UnitSelect },
  props: {
    grid: { type: Object, required: true },
    type: { type: String, required: true }, // 'row' or 'col'
  },
}

export const gap = computed(() => {
  return parseValueUnit(props.grid[props.type].gap)
})

export function setGap(g) {
  props.grid[props.type].gap = g
}

export function setGapValue(value) {
  setGap(value + gap.value.unit)
}

export function setGapUnit(unit) {
  // TODO: Adjust value to avoid jump
  setGap(gap.value.value + unit)
}
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
      border: 0;
      width: auto;
      background: #fff;
      color: #333;
    }
    .unit-select {
      min-width: 45px;
    }
  }
  &:nth-child(3) {
    margin-right: 0;
  }
}
</style>
