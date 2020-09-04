<template>
  <div class="code-container">
    <span class="header">{{ type.toUpperCase() }}</span>
    <suspense>
      <template #default>
        <CodeView :code="code" :type="type" />
      </template>
      <template #fallback>
        <pre>{{code}}</pre>
      </template>
    </suspense>
  </div>
</template>

<script setup>
// Lazy load CodeView component that includes prism.js and related css

import { defineAsyncComponent } from 'vue'

export default {
  components: {
    CodeView: defineAsyncComponent(() => import('./CodeView.vue')),
  },
  props: {
    type: { type: String, required: true },
    code: { type: String, required: true },
  },
}
</script>

<style scoped lang="scss">
.code-container {
  background: #23241f;
  border-top-left-radius: 4px;
  border-top-right-radius: 4px;
  border: solid 1px #2a2a2a;
  height: 100%;
  overflow: auto;
  > span {
    display: block;
    background: #444;
    color: #ccc;
    font-weight: 700;
    font-size: 12px;
    padding: 3px 5px 2px;
    border-top-left-radius: 4px;
    border-top-right-radius: 4px;
  }
}

pre {
  margin: 0px;
  padding: 1em;
  color: #9cdcfe;
  font-size: 13px;
  font-family: Consolas, Monaco, 'Andale Mono', 'Ubuntu Mono', monospace;
  direction: ltr;
  text-align: left;
  white-space: pre;
  word-spacing: normal;
  word-break: normal;
  line-height: 1.5;
  tab-size: 4;
}
</style>
