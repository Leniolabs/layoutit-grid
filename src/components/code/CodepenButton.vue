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
    <button type="submit" :class="['button', 'codepen-btn', { expanded }]" title="Create CodePen">
      <IconCodepen />
      <span v-if="expanded">CodePen</span>
    </button>
  </form>
</template>

<script setup="props">
export { default as IconCodepen } from '../icons/IconCodepen.vue'

export { preferredExport } from '../../store.js'

import { areaToCSS, areaToHTML } from '../../generateCode.js'

import { ref, computed } from 'vue'

export default {
  props: {
    area: { type: Object, required: true },
    options: { type: Object, required: true },
  },
}

export const expanded = computed(() => preferredExport.value === 'codepen')

export function onSubmit(event) {
  event.preventDefault()
  document.getElementById('codepenData').value = JSON.stringify(codePenJSON())
  document.getElementById('codepenForm').submit()
  preferredExport.value = 'codepen'
}

export const codePenJSON = function () {
  const { repeat, templateAreas, oldSpec } = props.options
  const cssCode = areaToCSS(props.area, { useTemplateAreas: templateAreas, repeat, oldSpec })
  const htmlCode = areaToHTML(props.area)

  const containerClass = 'container'

  return {
    title: 'New CSS Grid!',
    html: htmlCode,
    css: `html, body, .${containerClass} { height: 100%; margin: 0; }

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
  }
}
</script>

<style scoped lang="scss">
.button {
  border: 0;
  border-radius: 50px;
  color: #eee;
  cursor: pointer;
  font-family: inherit;
  font-size: 1em;
  text-align: center;
  letter-spacing: 0.2px;
  margin: 0 auto;
  background: #23241f;
  user-select: none;
  border: solid 1px transparent;
  display: flex;
  align-items: center;
  transition: all 0.2s ease-in-out;
  text-shadow: rgba(0, 0, 0, 0.3) 0 1px 1px;
  &:hover {
    background: #000;
  }
  span {
    margin-left: 10px;
  }
  padding: 10px;
  &.expanded {
    padding: 10px 20px;
  }
}
</style>
