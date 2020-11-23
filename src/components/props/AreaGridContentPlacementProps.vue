<template>
  <div class="grid-settings-container">
    <PlacementPicker v-model="grid.justifyContent" type="justify-content" />
    <PlacementPicker v-model="grid.alignContent" type="align-content" />
  </div>
</template>

<script setup="props">
export { default as PlacementPicker } from '../common/PlacementPicker.vue'

import { computed } from 'vue'

export default {
  props: {
    area: { type: Object, required: true },
  },
}

export const grid = computed(() => props.area.grid)
</script>

<style scoped lang="scss"></style>
