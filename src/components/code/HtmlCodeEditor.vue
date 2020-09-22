<template>
  <CodeEditor type="html"><HtmlCodeArea :area="area" :options="options" /></CodeEditor>
</template>

<script setup>
export { default as CodeEditor } from './CodeEditor.vue'
export { default as HtmlCodeArea } from './HtmlCodeArea.vue'

export default {
  props: {
    area: { type: Object, default: null },
    options: { type: Object, default: null },
  },
}
</script>

<style scoped>
::v-deep(span) {
  color: #d4d4d4;
}

::v-deep(.token.punctuation) {
  color: #d4d4d4;
}

::v-deep(.token.tag) {
  color: #569cd6;
}

::v-deep(.token.attr-name) {
  color: #9cdcfe;
}

::v-deep(.token.attr-value) {
  color: #ce9178;
}
</style>
