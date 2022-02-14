<template>
  <div class="items flexed">
    <GapInput :grid="grid" type="row" />
    <GapInput :grid="grid" type="col" />
  </div>
</template>

<script setup lang="ts">
const { area } = defineProps<{ area }>()

let grid = $computed(() => area.grid)
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
