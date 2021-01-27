<template>
  <div class="version">
    <select>
      <option selected>v2.0</option>
      <option>v1.0</option>
    </select>
  </div>
</template>

<style scoped lang="scss">
.version {
  float: left;
  margin: 15px 0 15px -2px;
  select {
    color: #aaa;
    font-weight: 700;
    font-family: monospace;
    font-size: 12px;
    font-style: normal;
    border: 0;
    background: transparent;
    -webkit-appearance: none;
    appearance: none;
    width: 50px;
    cursor: pointer;
    &:hover {
      color: #fff;
    }
  }
}
</style>
