<template>
  <vue-resizable :min-width="minWidth" :max-width="maxWidth" :width="width" :active="['r']">
    <div :class="['sidebar', { active: currentView === 'props' }]">
      <div class="sidebar-logo"><BrandLogo /></div>
      <AreaProps :area="currentArea" />
    </div>
  </vue-resizable>
</template>

<script setup lang="ts">
import VueResizable from 'vue-resizable'
import { useAppState } from '../../store.js'
import { debounce } from '../../utils'

let { currentArea, currentView } = $(useAppState())

let maxWidth = ref(0)
let minWidth = ref(0)
let width = ref(0)

onMounted(() => {
  window.addEventListener('resize', debounce(handleResize))
})

onUnmounted(() => {
  window.removeEventListener('resize', debounce(handleResize))
})

function handleResize() {
  if (window.innerWidth < 768) {
    maxWidth.value = 0
    minWidth.value = 0
    width.value = 0
  } else {
    maxWidth.value = 320
    minWidth.value = 240
    width.value = 275
  }
}

handleResize()

defineProps<{ area }>()
</script>

<style scoped lang="postcss">
.sidebar {
  z-index: 20000;
  color: var(--color-white);
  overflow: auto;
  padding: 0;
  text-align: left;
  transition: transform 0.2s ease-in;
  user-select: none;
  display: flex;
  flex-direction: column;
  @media screen and (max-width: 768px) {
    transform: translateX(-100%);
    position: fixed;
    bottom: 0;
    top: 48px;
    width: 100%;
    background: var(--color-gray-darkest);
    a.brand {
      display: none;
    }
    &.active {
      transform: translateX(0);
    }
    .sidebar-logo {
      display: none;
    }
  }
}

@media screen and (max-width: 768px) {
  .btn-undo,
  .btn-redo,
  .btn-github {
    display: none;
  }
}
</style>
