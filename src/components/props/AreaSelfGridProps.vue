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

<script setup="props">
import PlacementPicker from '../common/PlacementPicker.vue'
import { debounce } from 'lodash-es'
import { computed } from 'vue'

export default {
  props: {
    area: { type: Object, required: true },
  },
}

const setGridArea = debounce((val) => {
  props.area.gridArea = val
}, 500)
</script>

<style scoped lang="scss">
.layout-props {
  display: flex;
  flex-direction: column;
  gap: 10px;
}
</style>
