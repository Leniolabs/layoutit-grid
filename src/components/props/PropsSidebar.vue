<template>
  <div :class="['sidebar', { active: currentView === 'props' }]">
    <div class="sidebar-logo"><BrandLogo /></div>
    <AreaProps :area="currentArea" />
  </div>
</template>

<script setup lang="ts">
import { currentArea, currentView } from '../../store.js'

defineProps({
  area: { type: Object, required: true },
})
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
