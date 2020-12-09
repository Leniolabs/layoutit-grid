<template>
  <div class="grid-settings-container">
    <div class="items columns">
      <div class="items-header">
        <h2>grid-template-columns </h2>
      </div>
      <div class="area-size" v-for="column in colsNumber" :key="column">
        <label>{{column}}:</label>
        <div
          :data-col="column"
          @mouseover="currentHover = { on: 'track', grid, type: 'col', track: column }"
          @mouseleave="currentHover = null"
          class="input-container"
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
<!--         <div>
          <input
            :style="{ visibility: unitHasValue(parseUnit(grid.col.auto)) ? 'visible' : 'hidden' }"
            :value="parseValue(grid.col.auto)"
            :type="parseUnit(grid.col.auto) === 'minmax' ? 'text' : 'number'"
            :aria-label="`grid-auto-columns size`"
            min="0"
            step="0.5"
            @input="onAutoSizeValueInput('col', $event.target.value)"
          />
          <UnitSelect
            :value="parseUnit(grid.col.auto)"
            type="auto"
            :aria-label="`grid-auto-columns unit`"
            @input="grid.col.auto = withChangedUnit(grid.col.auto, $event.target.value)"
          />
        </div> -->
      </div>
      <div class="area-size">
        <OptionsButton class="add-button" @click="addCol(grid, '1fr')">add +</OptionsButton>
      </div>
    </div>
    <div class="items rows">
      <div class="items-header">
        <h2>grid-template-rows</h2>
      </div>
      <div class="area-size" v-for="row in rowsNumber" :key="row">
        <label>{{row}}:</label>

        <div
          :data-row="row"
          @mouseover="currentHover = { on: 'track', grid, type: 'row', track: row }"
          @mouseleave="currentHover = null"
          class="input-container"
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
<!--         <div>
          <input
            :style="{ visibility: unitHasValue(parseUnit(grid.row.auto)) ? 'visible' : 'hidden' }"
            :value="parseValue(grid.row.auto)"
            :type="parseUnit(grid.row.auto) === 'minmax' ? 'text' : 'number'"
            :aria-label="`grid-auto-rows size`"
            min="0"
            step="0.5"
            @input="onAutoSizeValueInput('row', $event.target.value)"
          />
          <UnitSelect
            :value="parseUnit(grid.row.auto)"
            type="auto"
            :aria-label="`grid-auto-rows unit`"
            @input="grid.row.auto = withChangedUnit(grid.row.auto, $event.target.value)"
          />
        </div> -->
      </div>
      <div class="area-size">
        <OptionsButton class="add-button" @click="addRow(grid, '1fr')">add +</OptionsButton>
      </div>

    </div>
  </div>
</template>

<script setup="props">
export { default as IconRemove } from '../icons/IconRemove.vue'
export { default as IconAdd } from '../icons/IconAdd.vue'
export { default as UnitSelect } from '../common/UnitSelect.vue'
export { default as OptionsButton } from '../basic/OptionsButton.vue'

import { computed } from 'vue'

export default {
  props: {
    area: { type: Object, required: true },
  },
}

export const grid = computed(() => props.area.grid)

export {
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
} from '../../store.js'

import { setRowValueUnit, setColValueUnit } from '../../store.js'
import { useGridDimensions } from '../../composables/area.js'
import { unitMeasureMap } from '../../utils.js'
export { currentFocus, currentHover } from '../../store.js'
import { debounce } from '../../composables'

export const { colsNumber, rowsNumber } = useGridDimensions(grid)

export function unitHasValue(unit) {
  return !(unit === 'initial' || unit === 'auto' || unit === 'min-content' || unit === 'max-content')
}

// TODO: compute new value using previous size

function defaultValueForUnit(unit) {
  return unitMeasureMap[unit] || 1
}

export function onRowUnitInput(unit, row) {
  setRowValueUnit(props.area.grid, row, { value: defaultValueForUnit(unit), unit })
}

export function onColUnitInput(unit, col) {
  setColValueUnit(props.area.grid, col, { value: defaultValueForUnit(unit), unit })
}

export const onSizeValueInput = debounce((type, track, value) => {
  if (type === 'row') {
    setRowValue(grid.value, track, value)
  } else {
    setColValue(grid.value, track, value)
  }
})
export const onAutoSizeValueInput = debounce((type, value) => {
  grid.value[type].auto = withChangedValue(grid.value[type].auto, value)
})

export function isFocused(type, track) {
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
  font-family: Consolas, Monaco, "Andale Mono", "Ubuntu Mono", monospace;
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
  &:last-of-type { margin-bottom: 0; } 
}

input::-webkit-outer-spin-button,
input::-webkit-inner-spin-button {
  -webkit-appearance: none;
  margin: 0;
}

/* Firefox */
input[type=number] {
  -moz-appearance: textfield;
}
.area-size {
  display: flex;
  align-items: center;
  padding: 5px 0 5px 10px;
  border-bottom: 1px solid rgba(68, 68, 68, 0.5);
  &:last-of-type { border: 0; }
  label {
    display: block;
    flex: 1;
    max-width: max-content;
    color: rgb(215, 186, 125);
    font-size: 13px;
    text-shadow: none;
    font-family: Consolas, Monaco, "Andale Mono", "Ubuntu Mono", monospace;
    direction: ltr;
    text-align: left;
    white-space: pre;
    word-spacing: normal;   
    opacity: 0.7; 
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
      height: 25px;
      text-align: right;
      flex: 1;
      font-size: 13px;
      text-shadow: none;
      font-family: Consolas, Monaco, "Andale Mono", "Ubuntu Mono", monospace;
      direction: ltr;
      padding: 0;
      &:hover {
        color: #eee;
      }
    }
    .unit-select {
      appearance: none;
      height: 25px;
      background: rgb(35, 36, 31);
      color: rgb(206, 145, 120);
      flex: 1;
      font-size: 13px;
      text-shadow: none;
      font-family: Consolas, Monaco, "Andale Mono", "Ubuntu Mono", monospace;
      direction: ltr;
      cursor: text;
      text-align: center;
      padding-left: 3px;
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
  font-family: Consolas, Monaco, "Andale Mono", "Ubuntu Mono", monospace;
  direction: ltr;
  text-align: left; 
  white-space: pre;
  word-spacing: normal;   
  color: rgb(215, 186, 125);
  color: rgb(156, 220, 254); 

  height: 25px;
  display: flex;
  align-items: center;
  &.remove-button {
    opacity: 0.7;
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
</style>
