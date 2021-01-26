<template>
<div>
      <div class="items-header">
        <h2 v-if="type === 'col'">column-gap</h2>
        <h2 v-if="type === 'row'">row-gap</h2>
      </div>
  <div class="area-size">

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

h2 {
  display: block;
  flex: 1;
  max-width: max-content;
  color: #9cdcfe;
  font-weight: normal;
  font-size: 13px;
  text-shadow: none;
  font-family: Consolas, Monaco, 'Andale Mono', 'Ubuntu Mono', monospace;
  direction: ltr;
  text-align: left;
  white-space: pre;
  word-spacing: normal;
  margin: 0;
}

.items {
  margin-bottom: 10px;
  padding-top: 8px;
  &:last-of-type {
    margin-bottom: 0;
  }
}

.items-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  + .area-size { margin-top: 6px; }
  > * { flex: 1; max-width: max-content; }
}

.area-size {
  display: flex;
  align-items: center;
  position: relative;
  margin-bottom: 6px;
  .unit-select {
    height: 30px;
    background: #fafafa;
    color: #333;
    font-size: 14px;
    text-shadow: none;
    direction: ltr;
    cursor: pointer;
    text-align: center;
    flex: 1;
    margin-right: 0px;
    border-radius: 2px;
    border-top-left-radius: 0;
    border-bottom-left-radius: 0;
    padding-left: 5px;
  }  
  .input-container {
    display: flex;
    flex: 1;
    input {
      border: 0;
      width: 100%;
      background: #fafafa;
      color: #333;
      height: 30px;
      text-align: center;
      flex: 1;
      font-size: 14px;
      text-shadow: none;
      direction: ltr;
      padding: 0;
      padding-top: 1px;
      flex: 1;
      margin-right: 0px;
      border-radius: 2px;
      border-top-right-radius: 0;
      border-bottom-right-radius: 0;
      border-right: 1px solid #aaa;
    }
  }
}

button,
.add-button {
  background: transparent;
  margin: 0;
  padding: 0;
  height: auto;
  font-size: 13px;
  text-shadow: none;
  direction: ltr;
  text-align: left;
  white-space: pre;
  word-spacing: normal;
  max-width: 30px;
  height: 30px;
  display: flex;
  align-items: center;
  flex: 1;
  justify-content: center;
  border-radius: 2px;
  &.remove-button[disabled] {
    opacity: 0.5;
  }
  &.remove-button {
    background: var(--color-remove);
  }
  svg {
    width: 10px;
    stroke: #fff;
    stroke-width: 20px;
  }
  &:hover {
    opacity: 1;
    background: var(--color-remove-active);
  }
}

.add-button {
  height: 30px;
  max-width: 50px;
  background: #01579b;
  &:hover {
    background: #0165b4;
  }
}
</style>
