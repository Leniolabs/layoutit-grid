<template>
  <div class="grid-settings-container">
    <div class="items columns">
      <div class="items-header">
        <h2>grid-template-columns</h2>
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
          <div class="select-container">
            <UnitSelect
              :value="getColUnit(grid, column - 1)"
              type="grid"
              :focused="
                isFocused('col', column) || (dragging && (dragging.colLine === column || dragging.colLine === column + 1))
              "
              class="unit-select"
              :aria-label="`column ${column} unit`"
              @input="onColUnitInput($event.target.value, column - 1)"
            />
            <svg class="select-icon" fill="none" stroke="#0E1A27" stroke-width="8" stroke-dashoffset="0" stroke-dasharray="200 20" stroke-linecap="round" stroke-linejoin="round" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><polyline fill="none" points="70,10 20,50 70,90 "></polyline></svg>

          </div>

          <OptionsButton
            class="remove-button"
            :aria-label="`remove column ${column}`"
            :disabled="grid.col.sizes.length === 1"
            @click="removeCol(area, column - 1)"
            @mouseover.stop="currentHover = { on: 'track', grid, type: 'col', track: column, action: 'remove' }"
            @mouseleave="currentHover = null"
          >
            <IconRemove />
          </OptionsButton>
        </div>
      </div>
      <div class="area-size">
        <OptionsButton class="add-button" @click="addCol(grid, '1fr')">add +</OptionsButton>
      </div>
    </div>
    <div class="items rows">
      <div class="items-header">
        <h2>grid-template-rows</h2>
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
          <div class="select-container">
            <UnitSelect
              :value="getRowUnit(grid, row - 1)"
              type="grid"
              :focused="isFocused('row', row) || (dragging && (dragging.rowLine === row || dragging.rowLine === row + 1))"
              :aria-label="`row ${row} unit`"
              @input="onRowUnitInput($event.target.value, row - 1)"
            />
            <svg class="select-icon" fill="none" stroke="#0E1A27" stroke-width="8" stroke-dashoffset="0" stroke-dasharray="200 20" stroke-linecap="round" stroke-linejoin="round" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><polyline fill="none" points="70,10 20,50 70,90 "></polyline></svg>
          </div>


          <OptionsButton
            class="remove-button"
            :aria-label="`remove row ${row}`"
            :disabled="grid.row.sizes.length === 1"
            @click="removeRow(area, row - 1)"
            @mouseover.stop="currentHover = { on: 'track', grid, type: 'row', track: row, action: 'remove' }"
            @mouseleave="currentHover = null"
          >
            <IconRemove />
          </OptionsButton>
        </div>
      </div>
      <div class="area-size">
        <OptionsButton class="add-button" @click="addRow(grid, '1fr')">add +</OptionsButton>
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
} from '../../store.js'

import { useGridDimensions } from '../../composables/area.js'
import { unitMeasureMap } from '../../utils.js'
import { debounce } from '../../composables'

const { colsNumber, rowsNumber } = useGridDimensions(grid)

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
</script>

<style scoped lang="scss">



h2 {
  display: block;
  flex: 1;
  max-width: max-content;
  color: rgb(156, 220, 254);
  font-size: 13px;
  text-shadow: none;
  font-family: Consolas, Monaco, 'Andale Mono', 'Ubuntu Mono', monospace;
  direction: ltr;
  text-align: left;
  white-space: pre;
  word-spacing: normal;
  margin: 0;
  font-weight: normal;
  padding-left: 10px;
  margin-bottom: 5px;
}

.items {
  background: rgb(35, 36, 31);
  padding: 10px 0 0;
  margin-bottom: 10px;
  &:last-of-type {
    margin-bottom: 0;
  }
}

input::-webkit-outer-spin-button,
input::-webkit-inner-spin-button {
  -webkit-appearance: none;
  margin: 0;
}

/* Firefox */
input[type='number'] {
  -moz-appearance: textfield;
}
.area-size {
  display: flex;
  align-items: center;
  padding: 0 10px;
  border-bottom: 1px solid rgba(68, 68, 68, 0.5);
  position: relative;
  &:hover {
    background: #1c1d19;
    .input-container .unit-select,
    .input-container input {
      background: #1c1d19;
    }
  }
  &:last-of-type {
    border: 0;
  }  
  .select-container {
      flex: 1;
      padding-left: 3px;

    .unit-select {
      appearance: none;
      height: 38px;
      background: rgb(35, 36, 31);
      color: rgb(206, 145, 120);
      font-size: 13px;
      text-shadow: none;
      font-family: Consolas, Monaco, 'Andale Mono', 'Ubuntu Mono', monospace;
      direction: ltr;
      cursor: pointer;
      text-align: center;
      &:focus,
      &:hover {
        color: #eee;
      }
    }    
    .select-icon {
      stroke: #ce9178;
      width: 12px;
      position: absolute;
      right: 40px;
      top: 12.5px;
      transform: rotate(-90deg);
      opacity: 0.8;
      pointer-events: none;
    }
    &:hover {
      .select-icon {
        stroke: #eee;
      }
    }
  }
  label {
    display: block;
    flex: 1;
    max-width: max-content;
    color: rgb(215, 186, 125);
    font-size: 13px;
    text-shadow: none;
    font-family: Consolas, Monaco, 'Andale Mono', 'Ubuntu Mono', monospace;
    direction: ltr;
    text-align: left;
    white-space: pre;
    word-spacing: normal;
    opacity: 0.8;
  }
  .input-container {
    display: grid;
    grid-template-columns: 1fr 1fr 30px;
    flex: 1;
    input {
      font-size: 14px;
      border: 0;
      width: 100%;
      background: rgb(35, 36, 31);
      color: rgb(206, 145, 120);
      height: 38px;
      text-align: right;
      flex: 1;
      font-size: 13px;
      text-shadow: none;
      font-family: Consolas, Monaco, 'Andale Mono', 'Ubuntu Mono', monospace;
      direction: ltr;
      padding: 0;
      padding-top: 1px;
      &:focus,
      &:hover {
        color: #eee;
      }
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
  font-family: Consolas, Monaco, 'Andale Mono', 'Ubuntu Mono', monospace;
  direction: ltr;
  text-align: left;
  white-space: pre;
  word-spacing: normal;
  color: rgb(215, 186, 125);
  //color: rgb(156, 220, 254);

  height: 38px;
  display: flex;
  align-items: center;
  &.remove-button[disabled] {
    opacity: 0.5;
  }
  &.remove-button {
    opacity: 0.8;
    justify-content: flex-end;
  }
  svg {
    width: 10px;
    stroke: rgb(206, 145, 120);
  }
  &:hover {
    background: transparent;
    opacity: 1;
    color: #eee;
    svg {
      stroke: #fff;
    }
  }
}

.add-button {
  height: 30px;
}
</style>
