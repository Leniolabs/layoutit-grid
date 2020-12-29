<template>
  <div
    :class="['area-tree']"
    :style="{
      opacity: reordering && reordering.area === area ? 0.3 : 1,
    }"
  >
    <!--
    <div v-if="currentArea !== area" class="area-name">{{ area.name }}</div>
    <div v-else></div>-->

    <div
      :class="['area-name', { 'has-display': area.flex || area.grid, current: currentArea === area }]"
      @click="currentArea = area"
    >
      <span>.{{ area.name }}</span>
      <!--       <span
        :class="{ caret: area.children.length > 0, 'caret-down': showChildren }"
        @click="showChildren = !showChildren"
      ></span>       -->
      <button v-if="area.display !== 'block'" aria-label="Add area" class="btn-add" title="Add Area" @click="addArea">
        <IconRemove />
      </button>
      <button aria-label="Remove area" class="btn-remove" title="Remove Area" @click="removeArea(area)">
        <IconRemove />
      </button>
      <template v-if="showChildren">
        <div
          v-for="a in area.children"
          :key="`area-${a.name}-${depth}`"
          :class="[
            'area-children',
            {
              reordering: reordering && reordering.target === a,
              after: reordering && reordering.target === a && reordering.after,
            },
          ]"
          :data-area-name="a.name"
          :draggable="true"
          @dragstart="onDragStart(a, $event)"
          @dragend="onDragEnd(a)"
          @drop="onDrop(a, $event)"
          @dragover="onDragOver(a, $event)"
        >
          <AreaTree :area="a" />
        </div>
      </template>
    </div>
  </div>
</template>

<script setup>
import IconAdd from '../icons/IconAdd.vue'
import IconRemove from '../icons/IconRemove.vue'

import { defineProps, ref, computed } from 'vue'
import {
  mainArea,
  currentArea,
  removeArea,
  createAreaState,
  newAreaName,
  getRandomColor,
  reordering,
} from '../../store.js'

import { getAreaDepth } from '../../store.js'

const depth = computed(() => 10 + getAreaDepth(props.area) * 2 + 'px')

// name: 'AreaTree',

const props = defineProps({
  area: { type: Object, required: true },
})

function onDragStart(area, event) {
  event.stopPropagation()
  reordering.value = { area, reordering: null, after: true }
}

function areaIndex(area) {
  return area.parent.children.findIndex((a) => a === area)
}

function onDrop(areaTarget, event) {
  event.stopPropagation()
  const areaFrom = reordering.value.area
  const sameParent = areaTarget.parent === areaFrom.parent
  const children = sameParent ? areaTarget.parent.children.filter((a) => a !== areaFrom) : areaTarget.parent.children
  if (!sameParent) {
    areaFrom.parent.children = areaFrom.parent.children.filter((a) => a !== areaFrom)
  }
  const iFrom = areaIndex(areaFrom)
  const i = children.findIndex((a) => a === areaTarget)
  children.splice(reordering.value.after ? i + 1 : i, 0, areaFrom)
  if (!sameParent) {
    areaFrom.parent = areaTarget.parent
  }
  props.area.children = children
}

function onDragEnd(a) {
  reordering.value = null
}

function measure(el) {
  var rect = el.getBoundingClientRect(),
    scrollTop = window.pageYOffset || document.documentElement.scrollTop
  return { top: rect.top + scrollTop, height: rect.height }
}

function afterMiddleHeight(event) {
  const { top, height } = measure(event.target)
  return (event.clientY - top) / height > 0.5
}
function onDragOver(areaTarget, event) {
  event.stopPropagation()

  const areaFrom = reordering.value.area
  const after = afterMiddleHeight(event)
  let noop = false
  if (areaFrom.parent === areaTarget.parent) {
    const iFrom = areaIndex(areaFrom)
    const iTarget = areaIndex(areaTarget)
    if ((after && iFrom - iTarget === 1) || (!after && iTarget - iFrom === 1)) {
      noop = true
    }
  }
  if (areaTarget !== areaFrom && !noop) {
    event.preventDefault()

    reordering.value.target = areaTarget !== areaFrom ? areaTarget : null
    reordering.value.after = after
  } else {
    reordering.value.target = null
  }
}

const showChildren = ref(true)

const currentGrid = computed(() => props.area.grid)
const currentFlex = computed(() => props.area.flex)

function addArea() {
  props.area.children.push(
    createAreaState({
      name: newAreaName(),
      parent: props.area,
      color: getRandomColor(),
    })
  )
  showChildren.value = true
}
</script>

<style scoped lang="scss">
.area-tree {
  padding-left: v-bind(depth);
  color: rgb(212, 212, 212);
  font-size: 13px;
  text-shadow: none;
  font-family: Consolas, Monaco, 'Andale Mono', 'Ubuntu Mono', monospace;
  direction: ltr;
  text-align: left;
  white-space: pre;
  word-spacing: normal;
  word-break: normal;
  line-height: 1.5;
  tab-size: 4;
  hyphens: none;
  margin: 0px;
}

.area-children {
  pointer-events: initial;
  cursor: move;
}

:not(.after).reordering::before {
  margin-left: v-bind(depth);
  height: 10px;
  content: '>';
  opacity: 1;
  color: rgb(255, 255, 255);
}

.reordering.after::after {
  margin-left: v-bind(depth);
  height: 10px;
  color: rgb(255, 255, 255);
  opacity: 1;
  content: '>';
}

.area-name {
  width: 100%;
  word-break: break-all;
  position: relative;
  /*   &:not(.current) {
    opacity: 0.5;
  } */
}

/* Create the caret/arrow with a unicode, and style it */
.area-name > span::after {
  content: '{';
  display: inline-block;
  margin-left: 6px;
  color: #eee;
}
.area-name::after {
  content: '}';
  display: inline-block;
  margin-right: 6px;
  color: #eee;
}
.area-name > span {
  color: rgb(215, 186, 125);
}
.area-name .area-name > span {
  color: rgb(156, 220, 254);
}

.area-name .area-name:before,
.area-name .area-name:after,
.area-name .area-name > span::after {
  display: none;
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
  pointer-events: all;
  border-radius: 2px;
  padding-top: 3px;
  background: transparent;
  svg {
    height: 10px;
    width: 10px;
    stroke: rgb(215, 186, 125);
  }
}

.btn-remove {
  top: 0;
  height: 16px;
  right: 5px;
  width: 16px;
  &:hover {
    background: #c2185b;
  }
}

.btn-add {
  top: 0;
  height: 16px;
  right: 25px;
  width: 16px;
  padding: 4px;
  svg {
    height: 8px;
    width: 8px;
    transform: rotate(45deg);
  }
  &:hover {
    background: green;
  }
}
</style>
