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
  padding: 0;
    max-height: 35px;
    margin-top: 20px;  
}

@media screen and (max-width: 768px) {
  .hire-us,
  .version {
    display: none;
  }
}
</style>
