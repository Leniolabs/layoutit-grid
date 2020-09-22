<template>
  <div class="sidebar">
    <BrandLogo />

    <div v-if="currentArea !== area" class="area-name">{{ currentArea.name }}</div>

    <FlexOptions v-if="currentFlex" :flex="currentFlex" />
    <GridOptions v-if="currentGrid" :grid="currentGrid" />

    <HireUs />
    <VersionLabel />
    <button aria-label="Toggle dark mode" :class="['btn-dark', { active: darkmode }]" @click="darkmode = !darkmode">
      <IconDark />
    </button>
    <button :disabled="!canUndo" aria-label="Undo" :class="['btn-undo']" @click="undo">Undo</button>
    <button :disabled="!canRedo" aria-label="Redo" :class="['btn-redo']" @click="redo">Redo</button>
  </div>
</template>

<script setup="props">
export { default as VersionLabel } from './VersionLabel.vue'
export { default as BrandLogo } from './BrandLogo.vue'
export { default as HireUs } from './HireUs.vue'
export { default as IconDark } from '../icons/IconDark.vue'
export { default as FlexOptions } from './FlexOptions.vue'
export { default as GridOptions } from './GridOptions.vue'

import { computed } from 'vue'
export { currentArea, darkmode, undo, redo, canUndo, canRedo } from '../../store.js'

export default {
  props: {
    area: { type: Object, required: true },
  },
}

export const currentGrid = computed(() => currentArea.value.grid)
export const currentFlex = computed(() => currentArea.value.flex)
</script>

<style scoped lang="scss">
.area-name {
  background: #fdd835;
  color: #333;
  padding: 8px 10px;
  top: 0;
  left: 0;
  width: 100%;
  word-break: break-all;
  position: relative;
  border-radius: 2px;
  font-weight: bold;
  &:after {
    content: '';
    bottom: -24px;
    right: 10px;
    position: absolute;
    width: 0;
    height: 0;
    border-style: solid;
    border-width: 12px 10px;
    border-color: #fdd835 transparent transparent;
  }
  &:before {
    content: 'Editing area: ';
    font-weight: normal;
  }
}

.sidebar {
  padding: 0 10px;
  color: #fff;
  text-align: left;
  z-index: 9;
  transition: transform 0.2s ease-in;
  overflow: auto;
  @media screen and (max-width: 768px) {
    transform: translateX(-15em);
    position: fixed;
    background: #300748;
    top: 40px;
    padding-top: 20px;
    a.brand {
      display: none;
    }
    &.active {
      transform: translateX(0);
    }
  }

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
}

.hire-us {
  position: fixed;
  bottom: 15px;
  left: 60px;
}

.version {
  position: fixed;
  bottom: 15px;
  left: 130px;
}

.btn-dark {
  position: fixed;
  bottom: 5px;
  left: 15px;
}

.btn-undo,
.btn-redo {
  margin-bottom: 10px;
  background: var(--color-darkmode);
  color: #fff;
  border: 0;
  border-radius: 25px;
  cursor: pointer;
  height: 35px;
  width: 35px;
  padding: 10px;
}
.btn-undo {
  position: fixed;
  width: 50px;
  bottom: 55px;
  left: 15px;
}
.btn-redo {
  position: fixed;
  width: 50px;
  bottom: 55px;
  left: 75px;
}
</style>
