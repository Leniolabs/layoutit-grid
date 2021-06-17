<template>
  <div>
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 143.5 143.5">
      <path fill="#fff" d="M143.5 143.5H0V0h143.5v35.8h-7.2V7.3H7.3v129h129v-29.8h7.2z" />
      <g fill="#fff"><path d="M62.1 85.4H80v6H54.7V53.1h7.4v32.3zM110.4 97.1h-24v-5.7h24v5.7z" /></g>
      <circle fill="#30AAB3" cx="26.4" cy="27.3" r="8.3" />
    </svg>
    <div class="links-wrapper">
      <a
        target="_blank"
        class="hire-us"
        rel="noopener"
        href="https://www.leniolabs.com/services/team-augmentation/?utm_source=layoutit&utm_medium=banner&utm_campaign=leniolabs&utm_content=grid_banner"
        >Crafted with <span>♥</span> by Leniolabs_</a
      >
      <a
        target="_blank"
        class="hire-us-btn"
        rel="noopener"
        href="https://www.leniolabs.com/services/team-augmentation/?utm_source=layoutit&utm_medium=banner&utm_campaign=leniolabs&utm_content=grid_banner"
        >Hire our front end team!</a
      >
    </div>
  </div>
</template>

<style scoped lang="postcss">
div {
  svg {
    width: 65px;
    opacity: 0.8;
    margin: 7px 0 7px 10px;
  }
  .links-wrapper {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding-right: 15px;
  }
  .hire-us {
    border-radius: 30px;
    border-top-left-radius: 0;
    border-bottom-left-radius: 0;
    text-align: center;
    display: block;
    text-decoration: none;
    color: var(--color-gray);
    font-weight: normal;
    font-size: 13px;
    text-shadow: none;
    font-family: Consolas, Monaco, 'Andale Mono', 'Ubuntu Mono', monospace;
    flex: 1;
    margin-bottom: 10px;
    span {
      color: var(--color-hire-us);
    }
  }
  .hire-us + a {
    flex: 1;
    display: block;
    background: var(--color-hire-us);
    border-radius: 30px;
    color: var(--color-white);
    display: block;
    font-size: 0.9rem;
    letter-spacing: 0.2px;
    padding: 8px 20px;
    text-decoration: none;
    text-align: center;
    transition: all 0.2s ease-in-out;
    text-shadow: rgba(var(--color-black-rgb), 0.3) 0 1px 1px;
    max-width: max-content;
    margin-bottom: 0;
    &:hover {
      background: var(--color-hire-us-active);
    }
  }
}
</style>
