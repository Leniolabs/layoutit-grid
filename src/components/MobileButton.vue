<template>
  <div
    class="mobile-button"
    @click="$emit('click')"
  >
    <IconSidebar />
  </div>
</template>

<script setup>
export { default as IconSidebar } from './icons/IconSidebar.vue'
</script>

<style scoped lang="scss">
.mobile-button {
  background-color: var(--color-add);
  border-radius: 50%;
  box-shadow: 0 3px 6px rgba(0, 0, 0, 0.16), 0 3px 6px rgba(0, 0, 0, 0.23);
  cursor: pointer;
  height: 3.5rem;
  width: 3.5rem;
  will-change: transform;
  z-index: 99999;
  display: none;
  border: 0;
  svg {
    fill: #fff;
    height: 2rem;
    margin-top: 12px;
    margin-left: 12px;
    width: 2rem;
  }
  @media screen and (max-width: 768px) {
    display: block;
  }
}
</style>
