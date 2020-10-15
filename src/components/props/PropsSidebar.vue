<template>
  <div :class="['sidebar', { active: currentView === 'props' }]">
    <BrandLogo />

    <div v-if="currentArea !== area" class="area-name">{{ currentArea.name }}</div>
    <div v-else></div>

    <FlexOptions v-if="currentFlex" :flex="currentFlex" />
    <GridOptions v-if="currentGrid" :grid="currentGrid" />
    <a
      class="btn-github"
      rel="noopener"
      target="_blank"
      aria-label="View source on GitHub"
      href="https://github.com/Leniolabs/layoutit-grid"
    >
      <IconGithub />
    </a>
    <VersionLabel />
    <HireUs />
  </div>
</template>

<script setup="props">
export { default as VersionLabel } from './VersionLabel.vue'
export { default as BrandLogo } from './BrandLogo.vue'
export { default as HireUs } from './HireUs.vue'
export { default as IconGithub } from '../icons/IconGithub.vue'
export { default as FlexOptions } from './FlexOptions.vue'
export { default as GridOptions } from './GridOptions.vue'

import { computed } from 'vue'
export { currentArea, currentView } from '../../store.js'

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
  margin-bottom: 20px;
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
  z-index: 20000;
  color: #fff;
  display: grid;
  grid-template-rows: auto auto 1fr auto;
  overflow: auto;
  padding: 0px 0px 0px 12px;
  text-align: left;
  transition: transform 0.2s ease-in;
  user-select: none;
  @media screen and (max-width: 768px) {
    transform: translateX(-15em);
    position: fixed;
    padding: 0px 12px;
    bottom: 0;
    top: 0;
    background: #300748;
    a.brand {
      display: none;
    }
    &.active {
      transform: translateX(0);
    }
  }
}

@media screen and (max-width: 768px) {
  .hire-us,
  .version,
  .btn-undo,
  .btn-redo,
  .btn-github {
    display: none;
  }
}

.btn-github {
  position: fixed;
  top: 0;
  right: 0;
  opacity: 0.8;
  transition: opacity 0.1s linear;
  &:hover {
    opacity: 0.9;
  }
}
</style>
