<template>
  <div class="layout-props">
    <template v-if="area.parent && area.parent.display === 'grid'">
      <div class="area-size">
        <label>grid-area</label>
        <div class="input-container">
          <input
            :value="gridAreaValue"
            aria-label="margin"
            :disabled="isEditing"
            @input="setGridArea($event.target.value)"
          />
          <OptionsButton class="edit-button" :disabled="isEditing" @click="onEdit">edit</OptionsButton>
        </div>
      </div>
      <PlacementPicker v-model="area.justifySelf" type="justify-self" :initial="area.parent.grid.justifyItems" />
      <PlacementPicker v-model="area.alignSelf" type="align-self" :initial="area.parent.grid.alignItems" />
    </template>
  </div>
</template>

<script setup>
import { inputSetter } from '../../composables'
import { selection, isValidGridArea, getGridRegion, selectionGridArea } from '../../store.js'
import { createSection } from '../../utils.js'
import { defineProps, computed } from 'vue'
import { findImplicitGrid, explicitGridAreaToGridRegion } from '../../utils/grid.js'

const props = defineProps({
  area: { type: Object, required: true },
})
const setGridArea = inputSetter((value) => {
  props.area.gridArea = value
}, isValidGridArea)

const isEditing = computed(() => {
  return selection.value && selection.value.area === props.area
})
const gridAreaValue = computed(() => {
  if (isEditing.value) {
    return selectionGridArea(selection.value)
  } else {
    return props.area.gridArea
  }
})

const onEdit = () => {
  let gridRegion = getGridRegion(props.area)
  const explicitAreas = findImplicitGrid(parent)
  if (!gridRegion) {
    const parent = props.area.parent
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
      implicitGrid: explicitAreas.implicitGrid,
    }
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
  /*padding-right: 10px;*/
}
label {
  display: block;
  flex: 1 1 0%;
  max-width: max-content;
  color: var(--color-blue-lightest);
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
  background: var(--color-white);
  color: var(--color-gray-dark);
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
