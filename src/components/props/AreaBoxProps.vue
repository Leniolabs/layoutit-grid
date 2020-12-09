<template>
  <div class="layout-props">
    <div class="area-flex">
      <AreaSize :area="area" type="width" />
      <AreaSize :area="area" type="height" />
    </div>
    <div class="area-flex">
      <div class="area-size">
        <label>margin</label>
        <div class="input-container">
          <input :value="area.margin" aria-label="margin" @input="setMargin($event.target.value)" />
          <select id="" class="unit-select" name="">
            <option>px</option>
          </select>
        </div>
      </div>
      <div class="area-size">
        <label>padding</label>
        <div class="input-container">
          <input :value="area.padding" aria-label="padding" @input="setPadding($event.target.value)" />
          <select id="" class="unit-select" name="">
            <option>px</option>
          </select>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import AreaSize from '../common/AreaSize.vue'
import { defineProps, computed } from 'vue'
import { inputSetter } from '../../composables'
import { isValidMargin, isValidPadding } from '../../store.js'

const props = defineProps({
  area: { type: Object, required: true },
})
const setMargin = inputSetter((value) => {
  props.area.margin = value
}, isValidMargin)

const setPadding = inputSetter((value) => {
  props.area.padding = value
}, isValidPadding)
</script>

<style scoped lang="scss">
.layout-props {
  padding-top: 5px;
}
.margin-input,
.padding-input {
  .input-grid {
    display: grid;
    grid-template-columns: 120px auto;
    grid-template-rows: 30px;
    gap: 0px 8px;
    height: 25px;
    input,
    select {
      height: 25px;
      border: 0;
      border-radius: 2px;
      text-align: center;
    }
  }
  label {
    display: block;
  }
  input {
    width: 100%;
  }
}

.area-flex {
  background: rgb(35, 36, 31);
  border-radius: 2px;
  border-bottom: 1px solid rgba(68, 68, 68, 0.5);
  + .area-flex {
    border: 0;
  }
  > .area-size {
    border-bottom: 1px solid rgba(68, 68, 68, 0.5);
    + .area-size {
      border: 0;
    }
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
  padding: 5px 0 5px 10px;
  label {
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
  }
  .input-container {
    display: grid;
    grid-template-columns: 1fr 1fr;
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
      font-family: Consolas, Monaco, 'Andale Mono', 'Ubuntu Mono', monospace;
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
      font-family: Consolas, Monaco, 'Andale Mono', 'Ubuntu Mono', monospace;
      direction: ltr;
      cursor: text;
      text-align: center;
      border: 0;
      padding-left: 3px;
      &:hover {
        color: #eee;
      }
    }
  }
}
</style>
