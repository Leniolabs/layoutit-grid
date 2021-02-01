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
  position: relative;
  margin: 15px 0 15px -2px;
  &:after {
    content: "";
    width: 0;
    height: 0;
    border-style: solid;
    border-width: 4px 4px 0 4px;
    position: absolute;
    top: 9px;
    right: 8px;
    border-color: #555 transparent transparent transparent;
  }  
  select {
    color: #aaa;
    font-weight: 700;
    font-family: monospace;
    font-size: 12px;
    font-style: normal;
    border: 0;
    background: #1e1e1e;
    -webkit-appearance: none;
    appearance: none;
    width: 50px;
    cursor: pointer;
    &:hover {
      color: #eee;
    }
  }
}
</style>
