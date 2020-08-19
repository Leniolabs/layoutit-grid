<template>
  <layout-editor />
</template>

<script setup>
import LayoutEditor from './components/LayoutEditor.vue'

// When deployed, you can use <Editor :saveDesign="..."/> to get a path for the current area
export default {
  components: {
    LayoutEditor,
  },
}
</script>

<style lang="scss">
</style>
