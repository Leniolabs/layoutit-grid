<script setup lang="ts">
import { areaToCSS, areaToHTML, presentationCSS } from '../../generateCode.js'

const { area, options } = defineProps<{ area; options }>()

async function compressForCodesandbox(input) {
  const { default: LZString } = await import('lz-string')
  return LZString.compressToBase64(input)
    .replace(/\+/g, '-') // Convert '+' to '-'
    .replace(/\//g, '_') // Convert '/' to '_'
    .replace(/=+$/, '') // Remove ending '='
}

function codeSandboxJSON() {
  const cssCode = areaToCSS(area, options)
  const htmlCode = areaToHTML(area, 2)

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

${presentationCSS(area)}
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
  const parameters = await compressForCodesandbox(JSON.stringify(codeSandboxJSON()))
  const response = await sendFormData('https://codesandbox.io/api/v1/sandboxes/define', { parameters, json: 1 })
  const json = await response.json()
  window.open(`https://codesandbox.io/s/${json.sandbox_id}`, '_blank')
}
</script>

<template>
  <form>
    <ExportButton app="codesandbox" title="Create CodeSandbox" @click="createCodeSandbox">
      <IconCodesandbox />
    </ExportButton>
  </form>
</template>
