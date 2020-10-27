<template>
  <div class="items sizes">
    <h2><span>⊞</span> Area Size</h2>
    <AreaSize :area="area" type="width" />
    <AreaSize :area="area" type="height" />
  </div>
  <template v-if="area.parent && area.parent.display === 'grid'">
    <PlacementSelect v-model="area.justifySelf" type="justify-self" />
    <PlacementSelect v-model="area.alignSelf" type="align-self" />
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

import { computed } from 'vue'

export default {
  name: 'AreaProps',
  props: {
    area: { type: Object, required: true },
  },
}

export const currentGrid = computed(() => props.area.grid)
export const currentFlex = computed(() => props.area.flex)
</script>

<style scoped lang="scss"></style>
