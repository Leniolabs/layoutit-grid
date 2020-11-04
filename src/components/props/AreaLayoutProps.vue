<template>
  <div class="layout-props">
    <FlexOptions v-if="area.display === 'flex'" :area="area" />
    <GridOptions v-if="area.display === 'grid'" :area="area" />
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

<script setup="props">
export { default as FlexOptions } from './FlexOptions.vue'
export { default as GridOptions } from './GridOptions.vue'
export { default as AreaSize } from '../common/AreaSize.vue'
export { default as PlacementPicker } from '../common/PlacementPicker.vue'
import { debounce } from 'lodash-es'
import { computed } from 'vue'

export default {
  name: 'AreaProps',
  props: {
    area: { type: Object, required: true },
  },
}

export const currentGrid = computed(() => props.area.grid)
export const currentFlex = computed(() => props.area.flex)

export const setGridArea = debounce((val) => {
  props.area.gridArea = val
}, 500)
</script>

<style scoped lang="scss">
.layout-props {
  display: flex;
  flex-direction: column;
  gap: 10px;
}
.margin-input,
.padding-input {
  display: grid;
  grid-template-columns: 65px 1fr;
  input {
    width: 100%;
  }
}
</style>
