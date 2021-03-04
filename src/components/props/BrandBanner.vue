<template>
  <div class="version-container">
    <HireUs />
  </div>
</template>

<script setup>
import HireUs from './HireUs.vue'
</script>

<style scoped lang="scss">
.version-container {
  border-top: 1px solid rgba(68, 68, 68, 0.5);
  padding-top: 15px;
  margin-top: 15px;
}

@media screen and (max-width: 768px) {
  .hire-us,
  .version {
    display: none;
  }
}
</style>
