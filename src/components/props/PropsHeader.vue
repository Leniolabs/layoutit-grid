<template>
  <div :class="['header']">
    <div class="mobile-button" @click="$emit('toggle-props')">
      <IconSidebar />
    </div>
    <BrandLogo />
    <div class="mobile-button" @click="$emit('toggle-code')">
      <IconSubgrid />
    </div>
  </div>
</template>

<style scoped lang="postcss">
.header {
  z-index: 20000;
  color: var(--color-white);
  overflow: auto;
  padding: 0;
  text-align: left;
  user-select: none;
  display: none;
  width: 100%;
  height: 48px;
  @media screen and (max-width: 768px) {
    position: fixed;
    top: 0;
    background: var(--color-gray-darkest);
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    a.brand {
      display: none;
    }
  }
}

.mobile-button {
  cursor: pointer;
  height: 2rem;
  width: 2rem;
  will-change: transform;
  border: 0;
  margin: 0 0.25rem;
  svg {
    z-index: 9;
    fill: var(--color-white);
    height: 1.5rem;
    margin-top: 0.25rem;
    margin-left: 0.25rem;
    width: 1.5rem;
  }
}
</style>
