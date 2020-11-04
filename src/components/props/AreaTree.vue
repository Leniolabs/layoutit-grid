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
        v-if="area.display !== 'block'"
        aria-label="Add area"
        class="btn-add"
        title="Add Area"
        @click="addImplicitArea"
      >
        <IconAdd />
      </button>
      <button aria-label="Remove area" class="btn-remove" title="Remove Area" @click="removeArea(area)">
        <IconRemove />
      </button>
    </div>
    <AreaTree v-for="a in area.children" :key="`area-${a.name}`" :area="a" />
  </div>
</template>

<script setup="props">
export { default as IconAdd } from '../icons/IconAdd.vue'
export { default as IconRemove } from '../icons/IconRemove.vue'

import { ref, computed } from 'vue'
export { currentArea, removeArea, createAreaState, getRandomColor } from '../../store.js'

import { getAreaDepth } from '../../store.js'
import { getRandomColor } from '../../store/area'

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

const counter = ref(1)
export function addImplicitArea() {
  props.area.children.push(
    createAreaState({
      name: 'a' + counter.value++,
      parent: props.area,
      color: getRandomColor(),
    })
  )
}
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

.btn-remove,
.btn-add {
  position: absolute;
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
  svg {
    height: 10px;
    width: 10px;
    fill: white;
  }
}

.btn-remove {
  top: 5px;
  height: 16px;
  right: 5px;
  width: 16px;
  &:hover {
    background: #c2185b;
  }
}

.btn-add {
  top: 5px;
  height: 16px;
  right: 25px;
  width: 16px;
  padding: 4px;
  svg {
    height: 8px;
    width: 8px;
  }
  &:hover {
    background: green;
  }
}
</style>
