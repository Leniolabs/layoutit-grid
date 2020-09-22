<template>
  <PermalinkBar v-show="showPermalink" :path="permalink" @close="showPermalink = false" />
  <div class="buttons">
    <CodepenButton :cssCode="cssCode" :htmlCode="htmlCode" />
    <SidebarButton :disabled="!saveDesign" @click="getPermalink">Get permalink</SidebarButton>
    <SidebarButton aria-label="Restart" class="btn-trash" @click="restart">
      <IconTrash />
    </SidebarButton>
  </div>
  <div class="code-grid">
    <CssCodeEditor :area="area" :options="options" />
    <HtmlCodeEditor :area="area" :options="options" />
  </div>
  <LiveCodeOptions v-model="options" />
</template>

<script setup="props">
export { default as IconTrash } from '../icons/IconTrash.vue'
export { default as SidebarButton } from '../basic/SidebarButton.vue'
export { default as CodepenButton } from './CodepenButton.vue'
export { default as PermalinkBar } from './PermalinkBar.vue'
export { default as LiveCodeOptions } from './LiveCodeOptions.vue'
export { default as HtmlCodeEditor } from './HtmlCodeEditor.vue'
export { default as CssCodeEditor } from './CssCodeEditor.vue'

import { ref, computed } from 'vue'

export { restart } from '../../store.js'

import { areaToCSS, areaToHTML } from '../../generateCode.js'

import { mainArea } from '../../store.js'

export default {
  props: {
    area: { type: Object, required: true },
    saveDesign: { type: Function, default: null },
  },
}

export const options = ref({
  templateAreas: true,
  oldSpec: false,
  repeat: false,
})

export const cssCode = computed(() => {
  const { repeat, templateAreas, oldSpec } = options.value
  return areaToCSS(props.area, { useTemplateAreas: templateAreas, repeat, oldSpec })
})

export const htmlCode = computed(() => {
  return areaToHTML(props.area)
})

export const showPermalink = ref(false)
export const permalink = ref('')

export function getPermalink() {
  // Permalink supports depends on the deployed editor
  if (props.saveDesign) {
    props.saveDesign(mainArea.value).then((path) => {
      permalink.value = path
      showPermalink.value = true
    })
  }
}
</script>

<style scoped lang="scss">
.buttons {
  display: flex;
  user-select: none;
  > button {
    max-width: max-content;
    margin-left: 10px;
    padding: 0.625em 1em;
    height: 42px;
  }
  button.btn-trash {
    max-width: max-content;
    padding: 12px;
  }
}

.button {
  background: #6b16a1;
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
  &.btn-close {
    float: right;
    margin: 0 0 0 10px;
    &:hover {
      background: #444;
    }
  }
  &.btn-default {
    background: #b4bcc8;
  }
}

.code-grid {
  display: flex;
  flex-direction: column;

}


</style>
