<template>
  <button>
    <slot />
  </button>
</template>

<style scoped lang="postcss">
button {
  background: var(--color-teal);
  border: 0;
  border-radius: 3px;
  color: var(--color-white);
  cursor: pointer;
  line-height: 1;
  margin-bottom: 0.875em;
  padding: 8px 0;
  padding: 0.375em;
  font-size: 0.875rem;
  height: 1.875rem;
  width: 100%;
  transition: all 0.2s ease-in-out;
  &.active {
    background: var(--color-teal);
  }
  &:hover {
    background: var(--color-teal-dark);
  }
}
</style>
