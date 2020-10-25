<template>
  <div class="area-props">
    <button v-if="area.grid" @click="addImplicitArea">Add Implicit Area</button>
    <button v-if="area.grid" @click="addItems">Add Some Items</button>

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
    <div class="items sizes">
      <h2><span>⊞</span> Area Size</h2>
      <AreaSize :area="area" type="width" />
      <AreaSize :area="area" type="height" />
    </div>
    <template v-if="area.parent && area.parent.grid">
      <PlacementSelect v-model="area.justifySelf" type="justify-self" />
      <PlacementSelect v-model="area.alignSelf" type="align-self" />
    </template>
    <FlexOptions v-if="area.flex" :flex="area.flex" />
    <GridOptions v-if="area.grid" :area="area" />
  </div>
</template>

<script setup="props">
export { default as FlexOptions } from './FlexOptions.vue'
export { default as GridOptions } from './GridOptions.vue'
export { default as AreaSize } from '../common/AreaSize.vue'
export { default as PlacementSelect } from '../common/PlacementSelect.vue'

import { ref, computed } from 'vue'
import { createAreaState } from '../../store'
export { currentArea, currentView } from '../../store.js'
export { gridRegionToGridArea } from '../../utils.js'

export default {
  name: 'AreaProps',
  props: {
    area: { type: Object, required: true },
  },
}

export const currentGrid = computed(() => props.area.grid)
export const currentFlex = computed(() => props.area.flex)

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
      items: {
        type: 'photo',
        count: 10,
      },
    })
  )
}
</script>

<style scoped lang="scss">
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
