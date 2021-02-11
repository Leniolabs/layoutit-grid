<template>
  <form>
    <button :class="['button', { expanded }]" type="button" title="Create CodeSandbox" @click="createCodeSandbox">
      <IconCodesandbox />
      <span v-if="expanded">CodeSandbox</span>
    </button>
  </form>
</template>

<script setup>
import IconCodesandbox from '../icons/IconCodesandbox.vue'

import { preferredExport } from '../../store.js'

import { areaToCSS, areaToHTML } from '../../generateCode.js'

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
  const htmlCode = areaToHTML(props.area)

  const containerClass = 'container'
  return {
    files: {
      'index.html': {
        content: `
<!DOCTYPE html>
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
        content: `
${cssCode}

/* For presentation only, no need to copy the code below */
.${containerClass} * {
  border: 1px solid red;
  position: relative;
}

.${containerClass} *:after {
  content:attr(class);
  position: absolute;
  top: 0;
  left: 0;
}
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

<style scoped lang="scss">
.button {
  border: 0;
  border-radius: 50px;
  color: #fff;
  cursor: pointer;
  font-family: inherit;
  font-size: 1em;
  text-align: center;
  margin: 0 auto;
  background: #151515;
  user-select: none;
  border: solid 1px #23241f;
  display: flex;
  align-items: center;
  transition: all 0.2s ease-in-out;

  &:hover {
    background: #23241f;
  }
  span {
    margin-left: 10px;
  }
  padding: 10px;
  &.expanded {
    //padding: 10px 20px;
  }
}
</style>
