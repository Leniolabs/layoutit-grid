<template>
  <div class="grid-settings-container">
    <GridAutoFlowSelect v-model="grid.autoFlow" />
    <!--
    <div class="auto-flow-container">
      <span>grid-auto-flow</span>
      <select v-model="grid.autoFlow" class="auto-flow">
        <option value="row">row</option>
        <option value="column">column</option>
        <option value="row dense">row dense</option>
        <option value="column dense">column dense</option>
      </select>
    </div>
    -->
    <PlacementPicker v-model="grid.justifyItems" type="justify-items" />
    <PlacementPicker v-model="grid.alignItems" type="align-items" />
  </div>
</template>

<script setup="props">
export { default as PlacementPicker } from '../common/PlacementPicker.vue'
export { default as GridAutoFlowSelect } from '../common/GridAutoFlowSelect.vue'

import { computed } from 'vue'

export default {
  props: {
    area: { type: Object, required: true },
  },
}

export const grid = computed(() => props.area.grid)
</script>

<style scoped lang="scss">
/*
.auto-flow-container {
  display: grid;
  grid-template-columns: 0.75fr 1fr;
  margin-bottom: 5px;
  span {
    align-self: center;
    font-size: 12px;
    width: 100%;
  }
  select {
    background: #fff;
    border: 0 none;
    border-radius: 2px;
    width: 100%;
    font-size: 12px;
  }
}
*/
</style>
