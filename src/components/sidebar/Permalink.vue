<template>
  <div>
    <span>Your grid has been saved!</span>
    <a :href="fullPath" target="_blank">{{ path }}</a>
    <button @click="$emit('close')">×</button>
  </div>
</template>

<script setup="props">
import { computed } from 'vue'

export default {
  props: {
    path: { type: String, required: true }
  }
}

export const fullPath = computed(() => 'https://' + props.path)
</script>

<style scoped lang="scss">
div {
  position: fixed;
  top: 10px;
  background: #fdd835;
  left: calc(14em + 15px);
  right: 10px;
  padding: 12px 30px 10px;
  color: #333;
  border-bottom: 1px solid #ccc;
  z-index: 999;
  word-break: break-all;
  @media screen and (max-width: 768px) {
    left: 0;
    right: 0;
    top: 45px;
  }
  button {
    position: absolute;
    border: 0;
    background: none;
    right: 0;
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
      left: 239px;
      z-index: 9;
      right: 10px;
      top: 51px;
      bottom: 10px;
    }
  }
}
</style>
