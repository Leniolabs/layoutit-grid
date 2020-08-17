<template>
  <div class="gap-input">
    <div class="input-container">
      <input :value="getGapValue()" type="number" min="0" @input="setGapValue($event.target.value)" />
      <unit-select :value="getGapUnit()" @input="setGapUnit($event.target.value)" />
    </div>
  </div>
</template>

<script>
import UnitSelect from './UnitSelect.vue'
import { parseValue, parseUnit } from '../../store.js'

export default {
  name: 'GapInput',
  components: { UnitSelect },
  props: {
    grid: { type: Object, required: true },
    type: { type: String, required: true } // 'row' or 'col'
  },
  methods: {
    getGapUnit() {
      return parseUnit(this.grid[this.type].gap)
    },
    getGapValue() {
      return parseValue(this.grid[this.type].gap)
    },
    setGap(value) {
      this.grid[this.type].gap = value
    },
    setGapValue(value) {
      this.setGap(value + this.getGapUnit())
    },
    setGapUnit(unit) {
      // TODO: Adjust value to avoid jump
      this.setGap(this.getGapValue() + unit)
    }
  }
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
