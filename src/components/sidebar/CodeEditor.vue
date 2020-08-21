<template>
  <div class="code-container">
    <span class="header">{{ type.toUpperCase() }}</span>
    <pre><code v-html="highlight(code,type)" /></pre>
  </div>
</template>

<script setup>
export { highlight } from '../utils/highlight.js'

export default {
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
  pre {
    border: 0;
    resize: none;
    overflow: auto;
    white-space: pre-wrap;
    text-align: left;
    padding: 0;
    margin: 0;
    font-size: 14px;
    padding: 10px;
  }
}
</style>
