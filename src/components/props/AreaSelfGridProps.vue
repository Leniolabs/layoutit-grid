<template>
  <div class="layout-props">
    <template v-if="area.parent && area.parent.display === 'grid'">
      <PlacementPicker v-model="area.justifySelf" type="justify-self" :initial="area.parent.grid.justifyItems" />
      <PlacementPicker v-model="area.alignSelf" type="align-self" :initial="area.parent.grid.alignItems" />
      <div class="area-size">
        <label>grid-area</label>
        <div class="input-container">
          <input :value="area.gridArea" aria-label="margin" @input="setGridArea($event.target.value)" />
        </div>
      </div>
    </template>
  </div>
</template>

<script setup>
import PlacementPicker from '../common/PlacementPicker.vue'
import { inputSetter } from '../../composables'
import { isValidGridArea } from '../../store.js'
import { defineProps } from 'vue'

const props = defineProps({
  area: { type: Object, required: true },
})
const setGridArea = inputSetter((value) => {
  props.area.gridArea = value
}, isValidGridArea)
</script>

<style scoped lang="scss">

.area-size {
  background: rgb(35, 36, 31);
  padding: 10px 0px 10px 10px;
  display: flex;
  align-items: center;
  label {
    display: block;
    flex: 1 1 0%;
    max-width: max-content;
    color: rgb(156, 220, 254);
    font-size: 13px;
    text-shadow: none;
    font-family: Consolas, Monaco, "Andale Mono", "Ubuntu Mono", monospace;
    direction: ltr;
    text-align: left;
    white-space: pre;
    word-spacing: normal;
  }
  input {
    border: 0px;
    width: 100%;
    background: rgb(35, 36, 31);
    color: rgb(206, 145, 120);
    height: 25px;
    text-align: right;
    flex: 1 1 0%;
    font-size: 13px;
    text-shadow: none;
    font-family: Consolas, Monaco, "Andale Mono", "Ubuntu Mono", monospace;
    direction: ltr;
    padding: 0px;
    padding-right: 15px;
    &:focus,
    &:hover {
      color: #fff;
    }    
  }
}

</style>
