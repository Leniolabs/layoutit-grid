<template>
  <div class="layout-props">
    <template v-if="area.parent && area.parent.display === 'grid'">
      <PlacementPicker v-model="area.justifySelf" type="justify-self" :initial="area.parent.grid.justifyItems" />
      <PlacementPicker v-model="area.alignSelf" type="align-self" :initial="area.parent.grid.alignItems" />
      <div>
        <label>grid-area</label>
        <input :value="area.gridArea" aria-label="margin" @input="setGridArea($event.target.value)" />
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
.layout-props {
  display: flex;
  flex-direction: column;
  gap: 10px;
  padding-top: 10px;
  label {
    display: block;
    margin-bottom: 3px;
  }
}
</style>
