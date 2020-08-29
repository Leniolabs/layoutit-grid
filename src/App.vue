<template>
  <!-- 
    When deployed, you can use <layout-editor :saveDesign="..."/> 
    to get a path for the current area
  -->
  <layout-editor />
</template>

<script setup>
import LayoutEditor from './components/LayoutEditor.vue'

export default {
  components: {
    LayoutEditor,
  },
}
</script>

<style lang="scss">
</style>
