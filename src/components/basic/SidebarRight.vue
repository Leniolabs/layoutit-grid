<template>
  <div class="right-sidebar-container">
    <div class="right-sidebar-content">
      <div class="right-sidebar-body">
        <slot name="body" />
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.right-sidebar-container {
  flex: 0 1 auto;
  display: flex;
  width: auto;
  max-width: 390px;
  min-width: 390px;
  position: relative;
  left: auto;
  right: auto;
  overflow: auto;
  text-align: left;
  color: #e9e9e9;
  width: auto;
  z-index: 8;
  margin-left: 10px;
  @media (max-width: 769px) {
    display: none;
    opacity: 0;
  }
  .right-sidebar-backdrop {
    position: fixed;
    top: 0;
    left: 0;
    bottom: 0;
    right: 0;
    background: rgba(0, 0, 0, 0.5);
    z-index: -1;
  }
  .right-sidebar-content {
    position: relative;
    width: 100%;
    background: transparent;
    border-radius: 0px;
    transition: 1s width;
    .right-sidebar-body {
      padding: 0px 5px 0px 5px;
      height: 100%;
    }
    .right-sidebar-body > div {
      height: 100%;
    }
    @media (max-width: 769px) {
      max-width: initial;
    }
  }
}

fieldset {
  border: 0;
  padding: 0;
  margin: 0;
}
</style>
