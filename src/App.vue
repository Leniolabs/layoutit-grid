<template>
  <Editor />
</template>

<script>
import Editor from './components/Editor.vue'

// When deployed, you can use <Editor :saveDesign="..."/> to get a path for the current area
export default {
  name: 'App',
  components: {
    Editor
  }
}
</script>

<style lang="scss">
</style>
