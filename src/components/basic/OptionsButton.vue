<template>
  <button>
    <slot />
  </button>
</template>

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
  background: #107292;
  &.active {
    background: #107292;
  }
  &:hover {
    background: #236f86;
  }
}
</style>
