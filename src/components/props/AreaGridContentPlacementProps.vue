<template>
  <div class="grid-settings-container">
    <PlacementPicker v-model="grid.justifyContent" type="justify-content" />
    <PlacementPicker v-model="grid.alignContent" type="align-content" />
  </div>
</template>

<script setup>
const props = defineProps({
  area: { type: Object, required: true },
})
let grid = $computed(() => props.area.grid)
</script>

<style scoped lang="postcss"></style>
