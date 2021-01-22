<template>
  <div>
    <a
        target="_blank"
      class="hire-us"

        rel="noopener"
        href="https://www.leniolabs.com/services/team-augmentation/?utm_source=layoutit&utm_medium=banner&utm_campaign=leniolabs&utm_content=grid_banner"
        >Hire our front-end team!</a>     
    <a
      target="_blank"
      rel="noopener"
      href="https://www.leniolabs.com/services/team-augmentation/?utm_source=layoutit&utm_medium=banner&utm_campaign=leniolabs&utm_content=grid_banner"
      >Crafted with ♥ by Leniolabs</a>
 
</div>

</template>

<style scoped lang="scss">
div {
    .hire-us {
      border-radius: 30px;
      border-top-left-radius: 0;
      border-bottom-left-radius: 0;
      text-align: center;
      margin: 0 0 5px;
      display: block;
      text-decoration: none;
      color: #aaa;
          font-weight: normal;
    font-size: 13px;
    text-shadow: none;
    font-family: Consolas, Monaco, "Andale Mono", "Ubuntu Mono", monospace;
    }
  .hire-us + a{
    flex: 1;
    display: block;
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
    &:hover {
      background: var(--color-hire-us-active);
    }    
  }
}

</style>
