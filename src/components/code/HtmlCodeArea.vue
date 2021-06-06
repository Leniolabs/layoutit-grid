<template>
  <span
    :class="[
      'area-tree',
      {
        reordering: reordering && reordering.target === area && !(reordering.target === mainArea && !reordering.after),
        after: reordering && reordering.target === area && reordering.after,
        'reorder-hint': area !== mainArea && area === currentArea && !reordering,
        first: area.parent && area.parent.children.indexOf(area) === 0,
        last: area.parent && area.parent.children.indexOf(area) === area.parent.children.length - 1,
      },
    ]"
    :style="{
      opacity: reordering && reordering.area === area ? 0.3 : 1,
    }"
    :draggable="area !== mainArea"
    @dragstart="onDragStart(area, $event)"
    @dragend="onDragEnd(area)"
    @drop="onDrop(area, $event)"
    @dragover="onDragOver(area, $event)"
    @click.stop="currentArea = area"
    ><span v-if="true || reordering" class="area-pad"></span
    ><span v-if="area === currentArea && !(!area.parent && !area.children.length)" class="selected"></span
    >{{ `${ident}${OPEN_TAG}` }}<span class="token tag">{{ elementTag }}</span
    ><template v-if="includeAreaInCSS(area)"
      >{{ ' ' }}<span class="token attr-name">class</span>="<CssCodeAreaName :area="area" />"</template
    >><span v-for="(a, i) in gridAreas" :key="`${i}-${a.id}`" :class="['area-children']" :data-area-name="a.name"
      >{{ '\n' }}<HtmlCodeArea :area="a" :options="options" :ident="ident + '  '" /></span
    >{{ `${gridAreas.length > 0 ? '\n' + ident : ''}${CLOSE_TAG}` }}<span class="token tag">{{ elementTag }}</span
    >></span
  >
</template>

<script setup>
import { defineProps, computed } from 'vue'
import { toCssName, getElementTag, includeAreaInCSS, getGridAreaWithNamedLines } from '../../utils.js'
import { mainArea, currentArea, reordering } from '../../store.js'
import CssCodeAreaName from './CssCodeAreaName.vue'

// <!--span class="drop-target" v-if="reordering && reordering.target === a && ! reordering.after">{{'>\n'}}</span-->
// <!--span class="drop-target" v-if="reordering && reordering.target === a && reordering.after">{{'\n>'}}</span-->
//  @click.stop="currentArea = area"
/*

*/

// name: 'HtmlCodeArea',
const props = defineProps({
  area: { type: Object, required: true },
  options: { type: Object, required: true },
  ident: { type: String, default: '' },
})
const OPEN_TAG = '<'
const CLOSE_TAG = '</'
const cssAreaName = computed(() => toCssName(props.area.name))
const elementTag = computed(() => getElementTag(props.area))

const gridAreas = computed(() => (props.area.display === 'grid' ? props.area.children : []))

function onDragStart(area, event) {
  if (area === mainArea.value) {
    return
  }
  event.stopPropagation()
  currentArea.value = area
  reordering.value = { area, reordering: null, after: true }
}

function areaIndex(area) {
  return area.parent.children.findIndex((a) => a === area)
}

function onDrop(areaTarget, event) {
  console.log('drop')
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
  areaTarget.parent.children = children
}

function onDragEnd(a) {
  console.log('end')
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
  if (!reordering.value) {
    return
  }
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
    console.log('after: ' + after)
  } else {
    reordering.value.target = null
  }
}
</script>

<style scoped lang="postcss">
.area-tree {
  position: relative;
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
  color: #ce9178;
  cursor: grab;
}

.token.tag,
.token.attr-name {
  cursor: pointer;
}
.reordering::after {
  position: absolute;
  top: -11.5px;
  color: #ce9178;
  content: '\27A4  \23AF\23AF\23AF\23AF\23AF\23AF\23AF\23AF\23AF\23AF\23AF\23AF';
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
  background-color: rgba(255, 255, 255, 0.123);
}
</style>
