<template>
  <div class="grid-settings-container">
    <div class="items columns">
      <div class="items-header">
        <h2>grid-auto-columns</h2>
        <OptionsButton class="add-button" @click="addImplicitCol(grid, '1fr')">Add</OptionsButton>
      </div>
      <div v-for="column in colsNumber" :key="column" class="area-size">
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
    <div class="items rows">
      <div class="items-header">
        <h2>grid-auto-rows</h2>
        <OptionsButton class="add-button" @click="addImplicitRow(grid, '1fr')">Add</OptionsButton>
      </div>
      <div v-for="row in rowsNumber" :key="row" class="area-size">
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
  parseUnit,
  parseValue,
  dragging,
  currentFocus,
  currentHover,
  setImplicitRowValueUnit,
  setImplicitColValueUnit,
} from '../../store.js'

import { unitMeasureMap } from '../../utils.js'
import { debounce } from '../../composables'

const colsNumber = computed(() => grid.value.col.auto.length)
const rowsNumber = computed(() => grid.value.row.auto.length)

function unitHasValue(unit) {
  return !(unit === 'initial' || unit === 'auto' || unit === 'min-content' || unit === 'max-content')
}

// TODO: compute new value using previous size

function defaultValueForUnit(unit) {
  return unitMeasureMap[unit] || 1
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
  &:first-child:last-child {
    margin-bottom: -10px;
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
    background: #fafafa;
    color: #333;
    font-size: 14px;
    text-shadow: none;
    direction: ltr;
    cursor: pointer;
    text-align: center;
    flex: 1;
    margin-right: 5px;
    border-radius: 2px;
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
      direction: ltr;
      padding: 0;
      padding-top: 1px;
      flex: 1;
      margin-right: 5px;
      border-radius: 2px;
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
