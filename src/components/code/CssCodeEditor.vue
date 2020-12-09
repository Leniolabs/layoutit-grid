<template>
  <CodeEditor type="css"
    ><CssCodeArea :area="area" :options="options" /><template v-if="options.oldSpec"
      >{{ '\n\n@media all and (-ms-high-contrast:none) {\n\n' }}<CssCodeAreaOldSpec :area="area" :options="options" />{{
        '\n\n}'
      }}</template
    ></CodeEditor
  >
</template>

<script setup>
import { defineProps } from 'vue'
import CodeEditor from './CodeEditor.vue'
import CssCodeArea from './CssCodeArea.vue'
import CssCodeAreaOldSpec from './CssCodeAreaOldSpec.vue'

defineProps({
  area: { type: Object, default: null },
  options: { type: Object, default: null },
})
</script>

<style scoped>
::v-deep(.token.punctuation) {
  color: #d4d4d4;
}

::v-deep(.token.string) {
  color: #ce9178;
}

::v-deep(.token.property) {
  color: #9cdcfe;
}

::v-deep(.token.selector) {
  color: #d7ba7d;
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
