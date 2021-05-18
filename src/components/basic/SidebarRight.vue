<template>
  <div :class="['code-sidebar', { active: currentView === 'code' }]">
    <a
      class="btn-github"
      rel="noopener"
      target="_blank"
      aria-label="View source on GitHub"
      href="https://github.com/Leniolabs/layoutit-grid"
    >
      <IconGithub />
    </a>
    <slot name="body" />
    <BrandBanner />
  </div>
</template>

<script setup>
import { currentView } from '../../store.js'
import IconGithub from '../icons/IconGithub.vue'
import BrandBanner from '../props/BrandBanner.vue'
</script>

<style scoped lang="postcss">
.code-sidebar {
  overflow: auto;
  text-align: left;
  color: #e9e9e9;
  padding: 10px 15px 15px 15px;
  transition: transform 0.2s ease-in;
  @media (max-width: 769px) {
    padding: 10px 10px 10px 10px;
    transform: translateX(100%);
    width: 100%;
    background: #1e1e1e;
    position: fixed;
    right: 0;
    bottom: 0;
    top: 48px;
    &.active {
      transform: translateX(0em);
    }
  }
}

.code-sidebar {
  display: grid;
  grid-template-rows: 50px 50px calc(100% - 270px) 85px 85px;
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
