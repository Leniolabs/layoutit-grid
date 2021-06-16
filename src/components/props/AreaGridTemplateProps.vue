<template>
  <div class="grid-settings-container">
    <div class="items columns">
      <div class="items">
        <div class="items-header" title="Defines the track sizing functions of the grid columns.">
          <h2>grid-template-columns</h2>
          <OptionsButton class="add-button" @click="addCol(grid, '1fr')">add<span>+</span></OptionsButton>
        </div>
        <div v-for="column in colsNumber" :key="column" class="area-size">
          <div
            :data-col="column"
            class="input-container"
            @mouseover="currentHover = { on: 'track', grid, type: 'col', track: column }"
            @mouseleave="currentHover = null"
          >
            <input
              :style="{ visibility: unitHasValue(getColUnit(grid)) ? 'visible' : 'hidden' }"
              :value="getColValue(grid, column - 1)"
              :class="{
                active: isFocused('col', column),
                dragging: dragging && (dragging.colLine === column || dragging.colLine === column + 1),
              }"
              :type="getColUnit(grid, column - 1) === 'minmax' ? 'text' : 'number'"
              :aria-label="`column ${column} size`"
              min="0"
              step="0.5"
              @focus="currentFocus = { on: 'track', grid, type: 'col', track: column }"
              @blur="currentFocus = null"
              @input="onSizeValueInput('col', column - 1, $event.target.value)"
            />
            <UnitSelect
              :value="getColUnit(grid, column - 1)"
              type="grid"
              :focused="
                isFocused('col', column) ||
                (dragging && (dragging.colLine === column || dragging.colLine === column + 1))
              "
              class="unit-select"
              :aria-label="`column ${column} unit`"
              @input="onColUnitInput($event.target.value, column - 1)"
            />

            <OptionsButton
              class="remove-button"
              :aria-label="`remove column ${column}`"
              @click="removeCol(area, column - 1)"
              @mouseover.stop="currentHover = { on: 'track', grid, type: 'col', track: column, action: 'remove' }"
              @mouseleave="currentHover = null"
            >
              <IconRemove />
            </OptionsButton>
          </div>
        </div>
      </div>
    </div>
    <div class="items rows">
      <div class="items">
        <div class="items-header" title="Defines track sizing functions of the grid rows.">
          <h2>grid-template-rows</h2>
          <OptionsButton class="add-button" @click="addRow(grid, '1fr')">add<span>+</span></OptionsButton>
        </div>
        <div v-for="row in rowsNumber" :key="row" class="area-size">
          <div
            :data-row="row"
            class="input-container"
            @mouseover="currentHover = { on: 'track', grid, type: 'row', track: row }"
            @mouseleave="currentHover = null"
          >
            <input
              :style="{ visibility: unitHasValue(getRowUnit(grid, row - 1)) ? 'visible' : 'hidden' }"
              :value="getRowValue(grid, row - 1)"
              :class="{
                active: isFocused('row', row),
                dragging: dragging && (dragging.rowLine === row || dragging.rowLine === row + 1),
              }"
              :type="getRowUnit(grid, row - 1) === 'minmax' ? 'text' : 'number'"
              :aria-label="`row ${row} size`"
              min="0"
              step="0.5"
              @focus="currentFocus = { on: 'track', grid, type: 'row', track: row }"
              @blur="currentFocus = null"
              @input="onSizeValueInput('row', row - 1, $event.target.value)"
            />
            <UnitSelect
              :value="getRowUnit(grid, row - 1)"
              type="grid"
              :focused="
                isFocused('row', row) || (dragging && (dragging.rowLine === row || dragging.rowLine === row + 1))
              "
              :aria-label="`row ${row} unit`"
              @input="onRowUnitInput($event.target.value, row - 1)"
            />

            <OptionsButton
              class="remove-button"
              :aria-label="`remove row ${row}`"
              @click="removeRow(area, row - 1)"
              @mouseover.stop="currentHover = { on: 'track', grid, type: 'row', track: row, action: 'remove' }"
              @mouseleave="currentHover = null"
            >
              <IconRemove />
            </OptionsButton>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import IconRemove from '../icons/IconRemove.vue'
import IconAdd from '../icons/IconAdd.vue'
import UnitSelect from '../common/UnitSelect.vue'
import OptionsButton from '../basic/OptionsButton.vue'

import { defineProps, computed } from 'vue'

const props = defineProps({
  area: { type: Object, required: true },
})
const grid = computed(() => props.area.grid)

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

import { useGridDimensions } from '../../composables/area.js'
import { unitMeasureMap } from '../../utils.js'
import { debounce } from '../../composables'

const { colsNumber, rowsNumber } = useGridDimensions(grid)

const autoColsNumber = computed(() => grid.value.col.auto.length)
const autoRowsNumber = computed(() => grid.value.row.auto.length)

function unitHasValue(unit) {
  return !(unit === 'initial' || unit === 'auto' || unit === 'min-content' || unit === 'max-content')
}

// TODO: compute new value using previous size

function defaultValueForUnit(unit) {
  return unitMeasureMap[unit] || 1
}

function onRowUnitInput(unit, row) {
  setRowValueUnit(props.area.grid, row, { value: defaultValueForUnit(unit), unit })
}

function onColUnitInput(unit, col) {
  setColValueUnit(props.area.grid, col, { value: defaultValueForUnit(unit), unit })
}

const onSizeValueInput = debounce((type, track, value) => {
  if (type === 'row') {
    setRowValue(grid.value, track, value)
  } else {
    setColValue(grid.value, track, value)
  }
})
const onAutoSizeValueInput = debounce((type, value) => {
  grid.value[type].auto = withChangedValue(grid.value[type].auto, value)
})

function isFocused(type, track) {
  const tf = currentFocus.value
  return tf && tf.on === 'track' && tf.grid === grid.value && tf.type === type && tf.track === track
}

function onImplicitRowUnitInput(unit, row) {
  setImplicitRowValueUnit(props.area.grid, row, { value: defaultValueForUnit(unit), unit })
}

function onImplicitColUnitInput(unit, col) {
  setImplicitColValueUnit(props.area.grid, col, { value: defaultValueForUnit(unit), unit })
}

const onImplicitSizeValueInput = debounce((type, track, value) => {
  if (type === 'row') {
    setImplicitRowValue(grid.value, track, value)
  } else {
    setImplicitColValue(grid.value, track, value)
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
}

.items {
  margin-bottom: 12px;
  &:last-of-type {
    margin-bottom: 0;
  }
  .items-header:only-child h2,
  .items-header:only-child button {
    opacity: 0.7;
    background: transparent;
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
  color: var(--color-white);
  font-size: 13px;
  text-shadow: none;
  font-family: Consolas, Monaco, 'Andale Mono', 'Ubuntu Mono', monospace;
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
