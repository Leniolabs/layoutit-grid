<template>
  <div class="grid-settings-container">
    <div class="items columns">
      <div class="items-header">
        <h2><span style="transform: rotate(90deg); display: inline-block">≑</span> Grid Columns</h2>
        <OptionsButton class="add-button" @click="addCol(grid, '1fr')">
          <IconAdd />
        </OptionsButton>
      </div>
      <div class="inner-items">
        <div v-for="column in colsNumber" :key="column" :data-col="column">
          <input
            v-if="unitHasValue(getColUnit(grid, column - 1))"
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
            :focused="isFocused('col', column)"
            :aria-label="`column ${column} unit`"
            @input="onColUnitInput($event.target.value, column - 1)"
          />
          <OptionsButton
            class="remove-button"
            :aria-label="`remove column ${column}`"
            :disabled="grid.col.sizes.length === 1"
            @click="removeCol(grid, column - 1)"
          >
            <IconRemove />
          </OptionsButton>
        </div>
      </div>
    </div>
    <div class="items rows">
      <div class="items-header">
        <h2><span>≑</span> Grid Rows</h2>
        <OptionsButton class="add-button" @click="addRow(grid, '1fr')">
          <IconAdd />
        </OptionsButton>
      </div>
      <div class="inner-items">
        <div v-for="row in rowsNumber" :key="row" :data-row="row">
          <input
            v-if="unitHasValue(getRowUnit(grid, row - 1))"
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
            :focused="isFocused('row', row)"
            :aria-label="`row ${row} unit`"
            @input="onRowUnitInput($event.target.value, row - 1)"
          />
          <OptionsButton
            class="remove-button"
            :aria-label="`remove row ${row}`"
            :disabled="grid.row.sizes.length === 1"
            @click="removeRow(grid, row - 1)"
          >
            <IconRemove />
          </OptionsButton>
        </div>
      </div>
    </div>
    <div class="items gaps">
      <h2><span>⊞</span> Grid Gap</h2>
      <GapInput :grid="grid" type="row" />
      <GapInput :grid="grid" type="col" />
    </div>
  </div>
</template>

<script setup="props">
export { default as IconRemove } from '../icons/IconRemove.vue'
export { default as IconAdd } from '../icons/IconAdd.vue'
export { default as UnitSelect } from '../common/UnitSelect.vue'
export { default as GapInput } from '../common/GapInput.vue'
export { default as OptionsButton } from '../basic/OptionsButton.vue'

export default {
  props: {
    grid: { type: Object, required: true },
  },
}

import { toRefs } from 'vue'

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
  dragging,
} from '../../store.js'

import { setRowValueUnit, setColValueUnit, currentFocus } from '../../store.js'
import { useGridDimensions } from '../../composables/area.js'
export { currentFocus }

const { grid } = toRefs(props)

export const { colsNumber, rowsNumber } = useGridDimensions(grid)

export function unitHasValue(unit) {
  return !(unit === 'auto' || unit === 'min-content' || unit === 'max-content')
}

// TODO: compute new value using previous size

function defaultValueForUnit(unit) {
  const unitMeasure = {
    'px': 300,
    'fr': 1,
    'em': 4,
    '%': 10,
    'minmax': '20px, 60px',
    'auto': ''
    'min-content': '',
    'max-content': '',
  }
  return unitMeasure[unit] || 1
}

export function onRowUnitInput(unit, row) {
  setRowValueUnit(props.grid, row, { value: defaultValueForUnit(unit), unit })
}

export function onColUnitInput(unit, col) {
  setColValueUnit(props.grid, col, { value: defaultValueForUnit(unit), unit })
}

export function isFocused(type, track) {
  const tf = currentFocus.value
  return tf && tf.on === 'track' && tf.grid === grid.value && tf.type === type && tf.track === track
}
</script>

<style scoped lang="scss">
h2 {
  margin: 0 0 10px;
  font-family: 'Alegreya Sans', 'Helvetica Neue', Arial, sans-serif;
  margin-top: 10px;
  margin-bottom: 0.625em;
  font-size: 18.72px;
  span {
    font-weight: normal;
  }
}

.items {
  margin-bottom: 20px;
  .items-header {
    display: grid;
    grid-template-columns: auto 30px;
    align-items: center;
  }
  .inner-items {
    max-height: 195px;
    overflow: auto;
    font-family: arial;
    > div {
      display: grid;
      grid-template-columns: 70px auto 30px;
      grid-gap: 0 5px;
      border-radius: 2px;
      height: 30px;
      margin-bottom: 6px;
      input {
        text-align: center;
        width: 100%;
        border: 0;
        border-radius: 2px;
        padding: 0.313em;
        font-size: 14px;
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
    padding: 1.2px;
    width: 100%;
    height: 100%;
    fill: #fff;
  }
}

.remove-button {
  background: var(--color-remove);
  &:hover {
    background: var(--color-remove-active);
  }
}

.add-button {
  background: var(--color-add);
  &:hover {
    background: var(--color-add-active);
  }
}
</style>
