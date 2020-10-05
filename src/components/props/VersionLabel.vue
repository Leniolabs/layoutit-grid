<template>
  <div class="version">
    <span>Hire us!</span>
    <span class="version-text">version 1.2.3</span>
  </div>
</template>

<style scoped lang="scss">
.version {
  align-items: flex-end;
  color: #ccc;
  display: flex;
  justify-content: space-around;
  font-size: 1rem;
  font-family: monospace;
  padding: 6px 0;
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
