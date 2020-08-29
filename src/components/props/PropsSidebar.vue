<template>
  <div class="sidebar">
    <brand-logo />

    <div v-if="currentArea !== area" class="area-name">{{ currentArea.name }}</div>

    <flex-options v-if="currentFlex" :flex="currentFlex" :current-item="currentItem" />

    <grid-options v-if="currentGrid" :grid="currentGrid" />

    <hire-us />
    <version-label />
    <button :class="[ 'btn-dark', { active: darkmode } ]" @click="darkmode = !darkmode">
      <icon-dark />
    </button>
  </div>
</template>

<script setup="props">
import { computed } from 'vue'
import VersionLabel from './VersionLabel.vue'
import BrandLogo from './BrandLogo.vue'
import HireUs from './HireUs.vue'
import IconDark from '../icons/IconDark.vue'
import FlexOptions from './FlexOptions.vue'
import GridOptions from './GridOptions.vue'
export { currentArea, darkmode } from '../../store.js'

export default {
  components: {
    VersionLabel,
    BrandLogo,
    HireUs,
    IconDark,
    FlexOptions,
    GridOptions,
  },
  props: {
    area: { type: Object, required: true },
  },
}

export const currentGrid = computed(() => currentArea.value.grid)
export const currentFlex = computed(() => currentArea.value.flex)
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

  button.btn-dark {
    margin-bottom: 10px;
    background: #3094b4;
    color: #fff;
    border: 0;
    border-radius: 25px;
    cursor: pointer;
    height: 35px;
    width: 35px;
    padding: 10px;
    &.active {
      background: #27ae60;
    }
  }
}

.hire-us {
  position: fixed;
  bottom: 15px;
  left: 60px;
}

.version {
  position: fixed;
  bottom: 15px;
  left: 130px;
}

.btn-dark {
  position: fixed;
  bottom: 5px;
  left: 15px;
}
</style>
