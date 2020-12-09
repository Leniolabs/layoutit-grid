<template>
  <div class="grid-settings-container">
    <div class="area-flex">
      <GapInput :grid="grid" type="row" />
      <GapInput :grid="grid" type="col" />
    </div>
  </div>
</template>

<script setup>
import GapInput from '../common/GapInput.vue'

import { defineProps, computed } from 'vue'

const props = defineProps({
  area: { type: Object, required: true },
})
const grid = computed(() => props.area.grid)
</script>

<style scoped lang="scss">
.area-flex {
  background: rgb(35, 36, 31);
  border-radius: 2px;
  .area-size {
    border-bottom: 1px solid rgba(68, 68, 68, 0.5);
    &:last-of-type {
      border: 0;
    }
  }
}
</style>
