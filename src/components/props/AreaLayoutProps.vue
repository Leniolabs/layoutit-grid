<template>
  <div class="items sizes">
    <h2><span>⊞</span> Area Size</h2>
    <AreaSize :area="area" type="width" />
    <AreaSize :area="area" type="height" />
  </div>
  <div>
    <label>margin</label>
    <input :value="area.margin" aria-label="margin" @input="area.margin = $event.target.value" />
  </div>
  <div>
    <label>padding</label>
    <input :value="area.padding" aria-label="padding" @input="area.padding = $event.target.value" />
  </div>
  <template v-if="area.parent && area.parent.display === 'grid'">
    <PlacementSelect v-model="area.justifySelf" type="justify-self" />
    <PlacementSelect v-model="area.alignSelf" type="align-self" />
    <div>
      <label>grid-area</label>
      <input :value="area.gridArea" aria-label="margin" @input="setGridArea($event.target.value)" />
    </div>
  </template>
  <template v-if="area.parent && area.parent.display === 'flex'">
    <div class="inner-items">
      <div>
        Flex Grow
        <input
          :value="area.flexGrow"
          type="number"
          aria-label="flex grow"
          @input="area.flexGrow = +$event.target.value"
        />
      </div>
      <br />
      <div>
        Flex Shrink
        <input
          :value="area.flexShrink"
          type="number"
          aria-label="flex shrink"
          @input="area.flexShrink = +$event.target.value"
        />
      </div>
      <br />
      <div>
        Flex Basis
        <input
          :value="area.flexBasis"
          type="text"
          aria-label="flex basis"
          @input="area.flexBasis = $event.target.value"
        />
      </div>
    </div>
  </template>
  <FlexOptions v-if="area.display === 'flex'" :area="area" />
  <GridOptions v-if="area.display === 'grid'" :area="area" />
</template>

<script setup="props">
export { default as FlexOptions } from './FlexOptions.vue'
export { default as GridOptions } from './GridOptions.vue'
export { default as AreaSize } from '../common/AreaSize.vue'
export { default as PlacementSelect } from '../common/PlacementSelect.vue'
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

<style scoped lang="scss"></style>
