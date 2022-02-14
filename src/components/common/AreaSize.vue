<template>
  <div>
    <div class="items-header">
      <label>{{ type }}</label>
    </div>
    <div class="area-size">
      <div class="input-container">
        <input
          v-if="size.unit !== 'auto'"
          :value="size.value"
          aria-label="size value"
          type="number"
          min="0"
          @input="onSizeInput($event)"
        />
        <UnitSelect type="size" :value="size.unit" aria-label="size unit" @input="setSizeUnit($event)" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
//@ts-ignore
import { parseValueUnit } from '../../store.js'
//@ts-ignore
import { unitMeasureMap } from '../../utils.js'
//@ts-ignore
import { inputSetter } from '../../composables'
import type { AreaType, AreaState, ValueUnit, GridUnit } from '../../types'

const { area, type } = defineProps<{
  area: AreaState
  type: AreaType
}>()

let size = $computed({
  get: (): ValueUnit => {
    return parseValueUnit(area[type])
  },
  set: (s: ValueUnit) => {
    area[type] = s.value + s.unit
  },
})

function setSizeValue({ target }: Event) {
  const value = (target as HTMLInputElement).value
  size = { ...size, value }
}

function setSizeUnit({ target }: Event) {
  const unit = (target as HTMLInputElement).value as GridUnit
  // TODO: Adjust value to avoid jump
  size = { value: unitMeasureMap[unit], unit }
}

const onSizeInput = inputSetter(setSizeValue)
</script>

<style scoped lang="postcss">
label {
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
  margin-bottom: 15px;
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
      padding-left: 5px;
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
