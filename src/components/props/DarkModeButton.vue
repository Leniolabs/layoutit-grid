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
import { useLocalStorage } from 'vue-composable'
export { default as IconDark } from '../icons/IconDark.vue'
export { darkmode } from '../../store'

const { storage: themeStorage } = useLocalStorage('theme', null)

export function toggleDarkmode() {
  darkmode.value = !darkmode.value
  themeStorage.value = darkmode.value ? 'dark' : 'light'
}

export function switchToSystemTheme() {
  darkmode.value = getSystemTheme() === 'dark'
  themeStorage.value = null
}

onMounted(() => {
  darkmode.value = (themeStorage.value || getSystemTheme()) === 'dark'
})

watch(darkmode, () => {
  document.getElementById('app').classList[darkmode.value ? 'add' : 'remove']('darkmode')
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
  background: var(--color-darkmode);
  color: #fff;
  border: 0;
  border-radius: 25px;
  cursor: pointer;
  height: 35px;
  width: 35px;
  padding: 10px;
  &.active {
    background: var(--color-darkmode-active);
  }
  @media screen and (max-width: 768px) {
    visibility: hidden;
  }
}

.btn-dark {
  position: fixed;
  bottom: 5px;
  left: 15px;
}
</style>
