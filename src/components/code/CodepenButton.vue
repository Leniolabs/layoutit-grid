<template>
  <form action="https://codepen.io/pen/define" style="float: left;" method="POST" target="_blank">
    <input id="codepenData" :value="codePenJSON" type="hidden" name="data" />
    <button type="submit" class="button codepen-btn"><icon-codepen />Create CodePen</button>
  </form>
</template>

<script setup="props">
import { computed } from 'vue'

import IconCodepen from '../icons/IconCodepen.vue'

export default {
  components: {
    IconCodepen,
  },
  props: {
    cssCode: { type: String, required: true },
    htmlCode: { type: String, required: true },
    prefix: { type: String, default: '' },
  },
}

function prefixed(name) {
  return (props.prefix ? props.prefix + '-' : '') + name
}

export const codePenJSON = computed(() => {
  const containerClass = prefixed('grid-container')

  return JSON.stringify({
    title: 'New CSS Grid!',
    html: props.htmlCode,
    css: `html, body, .${containerClass} { height: 100%; margin: 0; }

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
  })
})
</script>

<style scoped lang="scss">
.button {
  border: 0;
  border-radius: 50px;
  color: #fff;
  cursor: pointer;
  display: inline-block;
  font-family: inherit;
  font-size: 1em;
  text-align: center;
  padding: 0.625em 1em;
  margin: 0 auto;
  background: #333;
  &:hover {
    background: #444;
  }
}
</style>
