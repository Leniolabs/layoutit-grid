<template>
  <div class="code-container">
    <span class="header"
      >{{ type.toUpperCase() }}
      <button class="copy-button" @click="copyToClipBoard">
        {{ copied === 0 ? 'Copy' : 'Copied!' }}
      </button>
    </span>
    <pre><code><slot/></code></pre>
  </div>
</template>

<script setup>
import { defineProps, ref } from 'vue'

import { useClipboard } from '@vueuse/core'

const { copy } = useClipboard()

const props = defineProps({
  type: { type: String, required: true },
})
const copied = ref(0)

function copyToClipBoard() {
  copy(props.code)
  copied.value++
  setTimeout(() => {
    copied.value--
  }, 2000)
}
</script>

<style scoped lang="scss">
* {
  scrollbar-width: thin;
  scrollbar-color: #555 #111;
}
::-webkit-scrollbar {
  width: 5px;
}
::-webkit-scrollbar:horizontal {
  height: 5px;
}
::-webkit-scrollbar-track {
  background: #111;
  border-radius: 10px;
}
::-webkit-scrollbar-thumb {
  background: #555;
  border-radius: 10px;
}
::-webkit-scrollbar-thumb:hover {
  background: #777;
}
.code-container {
  background: #23241f;
  border: solid 1px #2a2a2a;
  height: max-content;
  overflow: auto;
  margin-bottom: 10px;
}

.header {
  position: relative;
  display: block;
  color: #bbb;
  font-weight: 700;
  font-size: 12px;
  padding: 8px;
  //border-top-left-radius: 4px;
  //border-top-right-radius: 4px;
  user-select: none;
}

.copy-button {
  top: 6px;
  right: 0;
  position: absolute;
  color: #bbb;
  background-color: Transparent;
  background-repeat: no-repeat;
  font-weight: 700;
  font-size: 12px;
  border: none;
  cursor: pointer;
  overflow: hidden;
  outline: none;
  opacity: 0.5;
  &:hover {
    opacity: 1;
  }
}

pre,
code {
  color: #d4d4d4;
  font-size: 13px;
  text-shadow: none;
  font-family: Consolas, Monaco, 'Andale Mono', 'Ubuntu Mono', monospace;
  direction: ltr;
  text-align: left;
  white-space: pre;
  word-spacing: normal;
  word-break: normal;
  line-height: 1.5;
  -moz-tab-size: 4;
  -o-tab-size: 4;
  tab-size: 4;
  -webkit-hyphens: none;
  -moz-hyphens: none;
  -ms-hyphens: none;
  hyphens: none;
  margin: 0;
}

pre::selection,
code::selection {
  text-shadow: none;
  background: #b3d4fc;
}

@media print {
  pre,
  code {
    text-shadow: none;
  }
}

pre {
  padding: 0.5em 1em 1em;
  overflow: auto;
}

:not(pre) > code {
  padding: 0.1em 0.3em;
  border-radius: 0.3em;
  color: #db4c69;
  background: #f9f2f4;
}
</style>
