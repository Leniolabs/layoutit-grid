<template>
  <div class="layout-">
    <AreaSize :area="area" type="width" />
    <AreaSize :area="area" type="height" />

    <div v-if="false">
      <div class="items-header">
        <label>margin</label>
      </div>
      <div class="area-size">
        <div class="input-container">
          <input :value="area.margin" aria-label="margin" @input="setMargin($event.target.value)" />
          <select name="" class="unit-select"></select>
        </div>
      </div>
    </div>
    <div v-if="false">
      <div class="items-header">
        <label>padding</label>
      </div>
      <div class="area-size">
        <div class="input-container">
          <input :value="area.padding" aria-label="padding" @input="setPadding($event.target.value)" />
          <select name="" class="unit-select"></select>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { inputSetter } from '../../composables'
import { isValidMargin, isValidPadding } from '../../store.js'

const { area } = defineProps<{ area }>()

const setMargin = inputSetter((value) => {
  area.margin = value
}, isValidMargin)

const setPadding = inputSetter((value) => {
  area.padding = value
}, isValidPadding)
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
      border-top-left-radius: 0;
      border-bottom-left-radius: 0;
      padding-left: 5px;
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
.layout- {
  padding-top: 8px;
  display: flex;
  > * {
    flex: 1;
    margin-right: 8px;
  }
  > *:last-child {
    margin-right: 0;
  }
}
</style>
