<script setup lang="ts">
import { areaToHTML, areaToIndexCSS } from '../../generateCode.js'

const { area, options } = defineProps<{ area; options }>()

async function compressForCodesandbox(input) {
  const { default: LZString } = await import('lz-string')
  return LZString.compressToBase64(input)
    .replace(/\+/g, '-') // Convert '+' to '-'
    .replace(/\//g, '_') // Convert '/' to '_'
    .replace(/=+$/, '') // Remove ending '='
}

function areaToIndexHTML(area) {
  return `<!DOCTYPE html>
<html>
  <head>
    <link href="index.css" rel="stylesheet" />
  </head>
  <body>
    ${areaToHTML(area, 2)}
  </body>
</html>
`
}

function codeSandboxJSON() {
  return {
    files: {
      'index.html': {
        content: areaToIndexHTML(area, false),
      },
      'index.css': {
        content: areaToIndexCSS(area, options),
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
    <ExportButton app="codesandbox" title="CodeSandbox" @click="createCodeSandbox">
      <IconCodesandbox />
    </ExportButton>
  </form>
</template>
