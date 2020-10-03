<template>
  <span :style="{ 'border-color': area.color }" class="area-name" title="Area Name" @click="$emit('edit')">{{
    area.name
  }}</span>
</template>

<script setup>
export default {
  props: {
    area: { type: Object, required: true },
  },
  emits: ['edit'],
}
</script>

<style scoped lang="scss">
.area-name {
  position: relative;
  background: #ddd;
  padding: 5px 10px;
  border-left: 2px solid green;
  border-radius: 2px 0 0 2px;
  font-size: 16px;
  float: left;
  font-family: 'Alegreya Sans', 'Helvetica Neue', Arial, sans-serif;
  margin-right: 5px;
  pointer-events: all;
}

.area-name:hover {
  cursor: text;
}
</style>
