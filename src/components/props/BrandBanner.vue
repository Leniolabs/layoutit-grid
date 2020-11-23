<template>
  <div class="version-container">
    <a
      class="btn-github"
      rel="noopener"
      target="_blank"
      aria-label="View source on GitHub"
      href="https://github.com/Leniolabs/layoutit-grid"
    >
    </a>
    <VersionLabel />
    <HireUs />
  </div>
</template>

<script setup="props">
export { default as VersionLabel } from './VersionLabel.vue'
export { default as HireUs } from './HireUs.vue'
</script>

<style scoped lang="scss">
.version-container {
  padding: 0 10px;
}

@media screen and (max-width: 768px) {
  .hire-us,
  .version {
    display: none;
  }
}
</style>
