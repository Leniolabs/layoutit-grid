<template>
  <div class="mobile-button" @click="$emit('click')">
    <icon-sidebar />
  </div>
</template>

<script setup>
import IconSidebar from './icons/IconSidebar.vue'

export default {
  components: {
    IconSidebar,
  },
}
</script>

<style scoped lang="scss">
.mobile-button {
  background-color: #300548;
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
    margin-top: 11px;
    width: 2rem;
  }
  @media screen and (max-width: 768px) {
    display: block;
  }
}
</style>
