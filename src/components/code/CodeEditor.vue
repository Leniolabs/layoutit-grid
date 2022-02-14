<template>
  <div class="code-container">
    <span class="header">
      {{ type.toUpperCase() }}
      <button class="copy-button" @click="copyToClipBoard">{{ copied === 0 ? 'Copy' : 'Copied' }}</button>
    </span>
    <pre><code><slot /></code></pre>
  </div>
</template>

<script setup lang="ts">
import { useClipboard } from '@vueuse/core'

const { copy } = useClipboard()

const { type, getCode } = defineProps<{
  type: string
  getCode: () => string
}>()

let copied = $ref(0)

function copyToClipBoard() {
  copy(getCode())
  copied++
  setTimeout(() => {
    copied--
  }, 2000)
}
</script>

<style scoped lang="postcss">
* {
  scrollbar-width: thin;
  scrollbar-color: var(--color-gray-middle) var(--color-black);
}
::-webkit-scrollbar {
  width: 5px;
}
::-webkit-scrollbar:horizontal {
  height: 5px;
}
::-webkit-scrollbar-track {
  background: var(--color-black);
  border-radius: 10px;
}
::-webkit-scrollbar-thumb {
  background: var(--color-gray-middle);
  border-radius: 10px;
}
::-webkit-scrollbar-thumb:hover {
  background: var(--color-gray-middle);
}
.code-container {
  background: var(--color-black);
  border: solid 1px var(--color-gray-darkest);
  overflow: auto;
  margin-bottom: 8px;
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
  color: var(--color-gray);
  font-weight: 700;
  font-size: 12px;
  padding: 8px;
  /*border-top-left-radius: 4px;*/
  /*border-top-right-radius: 4px;*/
  user-select: none;
}

.copy-button {
  top: 6px;
  right: 5px;
  position: absolute;
  color: var(--color-gray-lightest);
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
  color: var(--color-gray-light);
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
  background: var(--color-blue-lightest);
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
  color: var(--color-magenta-light);
  background: var(--color-white);
}
</style>
