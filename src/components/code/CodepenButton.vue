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
      <span v-if="expanded">Create CodePen</span>
    </button>
  </form>
</template>

<script setup>
import IconCodepen from '../icons/IconCodepen.vue'

import { preferredExport } from '../../store.js'

import { areaToCSS, areaToHTML } from '../../generateCode.js'

import { defineProps, ref, computed } from 'vue'

const props = defineProps({
  area: { type: Object, required: true },
  options: { type: Object, required: true },
})
const expanded = computed(() => preferredExport.value === 'codepen')

function onSubmit(event) {
  event.preventDefault()
  document.getElementById('codepenData').value = JSON.stringify(codePenJSON())
  document.getElementById('codepenForm').submit()
  preferredExport.value = 'codepen'
}

const codePenJSON = function () {
  const cssCode = areaToCSS(props.area, props.options)
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
  font-size: 15px;
  text-align: center;
  margin: 0 auto;
  background: #151515;
  user-select: none;
  border: 1px solid #23241f;
  display: flex;
  align-items: center;
  transition: all 0.2s ease-in-out;
  padding: 10px 15px;
  &:hover {
    background: #23241f;
  }
  span {
    margin-left: 10px;
  }
  &.expanded {
    //padding: 10px 20px;
  }
}
</style>
