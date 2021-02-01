<template>
  <div :class="['sidebar', { active: currentView === 'props' }]">
    <BrandLogo />
    <AreaProps :area="currentArea" />
     <BrandBanner />

  </div>
</template>

<script setup>
import BrandLogo from './BrandLogo.vue'
import AreaProps from './AreaProps.vue'
import BrandBanner from '../props/BrandBanner.vue'

import { defineProps, computed } from 'vue'
import { currentArea, currentView } from '../../store.js'

defineProps({
  area: { type: Object, required: true },
})
</script>

<style scoped lang="scss">
.sidebar {
  z-index: 20000;
  color: #fff;
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


</style>
