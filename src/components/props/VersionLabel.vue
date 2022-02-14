<template>
  <div class="version">
    <select data-testid="version-selector" @change="onChange">
      <option selected>v2</option>
      <option>v1</option>
    </select>
  </div>
</template>

<script setup>
function onChange(event) {
  if (event.target.value === 'v1') {
    event.target.value = 'v2'
    window.location.href = 'https://grid-v1.layoutit.com'
  }
}
</script>
<style scoped lang="postcss">
.version {
  float: left;
  position: relative;
  margin: 15px 0 15px -2px;
  &:after {
    content: '';
    width: 0;
    height: 0;
    border-style: solid;
    border-width: 4px 4px 0 4px;
    position: absolute;
    top: 9px;
    right: 8px;
    border-color: var(--color-gray-middle) transparent transparent transparent;
  }
  select {
    color: var(--color-gray);
    font-weight: 700;
    font-family: monospace;
    font-size: 12px;
    font-style: normal;
    border: 0;
    background: var(--color-gray-darkest);
    -webkit-appearance: none;
    appearance: none;
    width: 40px;
    cursor: pointer;
    &:hover {
      color: var(--color-gray-lightest);
    }
  }
}
</style>
