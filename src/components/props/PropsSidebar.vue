<template>
  <div>
    <div class="sidebar">
      <brand-logo />

      <div v-if="currentArea !== area" class="area-name">{{ currentArea.name }}</div>

      <flex-options v-if="currentFlex" :flex="currentFlex" :current-item="currentItem" />

      <grid-options v-if="currentGrid" :grid="currentGrid" />

      <hire-us />
      <version-label />
    </div>
  </div>
</template>

<script setup="props">
import { computed } from 'vue'
import VersionLabel from './VersionLabel.vue'
import BrandLogo from './BrandLogo.vue'
import HireUs from './HireUs.vue'
import FlexOptions from './FlexOptions.vue'
import GridOptions from './GridOptions.vue'

export default {
  components: {
    VersionLabel,
    BrandLogo,
    HireUs,
    FlexOptions,
    GridOptions,
  },
  props: {
    area: { type: Object, required: true },
    currentArea: { type: Object, required: true },
    currentItem: { type: Number, default: null },
  },
}

export const currentGrid = computed(() => props.currentArea.grid)
export const currentFlex = computed(() => props.currentArea.flex)
</script>

<style scoped lang="scss">
.area-name {
  background: #fdd835;
  color: #333;
  padding: 8px 10px;
  top: 0;
  left: 0;
  width: 100%;
  word-break: break-all;
  position: relative;
  border-radius: 2px;
  font-weight: bold;
  &:after {
    content: '';
    bottom: -24px;
    right: 10px;
    position: absolute;
    width: 0;
    height: 0;
    border-style: solid;
    border-width: 12px 10px;
    border-color: #fdd835 transparent transparent;
  }
  &:before {
    content: 'Editing area: ';
    font-weight: normal;
  }
}

.sidebar {
  position: fixed;
  left: 0;
  top: 0;
  bottom: 0;
  width: 14em;
  padding: 0 10px;
  color: #fff;
  height: 100vh;
  text-align: left;
  font-family: 'Alegreya Sans', 'Helvetica Neue', Arial, sans-serif;
  z-index: 9;
  transition: transform 0.2s ease-in;
  overflow: auto;

  @media screen and (max-width: 768px) {
    transform: translateX(-14em);
    background: #300748;
    top: 40px;
    padding-top: 20px;
    a.brand {
      display: none;
    }
    &.active {
      transform: translateX(0);
    }
  }
}

.hire-us {
  position: fixed;
  bottom: 5px;
  left: 10px;
}

.version {
  position: fixed;
  bottom: 5px;
  left: 80px;
}
</style>
