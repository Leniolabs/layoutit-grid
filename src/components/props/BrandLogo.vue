<template>
  <a href="https://layoutit.com/" rel="noopener" target="_blank" class="brand-logo">
    <img src="/img/icons/icon-128x128.png" alt />Layoutit! <VersionLabel/>
    
  </a>
</template>
<script setup>
import VersionLabel from './VersionLabel.vue'

</script>
<style scoped lang="scss">
.brand-logo {
  font-family: 'Alegreya Sans', 'Helvetica Neue', Arial, sans-serif;
  font-size: 22px;
  font-style: italic;
  font-weight: 700;
  letter-spacing: 0.02em;
  margin: 12px 10px;
  color: #fff;
  text-decoration: none;
  display: inline-block;
  vertical-align: top;
  img {
    margin: 0.1em 0.5em 0.1em 0;
    height: 1em;
    display: inline-block;
    vertical-align: top;
  }
}
</style>
