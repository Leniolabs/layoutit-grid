<template>
  <span :style="{ 'border-color': area.color }" class="area-name" title="Area Name" @click="$emit('edit')">
    {{ area.name }}
  </span>
</template>

<script setup lang="ts">
defineProps<{ area }>()
defineEmits(['edit'])
</script>

<style scoped lang="postcss">
.area-name {
  position: relative;
  background: var(--color-gray-light);
  padding: 5px 10px;
  border-left: 2px solid green;
  border-radius: 2px 0 0 2px;
  font-size: 16px;
  float: left;
  font-family: 'Alegreya Sans', 'Helvetica Neue', Arial, sans-serif;
  margin-right: 4px;
  pointer-events: all;
}

.area-name:hover {
  cursor: text;
}
</style>
