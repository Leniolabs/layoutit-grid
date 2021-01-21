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



</style>
