<template>
  <div class="grid-settings-container">
    <div class="items items-auto">
      <div
        class="items-header"
        title="Specifies the size of an implicitly-created grid row track or pattern of tracks."
      >
        <h2>grid-auto-columns</h2>
        <OptionsButton class="add-button" @click="addImplicitCol(grid, '1fr')">
          add
          <span>+</span>
        </OptionsButton>
      </div>
      <div v-for="column in autoColsNumber" :key="column" class="area-size area-auto-cols">
        <div
          :data-col="column"
          class="input-container"
          @mouseover="currentHover = { on: 'track', grid, type: 'implicit-col', track: column }"
          @mouseleave="currentHover = null"
        >
          <input
            :style="{ visibility: unitHasValue(getImplicitColUnit(grid)) ? 'visible' : 'hidden' }"
            :value="getImplicitColValue(grid, column - 1)"
            :class="{
              active: isFocused('col', column),
              dragging: dragging && (dragging.colLine === column || dragging.colLine === column + 1),
            }"
            :type="getImplicitColUnit(grid, column - 1) === 'minmax' ? 'text' : 'number'"
            :aria-label="`column ${column} size`"
            min="0"
            step="0.5"
            @focus="currentFocus = { on: 'track', grid, type: 'implicit-col', track: column }"
            @blur="currentFocus = null"
            @input="onImplicitSizeValueInput('col', column - 1, $event.target.value)"
          />
          <UnitSelect
            :value="getImplicitColUnit(grid, column - 1)"
            type="grid"
            :focused="
              isFocused('col', column) || (dragging && (dragging.colLine === column || dragging.colLine === column + 1))
            "
            class="unit-select"
            :aria-label="`column ${column} unit`"
            @input="onImplicitColUnitInput($event.target.value, column - 1)"
          />
          <OptionsButton
            class="remove-button"
            :aria-label="`remove column ${column}`"
            @click="removeImplicitCol(grid, column - 1)"
            @mouseover.stop="
              currentHover = { on: 'track', grid, type: 'implicit-col', track: column, action: 'remove' }
            "
            @mouseleave="currentHover = null"
          >
            <IconRemove />
          </OptionsButton>
        </div>
      </div>
    </div>
    <div class="items items-auto">
      <div
        class="items-header"
        title="Specifies the size of an implicitly-created grid column track or pattern of tracks."
      >
        <h2>grid-auto-rows</h2>
        <OptionsButton class="add-button" @click="addImplicitRow(grid, '1fr')">
          add
          <span>+</span>
        </OptionsButton>
      </div>
      <div v-for="row in autoRowsNumber" :key="row" class="area-size area-auto-rows">
        <div
          :data-row="row"
          class="input-container"
          @mouseover="currentHover = { on: 'track', grid, type: 'implicit-row', track: row }"
          @mouseleave="currentHover = null"
        >
          <input
            :style="{ visibility: unitHasValue(getImplicitRowUnit(grid, row - 1)) ? 'visible' : 'hidden' }"
            :value="getImplicitRowValue(grid, row - 1)"
            :class="{
              active: isFocused('row', row),
              dragging: dragging && (dragging.rowLine === row || dragging.rowLine === row + 1),
            }"
            :type="getImplicitRowUnit(grid, row - 1) === 'minmax' ? 'text' : 'number'"
            :aria-label="`row ${row} size`"
            min="0"
            step="0.5"
            @focus="currentFocus = { on: 'track', grid, type: 'implicit-row', track: row }"
            @blur="currentFocus = null"
            @input="onImplicitSizeValueInput('row', row - 1, $event.target.value)"
          />
          <UnitSelect
            :value="getImplicitRowUnit(grid, row - 1)"
            type="grid"
            :focused="isFocused('row', row) || (dragging && (dragging.rowLine === row || dragging.rowLine === row + 1))"
            :aria-label="`row ${row} unit`"
            @input="onImplicitRowUnitInput($event.target.value, row - 1)"
          />
          <OptionsButton
            class="remove-button"
            :aria-label="`remove row ${row}`"
            @click="removeImplicitRow(grid, row - 1)"
            @mouseover.stop="currentHover = { on: 'track', grid, type: 'implicit-row', track: row, action: 'remove' }"
            @mouseleave="currentHover = null"
          >
            <IconRemove />
          </OptionsButton>
        </div>
      </div>
    </div>
    <GridAutoFlowSelect v-model="grid.autoFlow" />
  </div>
</template>

