<template>
  <button>
    <slot />
  </button>
</template>

<style scoped lang="scss">
button {
  background: #107292;
  border: 0;
  border-radius: 24px;
  color: #fff;
  cursor: pointer;
  line-height: 1;
  margin-bottom: 0.875em;
  padding: 8px 0; padding: 0.375em;
  font-size: 0.875rem;
  height: 1.875rem;  width: 100%;
  transition: all 0.2s ease-in-out;
  &.active {
    background: #107292;
  }
  &:hover {
    background: #236f86;
  }
}
</style>
