<template>
  <div class="area-tree">
    <!--
    <div v-if="currentArea !== area" class="area-name">{{ area.name }}</div>
    <div v-else></div>-->

    <div
      :class="['area-name', { 'has-display': area.flex || area.grid, current: currentArea === area }]"
      @click="currentArea = area"
    >
      {{ area.name }}
    </div>
    <AreaTree v-for="a in area.children" :key="`area-${a.name}`" :area="a" />
  </div>
</template>

<script setup="props">
export { default as FlexOptions } from './FlexOptions.vue'
export { default as GridOptions } from './GridOptions.vue'

import { ref, computed } from 'vue'
export { currentArea, currentView } from '../../store.js'
export { gridRegionToGridArea } from '../../utils.js'

import { getAreaDepth } from '../../store.js'

export const depth = computed(() => getAreaDepth(props.area) * 10 + 'px')

export default {
  name: 'AreaTree',
  props: {
    area: { type: Object, required: true },
  },
}

export const showOptions = ref(true)

export const currentGrid = computed(() => props.area.grid)
export const currentFlex = computed(() => props.area.flex)
</script>

<style scoped lang="scss" vars="{ depth }">
.area-name {
  background: #fdd835;
  color: #333;
  border-bottom: 1px solid black;
  padding: 5px 8px;
  top: 0;
  left: var(--depth);
  width: calc(100% - var(--depth));
  word-break: break-all;
  position: relative;
  border-radius: 2px;
  font-weight: bold;
  &:not(.current) {
    opacity: 0.5;
  }
}
</style>
