<template>
  <div :class="['sidebar', { active: currentView === 'props' }]">
    <BrandLogo />
    <AreaTree :area="area" />
    <AreaProps :area="currentArea" />
    <BrandBanner />
  </div>
</template>

<script setup="props">
export { default as BrandLogo } from './BrandLogo.vue'
export { default as IconGithub } from '../icons/IconGithub.vue'
export { default as FlexOptions } from './FlexOptions.vue'
export { default as GridOptions } from './GridOptions.vue'
export { default as AreaProps } from './AreaProps.vue'
export { default as AreaTree } from './AreaTree.vue'
export { default as BrandBanner } from '../props/BrandBanner.vue'

import { computed } from 'vue'
export { currentArea, currentView } from '../../store.js'

export default {
  props: {
    area: { type: Object, required: true },
  },
}
</script>

<style scoped lang="scss">
.sidebar {
  z-index: 20000;
  color: #fff;
  display: grid;
  gap: 20px 0px;
  grid-template-rows: auto auto 1fr auto;
  overflow: auto;
  padding: 0 0 0 14px;
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
