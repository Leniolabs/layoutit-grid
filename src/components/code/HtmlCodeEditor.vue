<template>
  <CodeEditor type="html" :get-code="getCode">
    <HtmlCodeArea :area="area" :options="options" />
  </CodeEditor>
</template>

<script setup lang="ts">
import { areaToHTML } from '../../generateCode.js'

const { area, options } = defineProps<{ area; options }>()

function getCode() {
  return areaToHTML(area)
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
