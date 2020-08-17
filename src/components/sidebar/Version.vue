<template>
  <div class="version">version 1.1.0</div>
</template>

<script>
export default {
  name: 'Version',
}
</script>

<style scoped lang="scss">
.version {
  color: #888;
  z-index: 99;
  font-size: 10px;
  font-family: monospace;
  width: 60px;
  text-align: center;
  padding: 6px 0;
  cursor: pointer;
  &:hover {
    color: #fff;
  }
}
</style>
