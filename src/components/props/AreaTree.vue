<template>
  <div
    class="area-tree"
    :style="{
      'border-left': `4px solid ${area.color}`,
      'border-top': `2px solid ${area.color}`,
    }"
  >
    <!--
    <div v-if="currentArea !== area" class="area-name">{{ area.name }}</div>
    <div v-else></div>-->

    <div
      :class="['area-name', { 'has-display': area.flex || area.grid, current: currentArea === area }]"
      @click="currentArea = area"
    >
      {{ area.name }}
      <button
        v-show="!hasDisplay"
        aria-label="Remove area"
        class="btn-remove"
        title="Remove Area"
        @click="removeArea(area)"
      >
        <IconRemove />
      </button>
    </div>
    <AreaTree v-for="a in area.children" :key="`area-${a.name}`" :area="a" />
  </div>
</template>

<script setup="props">
export { default as FlexOptions } from './FlexOptions.vue'
export { default as GridOptions } from './GridOptions.vue'
export { default as IconRemove } from '../icons/IconRemove.vue'

import { ref, computed } from 'vue'
export { currentArea, removeArea } from '../../store.js'

import { getAreaDepth } from '../../store.js'

export const depth = computed(() => getAreaDepth(props.area) * 5 + 'px')

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
.area-tree {
  margin-bottom: 3px;
  margin-left: var(--depth);
  border-bottom: solid 1px #ddd;
  background: white;
}
.area-name {
  font-size: 13px;
  color: black;
  padding: 5px 8px;
  top: 0;
  width: 100%;
  word-break: break-all;
  position: relative;
  font-weight: bold;
  &:not(.current) {
    opacity: 0.5;
  }
}

.btn-remove {
  position: absolute;
  top: 5px;
  height: 16px;
  right: 5px;
  width: 16px;
  border: 0;
  line-height: 6px;
  margin-bottom: 5px;
  font-size: 8px;
  padding: 2px;
  cursor: pointer;
  background: #888;
  pointer-events: all;
  border-radius: 2px;
  padding-top: 3px;
  &:hover {
    background: #c2185b;
  }
  svg {
    height: 10px;
    width: 10px;
    fill: #888;
  }
}
</style>
