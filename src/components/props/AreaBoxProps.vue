<template>
  <div class="layout-props">
    <div class="area-size">
      <AreaSize :area="area" type="width" />
      <AreaSize :area="area" type="height" />
    </div>
    <div class="margin-input">
      <label>margin</label>
      <div class="input-grid">
        <input :value="area.margin" aria-label="margin" @input="setMargin($event.target.value)" />
        <select id="" name="">
          px
        </select>
      </div>
    </div>
    <div class="padding-input">
      <label>padding</label>
      <div class="input-grid">
        <input :value="area.padding" aria-label="padding" @input="setPadding($event.target.value)" />
        <select id="" name="">
          px
        </select>
      </div>
    </div>
  </div>
</template>

<script setup="props">
export { default as AreaSize } from '../common/AreaSize.vue'
import { computed } from 'vue'
import { inputSetter } from '../../composables'
import { isValidMargin, isValidPadding } from '../../store.js'

export default {
  props: {
    area: { type: Object, required: true },
  },
}

export const setMargin = inputSetter((value) => {
  props.area.margin = value
}, isValidMargin)

export const setPadding = inputSetter((value) => {
  props.area.padding = value
}, isValidPadding)
</script>

<style scoped lang="scss">
.layout-props {
  display: flex;
  flex-direction: column;
  gap: 10px;
  padding-top: 10px;
}
.margin-input,
.padding-input {
  .input-grid {
    display: grid;
    grid-template-columns: 120px auto;
    grid-template-rows: 30px;
    gap: 0px 8px;
  }
  label {
    display: block;
    margin-bottom: 3px;
  }
  input {
    width: 100%;
  }
}
</style>
