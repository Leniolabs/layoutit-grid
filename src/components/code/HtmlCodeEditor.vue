<template>
  <CodeEditor type="html" :get-code="getCode">
    <HtmlCodeArea :area="area" :options="options" />
  </CodeEditor>
</template>

<script setup>
import { defineProps } from 'vue'
import { areaToHTML } from '../../generateCode.js'
import CodeEditor from './CodeEditor.vue'
import HtmlCodeArea from './HtmlCodeArea.vue'

const props = defineProps({
  area: { type: Object, default: null },
  options: { type: Object, default: null },
})

function getCode() {
  return areaToHTML(props.area)
}
</script>

<style scoped>
::v-deep(span) {
  color: var(--color-gray-light);
}

::v-deep(.token.punctuation) {
  color: var(--color-gray-light);
}

::v-deep(.token.tag) {
  color: var(--color-blue-light);
}

::v-deep(.token.attr-name) {
  color: var(--color-blue-lightest);
}

::v-deep(.token.attr-value) {
  color: var(--color-orange);
}
</style>