<script setup lang="ts">
const { area } = defineProps<{ area }>()

let grid = $computed(() => area.grid)

import {
  addCol,
  addRow,
  getRowValue,
  getRowUnit,
  setRowValue,
  removeRow,
  getColValue,
  getColUnit,
  setColValue,
  removeCol,
  parseUnit,
  parseValue,
  dragging,
  withChangedValue,
  withChangedUnit,
  currentFocus,
  currentHover,
  setRowValueUnit,
  setColValueUnit,
  addImplicitCol,
  addImplicitRow,
  getImplicitRowValue,
  getImplicitRowUnit,
  setImplicitRowValue,
  removeImplicitRow,
  getImplicitColValue,
  getImplicitColUnit,
  setImplicitColValue,
  removeImplicitCol,
  setImplicitRowValueUnit,
  setImplicitColValueUnit,
} from '../../store.js'

import { unitMeasureMap } from '../../utils.js'
import { debounce } from '../../composables'

let autoColsNumber = $computed(() => grid.col.auto.length)
let autoRowsNumber = $computed(() => grid.row.auto.length)

function unitHasValue(unit) {
  return !(unit === 'initial' || unit === 'auto' || unit === 'min-content' || unit === 'max-content')
}

// TODO: compute new value using previous size

function defaultValueForUnit(unit) {
  return unitMeasureMap[unit] || 1
}

function onRowUnitInput(unit, row) {
  setRowValueUnit(area.grid, row, { value: defaultValueForUnit(unit), unit })
}

function onColUnitInput(unit, col) {
  setColValueUnit(area.grid, col, { value: defaultValueForUnit(unit), unit })
}

const onSizeValueInput = debounce((type, track, value) => {
  if (type === 'row') {
    setRowValue(grid, track, value)
  } else {
    setColValue(grid, track, value)
  }
})
const onAutoSizeValueInput = debounce((type, value) => {
  grid[type].auto = withChangedValue(grid[type].auto, value)
})

function isFocused(type, track) {
  const tf = currentFocus
  return tf && tf.on === 'track' && tf.grid === grid && tf.type === type && tf.track === track
}

function onImplicitRowUnitInput(unit, row) {
  setImplicitRowValueUnit(area.grid, row, { value: defaultValueForUnit(unit), unit })
}

function onImplicitColUnitInput(unit, col) {
  setImplicitColValueUnit(area.grid, col, { value: defaultValueForUnit(unit), unit })
}

const onImplicitSizeValueInput = debounce((type, track, value) => {
  if (type === 'row') {
    setImplicitRowValue(grid, track, value)
  } else {
    setImplicitColValue(grid, track, value)
  }
})
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
  transition: all 0.2s ease-in-out;
}

.items {
  &:last-of-type {
    margin-bottom: 0;
  }
  .items-header:only-child h2,
  .items-header:only-child button {
    opacity: 0.7;
    background: transparent;
    &:hover {
      opacity: 1;
    }
  }
  .items-header:only-child button:hover {
    opacity: 1;
  }
}

.items-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  position: relative;
  &:only-child:hover h2 {
    opacity: 1;
  }
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
    padding-left: 5px;
    margin-right: 5px;
    border-top-left-radius: 0;
    border-bottom-left-radius: 0;
  }
  .input-container {
    display: flex;
    flex: 1;
    input {
      border: 0;
      width: 100%;
      max-width: 80px;
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
    stroke: var(--color-gray-lightest);
    stroke-width: 6px;
  }
  &:hover {
    opacity: 1;
    background: var(--color-remove-active);
  }
}

.add-button {
  height: 30px;
  max-width: max-content;
  background: var(--color-blue);
  padding: 0 12px;
  font-size: 13px;
  text-shadow: none;
  font-family: Consolas, Monaco, 'Andale Mono', 'Ubuntu Mono', monospace;
  color: var(--color-gray-lightest);
  span {
    font-size: 12px;
    margin-left: 5px;
    padding-right: 2px;
    display: none;
  }
  &:hover {
    background: var(--color-blue-dark);
  }
  &:after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
  }
}

.area-size.area-auto-cols .input-container,
.area-size.area-auto-rows .input-container {
  input,
  select {
    background: var(--color-black);
    color: var(--color-gray-lightest);
    border: 1px solid var(--color-gray-darkest);
  }
  input::-webkit-outer-spin-button,
  input::-webkit-inner-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }
  input[type='number'] {
    -moz-appearance: textfield;
    padding-right: 12px;
  }
}
</style>
