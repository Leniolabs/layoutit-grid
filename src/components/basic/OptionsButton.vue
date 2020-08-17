<template>
  <button>
    <slot />
  </button>
</template>

<script>
export default {
  name: 'OptionsButton'
}
</script>

<style scoped lang="scss">
button {
  width: 100%;
  margin-bottom: 10px;
  border: 0;
  border-radius: 2px;
  padding: 8px 0;
  font-size: 1rem;
  cursor: pointer;
  font-size: 0.875rem;
  height: 1.875rem;
  margin-bottom: 0.875em;
  padding: 0.375em;

  color: #fff;
  background: #3094b4;
  &.active {
    background: #3094b4;
  }
  &:hover {
    background: #236f86;
  }
}
</style>
