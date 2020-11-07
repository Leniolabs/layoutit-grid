<template>
  <div>
    <span>Your grid has been saved! </span>
    <a :href="fullPath" rel="noopener" target="_blank">{{ path }}</a>
    <button @click="$emit('close')">×</button>
  </div>
</template>

<script setup="props">
import { computed } from 'vue'

export default {
  props: {
    path: { type: String, required: true },
  },
  emits: ['close'],
}

ref: fullPath = computed(() => 'https://' + props.path)
</script>

<style scoped lang="scss">
div {
  position: fixed;
  top: 0px;
  background: #fdd835;
  left: 0;
  right: 0px;
  padding: 12px 20px 10px;
  color: #333;
  border-bottom: 1px solid #ccc;
  z-index: 30000;
  word-break: break-all;
  button {
    position: absolute;
    border: 0;
    background: none;
    right: 8px;
    font-size: 20px;
    top: 8px;
    color: #666;
    cursor: pointer;
    &:hover {
      color: #222;
    }
    &:after {
      content: '';
      background: rgba(0, 0, 0, 0.4);
      position: fixed;
      left: 0px;
      z-index: 100000;
      right: 0px;
      top: 40px;
      bottom: 0px;
    }
  }
}
</style>
