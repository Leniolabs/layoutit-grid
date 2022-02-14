<template>
  <div class="grid-settings-container">
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

<script setup lang="ts">
const { area } = defineProps<{ area }>()

let grid = $computed(() => area.grid)
</script>

<style scoped lang="postcss">
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
    background: var(--color-white);
    border: 0 none;
    border-radius: 2px;
    width: 100%;
    font-size: 12px;
  }
}
*/
</style>
