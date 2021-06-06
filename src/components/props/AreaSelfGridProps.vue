<template>
  <div class="layout-props">
    <template v-if="area.parent && area.parent.display === 'grid'">
      <div class="area-size">
        <label>grid-area</label>
        <div class="input-container">
          <input :value="area.gridArea" aria-label="margin" @input="setGridArea($event.target.value)" />
          <OptionsButton class="edit-button" @click="onEdit">edit</OptionsButton>
        </div>
      </div>
      <PlacementPicker v-model="area.justifySelf" type="justify-self" :initial="area.parent.grid.justifyItems" />
      <PlacementPicker v-model="area.alignSelf" type="align-self" :initial="area.parent.grid.alignItems" />
    </template>
  </div>
</template>

<script setup>
import PlacementPicker from '../common/PlacementPicker.vue'
import OptionsButton from '../basic/OptionsButton.vue'
import { inputSetter } from '../../composables'
import { selection, isValidGridArea, getGridRegion } from '../../store.js'
import { createSection } from '../../utils.js'
import { defineProps } from 'vue'
import { findImplicitGrid, explicitGridAreaToGridRegion } from '../../utils/grid.js'

const props = defineProps({
  area: { type: Object, required: true },
})
const setGridArea = inputSetter((value) => {
  props.area.gridArea = value
}, isValidGridArea)

const onEdit = () => {
  let gridRegion = getGridRegion(props.area)
  if (!gridRegion) {
    const parent = props.area.parent
    const explicitAreas = findImplicitGrid(parent)
    gridRegion = explicitGridAreaToGridRegion(explicitAreas.gridAreas[parent.children.indexOf(props.area)])
  }
  if (gridRegion) {
    selection.value = {
      start: createSection({ col: gridRegion.col.start, row: gridRegion.row.start }),
      end: createSection({ col: gridRegion.col.end - 1, row: gridRegion.row.end - 1 }),
      color: props.area.color,
      fresh: false,
      area: props.area,
      name: props.area.name,
      parent: props.area.parent,
    }
    console.log(selection.value)
  }
}
</script>

<style scoped lang="postcss">
.area-size {
  margin-bottom: 6px;
  padding-right: 40px;
}
.layout-props {
  padding-top: 8px;
  //padding-right: 10px;
}
label {
  display: block;
  flex: 1 1 0%;
  max-width: max-content;
  color: #9cdcfe;
  font-size: 13px;
  text-shadow: none;
  font-family: Consolas, Monaco, 'Andale Mono', 'Ubuntu Mono', monospace;
  direction: ltr;
  text-align: left;
  white-space: pre;
  word-spacing: normal;
  margin-bottom: 5px;
}

.input-container {
  display: flex;
}
.input-container input {
  height: 30px;
  background: #fafafa;
  color: #333;
  font-size: 14px;
  text-shadow: none;
  direction: ltr;
  flex: 1;
  padding-left: 10px;
  margin-right: 5px;
  border: 0;
  width: 200px;
  border-radius: 2px;
}
</style>
