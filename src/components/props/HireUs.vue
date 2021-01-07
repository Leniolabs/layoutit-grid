<template>
  <div>

    <a
      class="hire-us"
      target="_blank"
      rel="noopener"
      href="https://www.leniolabs.com/services/team-augmentation/?utm_source=layoutit&utm_medium=banner&utm_campaign=leniolabs&utm_content=grid_banner"
      >Crafted with ♥ by Leniolabs</a>
    <a
        target="_blank"
        rel="noopener"
        href="https://www.leniolabs.com/services/team-augmentation/?utm_source=layoutit&utm_medium=banner&utm_campaign=leniolabs&utm_content=grid_banner"
        >Hire us!</a>      
</div>

</template>

<style scoped lang="scss">
div {
  display: flex;
  a {
    flex: 1;
    display: block;
    min-width: max-content;
    background: var(--color-hire-us);
    border-radius: 30px;
    color: #fff;
    display: block;
    font-size: 0.9rem;
    letter-spacing: 0.2px;
    padding: 8px 20px;
    text-decoration: none;
    text-align: center;
    transition: all 0.2s ease-in-out;
    text-shadow: rgba(0, 0, 0, 0.3) 0 1px 1px;
    border-top-right-radius: 0;
    border-bottom-right-radius: 0;
    + a {
      border-radius: 30px;
      border-top-left-radius: 0;
      border-bottom-left-radius: 0;
      background: #951246;
    }
    &:hover {
      background: var(--color-hire-us-active);
    }    
  }
}

</style>
