<template>
  <PermalinkBar v-show="showPermalink" :path="permalink" @close="showPermalink = false" />
  <div class="buttons">
    <SidebarButton :disabled="!canUndo" class="btn-history" aria-label="Undo" @click="undo">
      <IconUndo />
    </SidebarButton>
    <SidebarButton :disabled="!canRedo" class="btn-history" aria-label="Redo" @click="redo">
      <IconRedo />
    </SidebarButton>
    <SidebarButton aria-label="Restart" class="btn-trash" @click="restart">
      <IconTrash />
    </SidebarButton>
    <DarkModeButton />
  </div>
  <div class="buttons">
    <CodepenButton :css-code="cssCode" :html-code="htmlCode" />
    <SidebarButton :disabled="!saveDesign" class="btn-link" @click="getPermalink"> Get Permalink </SidebarButton>
  </div>
  <div class="code-grid">
    <CssCodeEditor :area="area" :options="options" :code="cssCode" />
    <HtmlCodeEditor :area="area" :options="options" :code="htmlCode" />
  </div>
  <LiveCodeOptions v-model="options" />
</template>

<script setup="props">
export { default as IconTrash } from '../icons/IconTrash.vue'
export { default as IconLink } from '../icons/IconLink.vue'
export { default as IconUndo } from '../icons/IconUndo.vue'
export { default as IconRedo } from '../icons/IconRedo.vue'
export { default as DarkModeButton } from '../props/DarkModeButton.vue'
export { default as SidebarButton } from '../basic/SidebarButton.vue'
export { default as CodepenButton } from './CodepenButton.vue'
export { default as PermalinkBar } from './PermalinkBar.vue'
export { default as LiveCodeOptions } from './LiveCodeOptions.vue'
export { default as HtmlCodeEditor } from './HtmlCodeEditor.vue'
export { default as CssCodeEditor } from './CssCodeEditor.vue'

import { ref, computed } from 'vue'

export { restart } from '../../store.js'

import { areaToCSS, areaToHTML } from '../../generateCode.js'

export { undo, redo, canUndo, canRedo, mainArea } from '../../store.js'

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
  .btn-trash {
    padding: 12px;
    background: #23241f;
    border: solid 1px #2a2a2a;
  }
  .btn-link {
    background: #23241f;
    border: solid 1px #2a2a2a;
  }
  .btn-history {
    padding: 10px;
    max-width: 42px;
    background: #23241f;
    border: solid 1px #2a2a2a;
    &:first-child {
      margin-left: 0;
    }
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
