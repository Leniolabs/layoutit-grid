<template>
  <div :class="['code-sidebar', { active: currentView === 'code' }]">
    <slot name="body" />
  </div>
</template>

<script setup>
export { currentView } from '../../store.js'
</script>

<style scoped lang="scss">
.code-sidebar {
  overflow: auto;
  text-align: left;
  color: #e9e9e9;
  padding: 10px 15px 10px 15px;
  transition: transform 0.2s ease-in;
  @media (max-width: 769px) {
    padding: 10px 10px 10px 10px;
    transform: translateX(100%);
    width: min(100%, 430px);
    background: #300748;
    position: fixed;
    right: 0;
    bottom: 0;
    top: 0;
    &.active {
      transform: translateX(0em);
    }
  }
}

.code-sidebar {
  display: flex;
  flex-direction: column;
  > div {
    flex: 1;
  }
}
</style>
