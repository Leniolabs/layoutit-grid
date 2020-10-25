<template>
  <div class="area-props">
    <div class="area-type">{{ area.type === 'div' ? area.display : area.type }} props</div>
    <AreaTypeSelect v-if="area.parent" v-model="area.type" />
    <template v-if="area.type === 'div'">
      <DisplaySelect :model-value="area.display" @update:modelValue="onUpdateDisplay" />
      <button @click="addImplicitArea">Add Implicit Area</button>
      <!--button @click="addItems">Add Some Items</button-->
      <div v-if="area.items">
        <span>Items</span>
        <input
          :value="area.items.count"
          type="number"
          aria-label="items count"
          min="1"
          step="1"
          @input=";(area.items.count = +$event.target.value), (area.name = area.items.count + ' photos')"
        />
      </div>
    </template>

    <div class="items sizes">
      <h2><span>⊞</span> Area Size</h2>
      <AreaSize :area="area" type="width" />
      <AreaSize :area="area" type="height" />
    </div>
    <template v-if="area.parent && area.parent.display === 'grid'">
      <PlacementSelect v-model="area.justifySelf" type="justify-self" />
      <PlacementSelect v-model="area.alignSelf" type="align-self" />
    </template>
    <FlexOptions v-if="area.display === 'flex'" :area="area" />
    <GridOptions v-if="area.display === 'grid'" :area="area" />
  </div>
</template>

<script setup="props">
export { default as FlexOptions } from './FlexOptions.vue'
export { default as GridOptions } from './GridOptions.vue'
export { default as AreaSize } from '../common/AreaSize.vue'
export { default as PlacementSelect } from '../common/PlacementSelect.vue'
export { default as AreaTypeSelect } from '../common/AreaTypeSelect.vue'
export { default as DisplaySelect } from '../common/DisplaySelect.vue'

import { ref, computed, watch, toRefs } from 'vue'
import { createAreaState } from '../../store'
export { currentArea, currentView, createFlexState } from '../../store.js'
export { gridRegionToGridArea } from '../../utils.js'

export default {
  name: 'AreaProps',
  props: {
    area: { type: Object, required: true },
  },
}

export const currentGrid = computed(() => props.area.grid)
export const currentFlex = computed(() => props.area.flex)

export function onUpdateDisplay(value) {
  props.area.display = value
  if (props.area.display === 'flex') {
    if (!props.area.flex) {
      props.area.flex = createFlexState()
    }
  }
}

const counter = ref(1)
export function addImplicitArea() {
  props.area.children.push(
    createAreaState({
      name: 'a' + counter.value++,
      parent: props.area,
    })
  )
}

export function addItems() {
  props.area.children.push(
    createAreaState({
      name: '10 photos',
      parent: props.area,
      type: 'image',
      items: {
        count: 10,
      },
    })
  )
}
</script>

<style scoped lang="scss">
.area-type {
  font-size: 14px;
  font-weight: 700;
  color: black;
  margin-bottom: 10px;
  text-align: center;
  padding: 5px;
  border-radius: 4px;
  background: #ddd;
  border-bottom: 1px solid black;
}

.area-props {
  overflow: scroll;
}

* {
  scrollbar-width: thin;
  scrollbar-color: #491988 #300748;
}
::-webkit-scrollbar {
  width: 5px;
}
::-webkit-scrollbar:horizontal {
  height: 5px;
}
::-webkit-scrollbar-track {
  background: #300748;
  border-radius: 10px;
}
::-webkit-scrollbar-thumb {
  background: #491988;
  border-radius: 10px;
}
::-webkit-scrollbar-thumb:hover {
  background: #5c26a2;
}

.items {
  font-size: 11px;
  margin-bottom: 10px;
}
</style>
