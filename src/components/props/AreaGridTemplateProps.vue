<template>
  <div class="grid-settings-container">
    <div class="items columns">
      <div class="items-header">
        <h2>grid-template-columns</h2>
        <OptionsButton class="add-button" @click="addCol(grid, '1fr')">Add</OptionsButton>
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
                isFocused('col', column) || (dragging && (dragging.colLine === column || dragging.colLine === column + 1))
              "
              class="unit-select"
              :aria-label="`column ${column} unit`"
              @input="onColUnitInput($event.target.value, column - 1)"
            />
      

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

    </div>
    <div class="items rows">
      <div class="items-header">
        <h2>grid-template-rows</h2>
        <OptionsButton class="add-button" @click="addRow(grid, '1fr')">Add</OptionsButton>
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
              :focused="isFocused('row', row) || (dragging && (dragging.rowLine === row || dragging.rowLine === row + 1))"
              :aria-label="`row ${row} unit`"
              @input="onRowUnitInput($event.target.value, row - 1)"
            />



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
  color: #eee;
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
  margin-bottom: 15px;
  &:last-of-type {
    margin-bottom: 0;
  }
}

.items-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 6px;
  > * { flex: 1; max-width: max-content; }
}

.area-size {
  display: flex;
  align-items: center;
  //padding: 0 10px;
  //border-bottom: 1px solid rgba(68, 68, 68, 0.5);
  position: relative;
  margin-bottom: 6px;
  &:last-of-type {
    border: 0;
  }  
   .unit-select {
      height: 30px;
      background: #fafafa;
      color: #333;
      font-size: 14px;
      text-shadow: none;
      //font-family: Consolas, Monaco, 'Andale Mono', 'Ubuntu Mono', monospace;
      direction: ltr;
      cursor: pointer;
      text-align: center;
      flex: 1;
      margin-right: 5px;
      border-radius: 2px;

      &:focus,
      &:hover {
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
    display: flex;
    flex: 1;
    input {
      border: 0;
      width: 100%;
      max-width: 80px;
      background: #fafafa;
      color: #333;
      height: 30px;
      text-align: center;
      flex: 1;
      font-size: 14px;
      text-shadow: none;
      //font-family: Consolas, Monaco, 'Andale Mono', 'Ubuntu Mono', monospace;
      direction: ltr;
      padding: 0;
      padding-top: 1px;
      flex: 1;
      margin-right: 5px;
      border-radius: 2px;
      &:focus,
      &:hover {
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
  max-width: 50px;
  background: #01579b;
}
</style>
