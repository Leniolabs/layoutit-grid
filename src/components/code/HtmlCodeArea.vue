<template>
  <span
    :class="[
      'area-tree',
      {
        reordering: reordering && reordering.target === area && !(reordering.target === mainArea && !reordering.after),
        after: reordering && reordering.target === area && reordering.after,
        'reorder-hint': area === currentArea && canReorder(area),
        'can-reorder': canReorder(area),
        first: area.parent && area.parent.children.indexOf(area) === 0,
        last: area.parent && area.parent.children.indexOf(area) === area.parent.children.length - 1,
      },
    ]"
    :style="{
      opacity: reordering && reordering.area === area ? 0.3 : 1,
    }"
    :draggable="canReorder(area)"
    @dragstart="onDragStart(area, $event)"
    @dragend="onDragEnd(area, $event)"
    @drop="onDrop(area, $event)"
    @dragover="onDragOver(area, $event)"
    @click.stop="currentArea = area"
    ><span v-if="reordering" class="area-pad"></span
    ><span v-if="area === currentArea && !(!area.parent && !area.children.length)" class="selected"></span
    >{{ `${ident}${OPEN_TAG}` }}<span class="token tag">{{ elementTag }}</span
    ><template v-if="includeAreaInCSS(area)"
      >{{ ' ' }}<span class="token attr-name">class</span>="<CssCodeAreaName :area="area" />"</template
    >><span v-for="a in gridAreas" :key="a.id" :data-area-id="a.id" :class="['area-children']" :data-area-name="a.name"
      >{{ '\n' }}<HtmlCodeArea :area="a" :options="options" :ident="ident + '  '" /></span
    >{{ `${gridAreas.length > 0 ? '\n' + ident : ''}${CLOSE_TAG}` }}<span class="token tag">{{ elementTag }}</span
    >></span
  >
</template>

<script setup lang="ts">
import { toCssName, getElementTag, includeAreaInCSS } from '../../utils.js'
import { useAppState } from '../../store.js'

let { mainArea, currentArea, reordering, selection } = $(useAppState())

// <!--span class="drop-target" v-if="reordering && reordering.target === a && ! reordering.after">{{'>\n'}}</span-->
// <!--span class="drop-target" v-if="reordering && reordering.target === a && reordering.after">{{'\n>'}}</span-->
//  @click.stop="currentArea = area"
/*

*/
const {
  area,
  options,
  ident = '',
} = defineProps<{
  area
  options
  ident?: string
}>()

const OPEN_TAG = '<'
const CLOSE_TAG = '</'
let cssAreaName = $computed(() => toCssName(area.name))
let elementTag = $computed(() => getElementTag(area))

let gridAreas = $computed(() => (area.display === 'grid' ? area.children : []))

const canReorder = (area) => {
  return area !== mainArea && !reordering && !(area.parent === mainArea && mainArea.children.length === 1)
}

function onDragStart(area, event) {
  if (!canReorder(area)) {
    return
  }
  event.stopPropagation()
  if (event.dataTransfer) {
    event.dataTransfer.effectAllowed = 'move'
  }
  currentArea = area
  selection = null
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
  const i = children.findIndex((a) => a === areaTarget)
  children.splice(reordering.after ? i + 1 : i, 0, areaFrom)
  if (!sameParent) {
    areaFrom.parent = areaTarget.parent
  }
  areaTarget.parent.children = children
}

function onDragEnd(a, event) {
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
  if (!reordering) {
    return
  }
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
    if (event.dataTransfer) {
      event.dataTransfer.dropEffect = 'move'
    }
  } else {
    reordering.target = null
  }
}
</script>

<style scoped lang="postcss">
.area-tree {
  position: relative;
  transition: opacity 0.5s;
}

.area-pad {
  position: absolute;
  top: -2px;
  bottom: -2px;
  left: -4px;
  width: 328px;
}

.first .area-pad {
  top: -10px;
}
.last .area-pad {
  bottom: -22px;
}

.reorder-hint::after {
  content: '\2195';
  position: absolute;
  left: 0px;
  top: -2px;
  color: var(--color-orange);
  cursor: grab;
}

.can-reorder {
  cursor: grab;
}

.token.tag,
.token.attr-name {
  cursor: pointer;
}
.reordering::after {
  position: absolute;
  top: -11.5px;
  color: var(--color-orange);
  content: '\27A4  ——————————';
  left: 0px;
}
.after::after {
  top: 7.5px;
}

.selected {
  pointer-events: none;
  position: absolute;
  left: -5px;
  height: 20px;
  width: 330px;
  background-color: rgba(var(--color-white-rgb), 0.123);
}
</style>
