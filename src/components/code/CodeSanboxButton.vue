<template>
  <form action="https://codesandbox.io/api/v1/sandboxes/define" method="POST" target="_blank">
    <input type="hidden" name="parameters" :value="codesanboxJSON" />
    <button type="submit" class="button"><IconCodesandbox />Create CodeSanbox</button>
  </form>
</template>

<script setup="props">
export { default as IconCodesandbox } from '../icons/IconCodesandbox.vue'

import { computed } from 'vue'
import LZString from 'lz-string'

const compress = (input) => {
  return LZString.compressToBase64(input)
    .replace(/\+/g, '-') // Convert '+' to '-'
    .replace(/\//g, '_') // Convert '/' to '_'
    .replace(/=+$/, '') // Remove ending '='
}
const getParameters = (parameters) => {
  return compress(JSON.stringify(parameters))
}

export default {
  props: {
    cssCode: { type: String, required: true },
    htmlCode: { type: String, required: true },
  },
}

const containerClass = 'grid-container'
export const codesanboxJSON = computed(() =>
  getParameters({
    files: {
      'index.html': {
        content: `
<!DOCTYPE html>
<html>
  <head>
    <link href="index.css" rel="stylesheet" />
  </head>
  <body>
    ${props.htmlCode}
  </body>
</html>
      `,
      },
      'index.css': {
        content: `
${props.cssCode}

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
  })
)
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
  margin: 0 auto;
  background: #23241f;
  user-select: none;
  border: solid 1px #2a2a2a;
  display: flex;
  align-items: center;
  padding: 10px 20px;
  &:hover {
    background: #333;
  }
}
</style>
