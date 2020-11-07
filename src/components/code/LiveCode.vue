<template>
  <PermalinkBar v-show="showPermalink" :path="permalink" @close="showPermalink = false" />
  <div class="buttons">
    <SidebarButton :disabled="!undoStack.length" class="btn-history" aria-label="Undo" @click="undo">
      <IconUndo />
    </SidebarButton>
    <SidebarButton :disabled="!redoStack.length" class="btn-history" aria-label="Redo" @click="redo">
      <IconRedo />
    </SidebarButton>
    <SidebarButton aria-label="Restart" class="btn-trash" @click="restart">
      <IconTrash />
    </SidebarButton>
    <DarkModeButton />
  </div>
  <div class="buttons">
    <CodepenButton :css-code="cssCode" :html-code="htmlCode" />
    <CodeSanboxButton :css-code="cssCode" :html-code="htmlCode" />
    <SidebarButton :disabled="!saveDesign" class="btn-link" aria-label="Get Shareable Link" @click="getPermalink">
      <IconLink />
    </SidebarButton>
  </div>
  <div class="code-grid">
    <CssCodeEditor :area="area" :options="options" :code="cssCode" />
    <HtmlCodeEditor :area="area" :options="options" :code="htmlCode" />
  </div>
  <LiveCodeOptions v-model="options" />
</template>

<script setup="props">
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

import { computed } from 'vue'

import { restart } from '../../store.js'

import { areaToCSS, areaToHTML } from '../../generateCode.js'

import { undo, redo, undoStack, redoStack, mainArea } from '../../store.js'

export default {
  props: {
    area: { type: Object, required: true },
    saveDesign: { type: Function, default: null },
  },
}

ref: options = {
  templateAreas: true,
  oldSpec: false,
  repeat: false,
}

ref: cssCode = computed(() => {
  const { repeat, templateAreas, oldSpec } = options
  return areaToCSS(props.area, { useTemplateAreas: templateAreas, repeat, oldSpec })
})

ref: htmlCode = computed(() => {
  return areaToHTML(props.area)
})

ref: showPermalink = false
ref: permalink = ''

function getPermalink() {
  // Permalink supports depends on the deployed editor
  if (props.saveDesign) {
    props.saveDesign(mainArea).then((path) => {
      permalink = path
      showPermalink = true
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
