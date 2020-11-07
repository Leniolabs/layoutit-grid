<template>
  <form action="https://codepen.io/pen/define" style="float: left" method="POST" target="_blank">
    <input id="codepenData" :value="codePenJSON" type="hidden" name="data" />
    <button type="submit" class="button codepen-btn" title="Create CodePen"><IconCodepen />CodePen</button>
  </form>
</template>

<script setup="props">
import IconCodepen from '../icons/IconCodepen.vue'

import { computed } from 'vue'

export default {
  props: {
    cssCode: { type: String, required: true },
    htmlCode: { type: String, required: true },
  },
}

ref: codePenJSON = computed(() => {
  const containerClass = 'container'

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
  padding: 10px 20px;
  transition: all 0.2s ease-in-out;
  text-shadow: rgba(0, 0, 0, 0.3) 0 1px 1px;
  &:hover {
    background: #000;
  }
}
</style>
