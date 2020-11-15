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
    <CodepenButton :area="area" :options="options" />
    <CodeSanboxButton :area="area" :options="options" />
    <SidebarButton :disabled="!saveDesign" class="btn-link" aria-label="Get Shareable Link" @click="getPermalink">
      <IconLink />
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
export { default as IconLink } from '../icons/IconLink.vue'
export { default as IconUndo } from '../icons/IconUndo.vue'
export { default as IconRedo } from '../icons/IconRedo.vue'
export { default as DarkModeButton } from '../props/DarkModeButton.vue'
export { default as SidebarButton } from '../basic/SidebarButton.vue'
export { default as CodepenButton } from './CodepenButton.vue'
export { default as CodeSanboxButton } from './CodeSanboxButton.vue'
export { default as PermalinkBar } from './PermalinkBar.vue'
export { default as LiveCodeOptions } from './LiveCodeOptions.vue'
export { default as HtmlCodeEditor } from './HtmlCodeEditor.vue'
export { default as CssCodeEditor } from './CssCodeEditor.vue'

import { ref, computed, onMounted, watch } from 'vue'

export { restart, preferredExport } from '../../store.js'

import { areaToCSS, areaToHTML } from '../../generateCode.js'
import { useLocalStorage } from '@vueuse/core'

export { undo, redo, canUndo, canRedo, mainArea } from '../../store.js'

export default {
  props: {
    area: { type: Object, required: true },
    saveDesign: { type: Function, default: null },
  },
}

const storedPreferredExport = useLocalStorage('preferred-export')
watch(preferredExport, () => {
  storedPreferredExport.value = preferredExport.value
})
onMounted(() => {
  const preferred = storedPreferredExport.value
  if (preferred) {
    preferredExport.value = preferred
  }
})

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
  > * {
    margin-right: 10px;
  }
  > button {
    max-width: max-content;
    padding: 0.625em 1em;
    height: 42px;
    transition: all 0.2s ease-in-out;
    &:hover {
      background: #444;
    }
  }
  .btn-trash {
    padding: 12px;
    background: #23241f;
    border: solid 1px #2a2a2a;
  }
  .btn-link {
    padding: 10px;
    background: #23241f;
    border: solid 1px transparent;
    &:hover {
      background: #000;
    }
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
