<template>
  <button>
    <slot />
  </button>
</template>

<style scoped lang="scss">
button {
  width: 100%;
  border: 0;
  cursor: pointer;
  height: 1.875rem;
  border-radius: 30px;
  font-size: 1rem;
  letter-spacing:0.2px;
  min-height: 2.188em;
  min-width: 2.188em;
  margin-bottom: 0.626em;
  padding: 0.313em 9px;
  text-shadow:rgba(0,0,0,0.3) 0 1px 1px;
  color: #fff;
  background: var(--color-add);
  &.active {
    background: #27ae60;
  }
  &:hover {
    background: var(--color-add-active);
  }
}
</style>
