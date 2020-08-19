<template>
  <Editor />
</template>

<script setup>
import Editor from './components/Editor.vue'

// When deployed, you can use <Editor :saveDesign="..."/> to get a path for the current area
export default {
  components: {
    Editor,
  },
}
</script>

<style lang="scss">
</style>
