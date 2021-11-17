<script setup lang="ts">
import { areaToCSS, areaToHTML, presentationCSS } from '../../generateCode.js'

const { area, options } = defineProps<{ area; options }>()

function onSubmit(event) {
  event.preventDefault()
  document.getElementById('codepenData').value = JSON.stringify(codePenJSON())
  document.getElementById('codepenForm').submit()
}

const codePenJSON = function () {
  const cssCode = areaToCSS(area, options)
  const htmlCode = areaToHTML(area)

  return {
    title: 'New CSS Grid!',
    html: htmlCode,
    css: `${cssCode}

${presentationCSS(area)}
`,
  }
}
</script>

<template>
  <form
    id="codepenForm"
    action="https://codepen.io/pen/define"
    style="float: left"
    method="POST"
    target="_blank"
    @submit="onSubmit"
  >
    <input id="codepenData" type="hidden" name="data" />
    <ExportButton app="codepen" title="CodePen" type="submit">
      <IconCodepen />
    </ExportButton>
  </form>
</template>
