<template>
  <div class="grid-settings-container">
    <div class="items columns">
      <div class="items-header">
        <h2><span style="transform: rotate(90deg); display: inline-block">≑</span> Grid Columns</h2>
        <OptionsButton class="add-button" @click="addCol(grid, '1fr')"> Add </OptionsButton>
      </div>
      <div class="inner-items">
        <div
          v-for="column in colsNumber"
          :key="column"
          :data-col="column"
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
            @input="setColValue(grid, column - 1, $event.target.value)"
          />
          <UnitSelect
            :value="getColUnit(grid, column - 1)"
            type="grid"
            :focused="
              isFocused('col', column) || (dragging && (dragging.colLine === column || dragging.colLine === column + 1))
            "
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
        <div>
          <input
            :style="{ visibility: unitHasValue(parseUnit(grid.col.auto)) ? 'visible' : 'hidden' }"
            :value="parseValue(grid.col.auto)"
            :type="parseUnit(grid.col.auto) === 'minmax' ? 'text' : 'number'"
            :aria-label="`grid-auto-columns size`"
            min="0"
            step="0.5"
            @input="grid.col.auto = withChangedValue(grid.col.auto, $event.target.value)"
          />
          <UnitSelect
            :value="parseUnit(grid.col.auto)"
            type="auto"
            :aria-label="`grid-auto-columns unit`"
            @input="grid.col.auto = withChangedUnit(grid.col.auto, $event.target.value)"
          />
        </div>
      </div>
    </div>
    <div class="items rows">
      <div class="items-header">
        <h2><span>≑</span> Grid Rows</h2>
        <OptionsButton class="add-button" @click="addRow(grid, '1fr')"> Add </OptionsButton>
      </div>
      <div class="inner-items">
        <div
          v-for="row in rowsNumber"
          :key="row"
          :data-row="row"
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
            @input="setRowValue(grid, row - 1, $event.target.value)"
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
        <div>
          <input
            :style="{ visibility: unitHasValue(parseUnit(grid.row.auto)) ? 'visible' : 'hidden' }"
            :value="parseValue(grid.row.auto)"
            :type="parseUnit(grid.row.auto) === 'minmax' ? 'text' : 'number'"
            :aria-label="`grid-auto-rows size`"
            min="0"
            step="0.5"
            @input="grid.row.auto = withChangedValue(grid.row.auto, $event.target.value)"
          />
          <UnitSelect
            :value="parseUnit(grid.row.auto)"
            type="auto"
            :aria-label="`grid-auto-rows unit`"
            @input="grid.row.auto = withChangedUnit(grid.row.auto, $event.target.value)"
          />
        </div>
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

export function isFocused(type, track) {
  const tf = currentFocus.value
  return tf && tf.on === 'track' && tf.grid === grid.value && tf.type === type && tf.track === track
}
</script>

<style scoped lang="scss">
h2 {
  font-family: 'Alegreya Sans', 'Helvetica Neue', Arial, sans-serif;
  margin: 0;
  font-size: 15px;
  padding: 0;
  line-height: 30px;
  display: flex;
  align-items: center;
  span {
    font-weight: normal;
    margin-right: 6px;
    height: 30px;
  }
}

.items {
  margin-bottom: 10px;
  margin-top: 0px;
  .items-header {
    display: grid;
    grid-template-columns: auto 55px;
    align-items: center;
    padding: 0 0 0.5rem;
  }
  .inner-items {
    overflow: auto;
    font-family: arial;
    > div {
      display: grid;
      grid-template-columns: 70px auto 30px;
      grid-gap: 0 8px;
      border-radius: 2px;
      height: 25px;
      margin-bottom: 2px;
      input {
        text-align: center;
        width: 100%;
        border: 0;
        border-radius: 2px;
        padding: 0.113em;
        font-size: 12px;
        height: 24px;
        background: #fff;
        color: #333;
        &.dragging {
          background: #e4f5e4;
        }
        &.active {
          background: #e4f5e4;
        }
      }
    }
  }
}

.remove-button,
.add-button {
  width: 100%;
  padding: 8px 0;
  margin-bottom: 0;
  svg {
    padding: 0;
    width: 100%;
    height: 100%;
    fill: #fff;
  }
}

.remove-button {
  background: var(--color-remove);
  //background:transparent;
  border-radius: 4px;
  opacity: 0.5;
  padding: 5px 0;
  height: 24px;
  width: 24px;
  //max-width:18px;
  &:hover {
    background: var(--color-remove-active);
    //background:transparent;
    opacity: 1;
  }
}

.add-button {
  height: 24px;
  padding: 0;
  background: var(--color-add);
  &:hover {
    background: var(--color-add-active);
  }
}
</style>
