<template>
  <PermalinkBar v-show="showPermalink" :path="permalink" @close="showPermalink = false" />
  <div class="buttons-wrapper">
    <div class="buttons">
      <SidebarButton :disabled="!canUndo" class="btn-history" aria-label="Undo" @click="undo">
        <IconUndo />
      </SidebarButton>
      <SidebarButton :disabled="!canRedo" class="btn-history" aria-label="Redo" @click="redo">
        <IconRedo />
      </SidebarButton>
      <SidebarButton aria-label="Restart" class="btn-trash" @click="restart">
        <IconRefresh />
      </SidebarButton>
      <SidebarButton :disabled="!saveDesign" class="btn-link" aria-label="Get Shareable Link" @click="getPermalink">
        <IconLink />
      </SidebarButton>
    </div>
    <div class="buttons">
      <CodepenButton :area="area" :options="options" />
      <CodeSanboxButton :area="area" :options="options" />
    </div>
  </div>
  <div style="height: 100%">
    <HtmlCodeEditor :area="area" :options="options" />
    <div class="code-options-container">
      <CssCodeEditor :area="area" :options="options" />
      <LiveCodeOptions v-model="options" />
    </div>
  </div>
</template>

<script setup>
import IconTrash from '../icons/IconTrash.vue'
import IconRefresh from '../icons/IconRefresh.vue'
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

function useStored(source, key, parse = (x) => x) {
  const stored = useLocalStorage(key)
  watch(source, () => {
    stored.value = source.value
  })
  onMounted(() => {
    const val = stored.value
    if (val !== undefined) {
      source.value = parse(val)
    }
  })
  return source
}
function useOption(key, initial) {
  return useStored(ref(initial), (x) => x === 'true')
}

useStored(preferredExport, 'layoutit-grid-preferred-export')

const templateAreas = useOption('layoutit-grid-option-template-areas', true)
const oldSpec = useLocalStorage('layoutit-grid-option-old-spec', false)
const repeat = useLocalStorage('layoutit-grid-option-repeat', false)

const options = ref({
  templateAreas: templateAreas.value,
  oldSpec: oldSpec.value,
  repeat: repeat.value,
})
watch(
  options,
  () => {
    if (templateAreas.value !== options.value.templateAreas) {
      templateAreas.value = options.value.templateAreas
    }
    if (oldSpec.value !== options.value.oldSpec) {
      oldSpec.value = options.value.oldSpec
    }
    if (repeat.value !== options.value.repeat) {
      repeat.value = options.value.repeat
    }
  },
  { deep: true }
)

const cssCode = computed(() => {
  return areaToCSS(props.area, options.value)
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

<style scoped lang="postcss">
.buttons-wrapper {
  position: absolute;
  top: 0;
  padding: 0;
}

.buttons {
  display: flex;
  user-select: none;
  > * {
    margin-right: 6px;
    margin-top: 6px;
    margin-bottom: 0;
  }
  svg {
    width: 20px;
  }
  > button {
    max-width: max-content;
    padding: 0.625em 1em;
    height: 42px;
    transition: all 0.2s ease-in-out;
    display: flex;
    align-items: center;
    justify-content: center;
    &:hover {
      background: #323232;
    }
    &[disabled] {
      opacity: 0.35;
    }
  }
  .btn-trash {
    padding: 10px;
    background: #151515;
    border: solid 1px #23241f;
    max-width: 42px;
  }
  .btn-link {
    padding: 10px;
    background: #151515;
    border: solid 1px transparent;
    &:hover {
      background: #323232;
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
      background: #323232;
    }
  }
  &.btn-default {
    background: #b4bcc8;
  }
}

.code-options-container {
  position: relative;
  max-height: calc(100% - 212px);
  overflow: auto;
  .code-container {
    max-height: initial;
  }
}

* {
  scrollbar-width: thin;
  scrollbar-color: #555 #111;
}
::-webkit-scrollbar {
  width: 5px;
}
::-webkit-scrollbar:horizontal {
  height: 5px;
}
::-webkit-scrollbar-track {
  background: #111;
  border-radius: 10px;
}
::-webkit-scrollbar-thumb {
  background: #555;
  border-radius: 10px;
}
::-webkit-scrollbar-thumb:hover {
  background: #777;
}
</style>
