<template>
  <button aria-label="Toggle dark mode" :class="['btn-dark', { active: darkmode }]" @click="darkmode = !darkmode">
    <IconDark />
  </button>
</template>

<script setup>
import { onMounted, watch } from 'vue'
import { useLocalStorage } from 'vue-composable'
export { default as IconDark } from '../icons/IconDark.vue'
export { darkmode } from '../../store'

const { storage: darkmodeStorage } = useLocalStorage('dark-mode', null)

onMounted(() => {
  if (darkmodeStorage.value !== null) {
    return (darkmode.value = darkmodeStorage.value)
  }
  const darkModeMediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
  if (darkModeMediaQuery.media !== 'not all') {
    darkmode.value = darkModeMediaQuery.matches
  }
})

watch(darkmode, () => {
  darkmodeStorage.value = darkmode.value
  document.getElementById('app').classList[darkmode.value ? 'add' : 'remove']('darkmode')
})
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
}

.btn-dark {
  position: fixed;
  bottom: 5px;
  left: 15px;
}
</style>
