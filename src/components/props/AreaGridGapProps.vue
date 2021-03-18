<template>
  <div class="items flexed">
    <GapInput :grid="grid" type="row" />
    <GapInput :grid="grid" type="col" />
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

<style scoped lang="postcss">
.items.flexed {
  display: flex;
  padding-top: 8px;
  > * {
    flex: 1;
    margin-right: 8px;
  }
  > *:last-child {
    margin-right: 0;
  }
}
</style>
