<template>
  <div class="version">
    <span
      ><a
        target="_blank"
        rel="noopener"
        href="https://www.leniolabs.com/services/team-augmentation/?utm_source=layoutit&utm_medium=banner&utm_campaign=leniolabs&utm_content=grid_banner"
        >Hire us!</a
      ></span
    >
    <span class="version-text">v2.0.0</span>
  </div>
</template>

<style scoped lang="scss">
.version {
  align-items: flex-end;
  color: #ccc;
  display: flex;
  justify-content: space-between;
  font-weight: 700;
  font-family: monospace;
  padding: 6px 14px;
  text-align: center;
  a {
    text-decoration: none;
    color: #ccc;
    font-size: 0.9rem;
    &:hover {
      color: #fff;
    }
  }
  .version-text {
    font-size: 0.7rem;
    &:hover {
      color: #fff;
    }
  }
}
</style>
