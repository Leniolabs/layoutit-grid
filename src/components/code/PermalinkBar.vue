<template>
  <div>
    <span>Your grid has been saved!</span>
    <span>{{ ' ' }}</span>
    <a :href="fullPath" rel="noopener" target="_blank">{{ path }}</a>
    <button @click="$emit('close')">×</button>
  </div>
</template>

<script setup lang="ts">
const { path } = defineProps<{
  path
}>()

defineEmits(['close'])

let fullPath = $computed(() => 'https://' + path)
</script>

<style scoped lang="postcss">
div {
  position: fixed;
  top: 0px;
  background: var(--color-yellow);
  left: 0;
  right: 0px;
  padding: 12px 20px 10px;
  color: var(--color-gray-dark);
  border-bottom: 1px solid var(--color-gray);
  z-index: 30000;
  word-break: break-all;
  button {
    position: absolute;
    border: 0;
    background: none;
    right: 8px;
    font-size: 20px;
    top: 8px;
    color: var(--color-gray-middle);
    cursor: pointer;
    &:hover {
      color: var(--color-black);
    }
    &:after {
      content: '';
      background: rgba(var(--color-black-rgb), 0.4);
      position: fixed;
      left: 0px;
      z-index: 100000;
      right: 0px;
      top: 38px;
      bottom: 0px;
    }
  }
}
</style>
