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

    <div :class="['area-name', { 'has-display': area.flex || area.grid, current: currentArea === area }]">
      <span :class="['name', { current: currentArea === area }]" @pointerdown="currentArea = area"
        >.{{ area.name }}</span
      >
      <span
        v-if="area.children.length > 0"
        :class="{ caret: area.children.length > 0, 'caret-down': showChildren }"
        @click="showChildren = !showChildren"
        >{{ showChildren ? ' &lt; ' : ' &gt; ' }}</span
      >
      <button v-if="area.display !== 'block'" aria-label="Add area" class="btn-add" title="Add Area" @click="addArea">
        <IconRemove />
      </button>
      <button aria-label="Remove area" class="btn-remove" title="Remove Area" @click="removeArea(area)">
        <IconRemove />
      </button>
      <template v-if="showChildren">
        <div
          v-for="a in area.children"
          :key="`area-${a.id}`"
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

<script setup lang="ts">
import { useAppState, removeArea, createAreaState, newAreaName, getRandomColor, getAreaDepth } from '../../store.js'

let { mainArea, currentArea, reordering } = $(useAppState())

let depth = $computed(() => 10 + getAreaDepth(area) * 2 + 'px')

// name: 'AreaTree',

const { area } = defineProps<{ area }>()

function onDragStart(area, event) {
  event.stopPropagation()
  currentArea = area
  reordering = { area, reordering: null, after: true }
}

function areaIndex(area) {
  return area.parent.children.findIndex((a) => a === area)
}

function onDrop(areaTarget, event) {
  event.stopPropagation()
  const areaFrom = reordering.area
  const sameParent = areaTarget.parent === areaFrom.parent
  const children = sameParent ? areaTarget.parent.children.filter((a) => a !== areaFrom) : areaTarget.parent.children
  if (!sameParent) {
    areaFrom.parent.children = areaFrom.parent.children.filter((a) => a !== areaFrom)
  }
  const iFrom = areaIndex(areaFrom)
  const i = children.findIndex((a) => a === areaTarget)
  children.splice(reordering.after ? i + 1 : i, 0, areaFrom)
  if (!sameParent) {
    areaFrom.parent = areaTarget.parent
  }
  area.children = children
}

function onDragEnd(a) {
  reordering = null
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

  const areaFrom = reordering.area
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

    reordering.target = areaTarget !== areaFrom ? areaTarget : null
    reordering.after = after
  } else {
    reordering.target = null
  }
}

let showChildren = $ref(true)

let currentGrid = $computed(() => area.grid)
let currentFlex = $computed(() => area.flex)

function addArea() {
  area.children.push(
    createAreaState({
      name: newAreaName(),
      parent: area,
      color: getRandomColor(),
    })
  )
  showChildren = true
}
</script>

<style scoped lang="postcss">
.area-tree {
  padding-left: v-bind(depth);
  color: var(--color-gray-lightest);
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
  color: var(--color-white);
}

.reordering.after::after {
  margin-left: v-bind(depth);
  height: 10px;
  color: var(--color-white);
  opacity: 1;
  content: '>';
}

.area-name {
  width: 100%;
  word-break: break-all;
  position: relative;
}

/* Create the caret/arrow with a unicode, and style it */
.area-name > span.name::after {
  content: '{';
  display: inline-block;
  color: var(--color-white);
  padding: 2px 0 1px 4px;
}
.area-name::after {
  content: '}';
  display: inline-block;
  margin-right: 6px;
  color: var(--color-white);
}
.area-name > span.name {
  color: var(--color-golden);
  padding: 2px 4px;
  padding-right: 0;
  cursor: pointer;
  &.current {
    background: var(--color-blue);
    color: var(--color-white);
    &:after {
      background: var(--color-black);
      padding: 2px 0 1px 4px;
    }
  }
}

:not(.has-display) {
  &.area-name > span.name {
    color: var(--color-blue-lightest);
    padding: 2px 4px;
    &.current {
      background: var(--color-blue);
      color: var(--color-white);
      &:after {
        background: var(--color-black);
        padding: 2px 0 1px 4px;
      }
    }
  }
  &.area-name:before,
  &.area-name:after,
  &.area-name > span.name::after {
    display: none;
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
  pointer-events: all;
  border-radius: 2px;
  padding-top: 3px;
  background: transparent;
  svg {
    height: 10px;
    width: 10px;
    stroke: var(--color-golden);
  }
}

.btn-remove {
  top: 0;
  height: 16px;
  right: 5px;
  width: 16px;
  &:hover {
    background: var(--color-magenta);
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
