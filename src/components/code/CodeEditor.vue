<template>
  <div class="code-container">
    <span class="header"
      >{{ type.toUpperCase() }}
      <button class="copy-button" @click="copyToClipBoard">
        {{ copied === 0 ? 'Copy' : 'Copy ✓' }}
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
  getCode: { type: Function, required: true },
})
const copied = ref(0)

function copyToClipBoard() {
  copy(props.getCode())
  copied.value++
  setTimeout(() => {
    copied.value--
  }, 2000)
}
</script>

<style scoped lang="postcss">
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
  background: #151515;
  border: solid 1px #23241f;
  overflow: auto;
  margin-bottom: 6px;
  max-width: 350px;
  position: relative;
  padding-top: 30px;
  height: max-content;
  max-height: 200px;
  @media screen and (max-width: 768px) {
    max-width: 100%;
  }
}

.header {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  display: block;
  color: #aaa;
  font-weight: 700;
  font-size: 12px;
  padding: 8px;
  //border-top-left-radius: 4px;
  //border-top-right-radius: 4px;
  user-select: none;
}

.copy-button {
  top: 6px;
  right: 5px;
  position: absolute;
  color: #eee;
  background-color: Transparent;
  background-repeat: no-repeat;
  font-weight: 700;
  font-size: 13px;
  border: none;
  cursor: pointer;
  overflow: hidden;
  outline: none;
  opacity: 0.6;
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
  padding: 0 0.2em 1em 1em;
  overflow: auto;
}

:not(pre) > code {
  padding: 0.1em 0.3em;
  border-radius: 0.3em;
  color: #db4c69;
  background: #f9f2f4;
}
</style>
