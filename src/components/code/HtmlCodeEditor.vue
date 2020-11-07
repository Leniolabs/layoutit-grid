<template>
  <CodeEditor type="html" :code="code"><HtmlCodeArea :area="area" :options="options" /></CodeEditor>
</template>

<script setup>
import CodeEditor from './CodeEditor.vue'
import HtmlCodeArea from './HtmlCodeArea.vue'

export default {
  props: {
    area: { type: Object, default: null },
    options: { type: Object, default: null },
    code: { type: String, required: true },
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
