<template>
  <span
    :class="['area-tree']"
    :style="{
      opacity: reordering && reordering.area === area ? 0.3 : 1,
    }"
    >{{ `${ident}${OPEN_TAG}` }}<span class="token tag">{{ elementTag }}</span
    >{{ ' ' }}<span class="token attr-name">class</span>="<span class="token attr-value">{{ cssAreaName }}</span
    >"><span
      v-for="(a, i) in gridAreas"
      :key="`${i}-${a.name}`"
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
      >{{ '\n' }} <HtmlCodeArea :area="a" :options="options" :ident="ident + '  '" /></span
    >{{ `${gridAreas.length > 0 ? '\n' + ident : ''}${CLOSE_TAG}` }}<span class="token tag">{{ elementTag }}</span
    >></span
  >
</template>

<script setup>
import { defineProps, computed } from 'vue'
import { toCssName, getElementTag } from '../../utils.js'
import { currentArea, reordering } from '../../store.js'

// <!--span class="drop-target" v-if="reordering && reordering.target === a && ! reordering.after">{{'>\n'}}</span-->
// <!--span class="drop-target" v-if="reordering && reordering.target === a && reordering.after">{{'\n>'}}</span-->
//  @click.stop="currentArea = area"

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
  console.log('start')
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
  props.area.children = children
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
  console.log('over')
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
</script>

<style scoped lang="scss">
.token.tag,
.token.attr-name {
  cursor: pointer;
}

.area-tree {
  position: relative;
}
</style>
