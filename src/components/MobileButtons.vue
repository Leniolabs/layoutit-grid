<template>
  <div class="mobile-buttons">
    <div class="mobile-button" @click="$emit('toggle-props')">
      <IconSidebar />
    </div>
    <div class="mobile-button" @click="$emit('toggle-code')">
      <IconSubgrid />
    </div>
  </div>
</template>

<style scoped lang="postcss">
.mobile-buttons {
  display: none;
  z-index: 90000;
  width: 100%;
  padding: 1em;

  .mobile-button {
    background-color: var(--color-add);
    border-radius: 50%;
    box-shadow: 0 3px 6px rgba(var(--color-black-rgb), 0.16), 0 3px 6px rgba(var(--color-black-rgb), 0.23);
    cursor: pointer;
    height: 3.5rem;
    width: 3.5rem;
    will-change: transform;
    border: 0;
    svg {
      z-index: 9;
      fill: var(--color-white);
      height: 2rem;
      margin-top: 12px;
      margin-left: 12px;
      width: 2rem;
    }
  }

  @media screen and (max-width: 768px) {
    display: flex;
    justify-content: space-between;
    min-height: 4em;
  }
}
</style>
