<template>
  <div class="right-sidebar-container">
    <div class="right-sidebar-content">
      <div class="right-sidebar-body">
        <slot name="body" />
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'SidebarRight'
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
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
    .button {
      background: #6b16a1;
      border: 0;
      border-radius: 50px;
      color: #fff;
      cursor: pointer;
      display: inline-block;
      font-family: inherit;
      font-size: 1em;
      text-align: center;
      padding: 0.625em 1em;
      margin: 0 auto;
      &.btn-close {
        float: right;
        &:hover {
          background: #444;
        }
      }
      &.btn-default {
        background: #b4bcc8;
      }
      &.codepen-btn {
        background: #333;
        &:hover {
          background: #444;
        }
      }
    }
    .right-sidebar-header {
      position: relative;
      padding: 15px 20px;
      border-bottom: 1px dashed #aaa;
      h1 {
        margin: 0;
        font-size: 27px;
        font-weight: 500;
      }
      .right-sidebar-close {
        position: absolute;
        border: 0;
        background: 0;
        top: 10px;
        right: 10px;
        font-size: 24px;
        color: #aaa;
        display: none;
        cursor: pointer;
        &:hover {
          color: #000;
        }
        @media (max-width: 769px) {
          display: block;
        }
      }
    }
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
