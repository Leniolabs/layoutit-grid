<template>
  <div class="code-sidebar">
    <slot name="body" />
  </div>
</template>

<style scoped lang="scss">
.code-sidebar {
  position: relative;
  overflow: auto;
  text-align: left;
  color: #e9e9e9;
  z-index: 8;
  padding: 10px 10px 10px 0;
  @media (max-width: 769px) {
    display: none;
    opacity: 0;
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
