<template>
  <div class="version-container">

    <VersionLabel />
    <HireUs />
  </div>
</template>

<script setup>
import VersionLabel from './VersionLabel.vue'
import HireUs from './HireUs.vue'
</script>

<style scoped lang="scss">
.version-container {
  padding: 0 10px;
    max-height: 60px;
    margin-top: 20px;  
}

@media screen and (max-width: 768px) {
  .hire-us,
  .version {
    display: none;
  }
}
</style>
