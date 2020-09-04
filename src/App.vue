<template>
  <!-- 
    When deployed, you can use <LayoutEditor :saveDesign="..."/> 
    to get a path for the current area
  -->
  <LayoutEditor />
</template>

<script setup>
export { default as LayoutEditor } from './components/LayoutEditor.vue'
</script>

<style lang="scss">
</style>
