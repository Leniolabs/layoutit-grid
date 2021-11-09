<template>
  <div class="grid-settings-container">
    <PlacementPicker v-model="grid.justifyContent" type="justify-content" />
    <PlacementPicker v-model="grid.alignContent" type="align-content" />
  </div>
</template>

<script setup lang="ts">
const { area } = defineProps<{ area }>()

let grid = $computed(() => props.area.grid)
</script>

<style scoped lang="postcss"></style>
