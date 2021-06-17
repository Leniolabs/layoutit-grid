<template>
  <button>
    <slot />
  </button>
</template>

<style scoped lang="postcss">
button {
  width: 100%;
  border: 0;
  cursor: pointer;
  height: 1.875rem;
  border-radius: 30px;
  font-size: 1rem;
  letter-spacing: 0.2px;
  min-height: 2.188em;
  min-width: 2.188em;
  margin-bottom: 0.626em;
  padding: 0.313em 9px;
  text-shadow: rgba(var(--color-black-rgb), 0.3) 0 1px 1px;
  color: var(--color-white);
  background: var(--color-add);
  &.active {
    background: var(--color-green);
  }
  &:hover {
    background: var(--color-add-active);
  }
}
</style>
