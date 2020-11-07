<template>
  <button
    aria-label="Toggle dark mode"
    :class="['btn-dark', { active: darkmode }]"
    @click.left="toggleDarkmode"
    @click.prevent.right="switchToSystemTheme"
  >
    <IconDark />
  </button>
</template>

<script setup>
import { onMounted, watch } from 'vue'
import { useLocalStorage } from '@vueuse/core'
import IconDark from '../icons/IconDark.vue'
import { darkmode as ref_darkmode } from '../../store.js'

ref: darkmode = ref_darkmode
ref: themeStorage = useLocalStorage('theme', null)

function toggleDarkmode() {
  darkmode = !darkmode
  themeStorage = darkmode ? 'dark' : 'light'
}

function switchToSystemTheme() {
  darkmode = getSystemTheme() === 'dark'
  themeStorage = null
}

onMounted(() => {
  darkmode = (themeStorage || getSystemTheme()) === 'dark'
})

watch($darkmode, () => {
  document.getElementById('app').classList[darkmode ? 'add' : 'remove']('darkmode')
})

function getSystemTheme() {
  return 'light'
  /* For the moment, we are going to use light by default ignoring the system preference until
     the dark mode in the app is more polished
     
  const darkModeMediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
  return darkModeMediaQuery.media !== 'not all' && darkModeMediaQuery.matches ? 'dark' : 'light'
  */
}
</script>

<style scoped lang="scss">
button.btn-dark {
  margin-bottom: 10px;
  background: #23241f;
  border: solid 1px #2a2a2a;
  color: #eee;
  border-radius: 25px;
  cursor: pointer;
  width: 42px;
  padding: 0px;
  svg {
    width: 100%;
  }
  &.active {
    background: var(--color-darkmode-active);
  }
}
.buttons button.btn-dark {
  padding: 10px;
}
</style>
