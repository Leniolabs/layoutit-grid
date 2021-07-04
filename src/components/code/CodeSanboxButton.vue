<template>
  <form>
    <button :class="['button', { expanded }]" type="button" title="Create CodeSandbox" @click="createCodeSandbox">
      <IconCodesandbox />
      <span v-if="expanded">Create CodeSandbox</span>
    </button>
  </form>
</template>

<script setup>
import { preferredExport } from '../../store.js'

import { areaToCSS, areaToHTML, presentationCSS } from '../../generateCode.js'

import { defineProps, computed } from 'vue'

const props = defineProps({
  area: { type: Object, required: true },
  options: { type: Object, required: true },
})
const expanded = computed(() => preferredExport.value === 'codesandbox')

async function compressForCodesandbox(input) {
  const { default: LZString } = await import('lz-string')
  return LZString.compressToBase64(input)
    .replace(/\+/g, '-') // Convert '+' to '-'
    .replace(/\//g, '_') // Convert '/' to '_'
    .replace(/=+$/, '') // Remove ending '='
}

function codeSandboxJSON() {
  const cssCode = areaToCSS(props.area, props.options)
  const htmlCode = areaToHTML(props.area, 2)

  return {
    files: {
      'index.html': {
        content: `<!DOCTYPE html>
<html>
  <head>
    <link href="index.css" rel="stylesheet" />
  </head>
  <body>
    ${htmlCode}
  </body>
</html>
`,
      },
      'index.css': {
        content: `${cssCode}

${presentationCSS(props.area)}
`,
      },
    },
  }
}

function sendFormData(url, data) {
  const formData = new FormData()
  for (name in data) {
    formData.append(name, data[name])
  }
  return fetch(url, {
    method: 'POST',
    mode: 'cors',
    body: formData,
  })
}

async function createCodeSandbox() {
  preferredExport.value = 'codesandbox'
  const parameters = await compressForCodesandbox(JSON.stringify(codeSandboxJSON()))
  const response = await sendFormData('https://codesandbox.io/api/v1/sandboxes/define', { parameters, json: 1 })
  const json = await response.json()
  window.open(`https://codesandbox.io/s/${json.sandbox_id}`, '_blank')
}
</script>

<style scoped lang="postcss">
.button {
  border: 0;
  border-radius: 50px;
  color: var(--color-gray-lightest);
  cursor: pointer;
  font-family: inherit;
  font-size: 15px;
  text-align: center;
  margin: 0 auto;
  background: var(--color-black);
  user-select: none;
  border: solid 1px var(--color-gray-darkest);
  display: flex;
  align-items: center;
  transition: all 0.2s ease-in-out;
  padding: 10px 15px;

  &:hover {
    background: var(--color-gray-dark);
  }
  span {
    margin-left: 10px;
  }
  padding: 10px;
  &.expanded {
    /*padding: 10px 20px;*/
  }
}
</style>
