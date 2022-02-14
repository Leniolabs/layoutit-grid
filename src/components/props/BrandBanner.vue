<template>
  <div class="version-container">
    <HireUs />
  </div>
</template>

<style scoped lang="postcss">
.version-container {
  border-top: 1px solid rgba(var(--color-gray-dark-rgb), 0.5);
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 10px 15px;
  > div {
    display: flex;
    align-items: center;
    justify-content: space-between;
    > * {
      flex: 1;
    }
  }
}

@media screen and (max-width: 768px) {
  .hire-us,
  .version {
    display: none;
  }
}
</style>
