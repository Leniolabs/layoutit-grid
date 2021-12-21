<template>
  <PermalinkBar v-show="showPermalink" :path="permalink" @close="showPermalink = false" />
  <div class="buttons-wrapper">
    <div class="buttons">
      <SidebarButton :disabled="!canUndo" class="btn-history" title="Undo" aria-label="Undo" @click="undo">
        <IconUndo />
      </SidebarButton>
      <SidebarButton :disabled="!canRedo" class="btn-history" title="Redo" aria-label="Redo" @click="redo">
        <IconRedo />
      </SidebarButton>
      <SidebarButton aria-label="Restart" class="btn-trash" title="Restart" @click="restart">
        <IconRefresh />
      </SidebarButton>
      <SidebarButton
        :disabled="!saveDesign"
        class="btn-link"
        title="Get Shareable Link"
        aria-label="Get Shareable Link"
        @click="getPermalink"
      >
        <IconLink />
      </SidebarButton>
    </div>
    <div class="buttons">
      <CodepenButton :area="area" :options="options" />
      <CodeSanboxButton :area="area" :options="options" />
      <StackblitzButton :area="area" :options="options" />
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

<script setup lang="ts">
import { useAppState, undo, redo, restart } from '../../store.js'

import { areaToCSS, areaToHTML } from '../../generateCode.js'
import { useLocalStorage } from '@vueuse/core'

let { mainArea, preferredExport, canUndo, canRedo } = $(useAppState())

const { area, saveDesign } = defineProps<{
  area
  saveDesign?: (area) => string
}>()

let options = $ref({
  templateAreas: true,
  oldSpec: false,
  repeat: false,
})

let storedOptions = $(useLocalStorage('layoutit-grid-options', JSON.stringify(options)))

watch(
  $$(options),
  () => {
    storedOptions = JSON.stringify(options)
  },
  { deep: true }
)
const updateOption = (parsed, option) => {
  const value = parsed[option]
  if (value !== undefined) {
    options[option] = value === true
  }
}
onMounted(() => {
  const val = storedOptions
  if (val !== undefined) {
    const parsed = JSON.parse(val)
    updateOption(parsed, 'templateAreas')
    updateOption(parsed, 'oldSpec')
    updateOption(parsed, 'repeat')
  }
})

let cssCode = $computed(() => {
  return areaToCSS(area, options)
})

let htmlCode = $computed(() => {
  return areaToHTML(area)
})

let showPermalink = $ref(false)
let permalink = $ref('')

function getPermalink() {
  // Permalink supports depends on the deployed editor
  if (saveDesign) {
    saveDesign(mainArea).then((path) => {
      permalink = path
      showPermalink = true
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
      background: var(--color-gray-dark);
    }
    &[disabled] {
      opacity: 0.35;
    }
  }
  .btn-trash {
    padding: 10px;
    background: var(--color-black);
    border: solid 1px var(--color-gray-darkest);
    max-width: 42px;
  }
  .btn-link {
    padding: 10px;
    background: var(--color-black);
    border: solid 1px transparent;
    &:hover {
      background: var(--color-gray-dark);
    }
  }
  .btn-history {
    padding: 10px;
    max-width: 42px;
    background: var(--color-black);
    border: solid 1px var(--color-gray-darkest);
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
  background: var(--color-purple);
  border: 0;
  border-radius: 50px;
  color: var(--color-white);
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
      background: var(--color-gray-dark);
    }
  }
  &.btn-default {
    background: var(--color-gray-light);
  }
}

.code-options-container {
  position: relative;
  max-height: calc(100% - 216px);
  overflow: auto;
  border: solid 1px var(--color-gray-darkest);
  .code-container {
    max-height: initial;
    margin-bottom: 0;
    border: 0;
  }
}

* {
  scrollbar-width: thin;
  scrollbar-color: var(--color-gray-middle) var(--color-black);
}
::-webkit-scrollbar {
  width: 5px;
}
::-webkit-scrollbar:horizontal {
  height: 5px;
}
::-webkit-scrollbar-track {
  background: var(--color-black);
  border-radius: 10px;
}
::-webkit-scrollbar-thumb {
  background: var(--color-gray-middle);
  border-radius: 10px;
}
::-webkit-scrollbar-thumb:hover {
  background: var(--color-gray-middle);
}
</style>
