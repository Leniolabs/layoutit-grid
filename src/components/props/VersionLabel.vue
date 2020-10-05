<template>
  <div class="version">
    <span>Hire us!</span>
    <span class="version-text">v1.2.3</span>
  </div>
</template>

<style scoped lang="scss">
.version {
  align-items: flex-end;
  color: #ccc;
  display: flex;
  justify-content: space-between;
  font-size: 1rem;
  font-family: monospace;
  padding: 6px 14px;
  text-align: center;
  z-index: 99;
  &:hover {
    color: #fff;
  }
  .version-text {
    font-size: 0.7rem;
  }
}
</style>
