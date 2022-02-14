<template>
  <div>
    <div class="items-header">
      <h2 v-if="type === 'col'" title="Sets the size of the gap (gutter) between grid columns.">column-gap</h2>
      <h2 v-if="type === 'row'" title="Sets the size of the gap (gutter) between grid rows.">row-gap</h2>
    </div>
    <div class="area-size">
      <div class="input-container">
        <input :value="gap.value" aria-label="gap value" type="number" min="0" @input="setGapValue($event)" />
        <UnitSelect :value="gap.unit" aria-label="gap unit" @input="setGapUnit($event)" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { ValueGapUnit, DefaultUnit, Cell } from '../../types'
//@ts-ignore
import { parseValueUnit } from '../../store.js'

const { grid, type } = defineProps<{
  grid
  type: Cell // 'row' or 'col'
}>()

let gap = $computed({
  get: (): ValueGapUnit => {
    return parseValueUnit(grid[type].gap)
  },
  set: ({ value, unit }) => {
    grid[type].gap = value + unit
  },
})

function setGapUnit(event: Event) {
  const unit = (event.target as HTMLInputElement).value as DefaultUnit
  // TODO: Adjust value to avoid jump
  gap = { ...gap, unit }
}

function setGapValue(event: Event) {
  const value = (event.target as HTMLInputElement).value
  gap = { ...gap, value }
}
</script>

<style scoped lang="postcss">
h2 {
  display: block;
  flex: 1;
  max-width: max-content;
  color: var(--color-blue-lightest);
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
  + .area-size {
    margin-top: 6px;
  }
  > * {
    flex: 1;
    max-width: max-content;
  }
}

.area-size {
  display: flex;
  align-items: center;
  position: relative;
  margin-bottom: 6px;
  .unit-select {
    height: 30px;
    background: var(--color-white);
    color: var(--color-gray-dark);
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
      background: var(--color-white);
      color: var(--color-gray-dark);
      height: 30px;
      text-align: center;
      flex: 1;
      font-size: 14px;
      text-shadow: none;
      direction: ltr;
      padding: 0;
      padding-top: 0;
      flex: 1;
      margin-right: 0px;
      border-radius: 2px;
      border-top-right-radius: 0;
      border-bottom-right-radius: 0;
      border-right: 1px solid var(--color-gray);
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
    svg {
      stroke-width: 15px;
    }
  }
  svg {
    width: 10px;
    stroke: var(--color-white);
    stroke-width: 6px;
  }
  &:hover {
    opacity: 1;
    background: var(--color-remove-active);
  }
}

.add-button {
  height: 30px;
  max-width: 50px;
  background: var(--color-blue);
  &:hover {
    background: var(--color-add);
  }
}
</style>
