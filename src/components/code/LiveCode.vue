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
    <CodepenButton :area="area" :options="options" />
    <CodeSanboxButton :area="area" :options="options" />
    <SidebarButton :disabled="!saveDesign" class="btn-link" aria-label="Get Shareable Link" @click="getPermalink">
      <IconLink />
    </SidebarButton>
  </div>
  <div class="code-grid">
    <HtmlCodeEditor :area="area" :options="options" />
    <CssCodeEditor :area="area" :options="options" />
  </div>
  <LiveCodeOptions v-model="options" />
</template>

<script setup>
import IconTrash from '../icons/IconTrash.vue'
import IconLink from '../icons/IconLink.vue'
import IconUndo from '../icons/IconUndo.vue'
import IconRedo from '../icons/IconRedo.vue'
import DarkModeButton from '../props/DarkModeButton.vue'
import SidebarButton from '../basic/SidebarButton.vue'
import CodepenButton from './CodepenButton.vue'
import CodeSanboxButton from './CodeSanboxButton.vue'
import PermalinkBar from './PermalinkBar.vue'
import LiveCodeOptions from './LiveCodeOptions.vue'
import HtmlCodeEditor from './HtmlCodeEditor.vue'
import CssCodeEditor from './CssCodeEditor.vue'

import { defineProps, ref, computed, onMounted, watch } from 'vue'

import { undo, redo, canUndo, canRedo, mainArea, restart, preferredExport } from '../../store.js'

import { areaToCSS, areaToHTML } from '../../generateCode.js'
import { useLocalStorage } from '@vueuse/core'

const props = defineProps({
  area: { type: Object, required: true },
  saveDesign: { type: Function, default: null },
})
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

const options = ref({
  templateAreas: true,
  oldSpec: false,
  repeat: false,
})

const cssCode = computed(() => {
  const { repeat, templateAreas, oldSpec } = options.value
  return areaToCSS(props.area, { useTemplateAreas: templateAreas, repeat, oldSpec })
})

const htmlCode = computed(() => {
  return areaToHTML(props.area)
})

const showPermalink = ref(false)
const permalink = ref('')

function getPermalink() {
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
    margin-right: 6px;
  }
  > button {
    max-width: max-content;
    padding: 0.625em 1em;
    height: 42px;
    transition: all 0.2s ease-in-out;
    &:hover {
      background: #23241f;
    }
    &[disabled] {
      opacity: 0.35;
    }
  }
  .btn-trash {
    padding: 12px;
    background: #151515;
    border: solid 1px #23241f;
  }
  .btn-link {
    padding: 10px;
    background: #151515;
    border: solid 1px transparent;
    &:hover {
      background: #000;
    }
  }
  .btn-history {
    padding: 10px;
    max-width: 42px;
    background: #151515;
    border: solid 1px #23241f;
    &:first-child {
      margin-left: 0;
      margin-right: 0;
      border-top-right-radius: 0;
      border-bottom-right-radius: 0;
    }
    + .btn-history {
      margin-left: 0;
      border-top-left-radius: 0;
      border-bottom-left-radius: 0;
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
