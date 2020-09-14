<template>
  <section
    ref="sectionElement"
    :class="{ active: isCurrent, dragging }"
    :style="{
      'grid-template-rows': grid.row.sizes.join(' '),
      'grid-template-columns': grid.col.sizes.join(' '),
      'grid-gap': grid.row.gap + ' ' + grid.col.gap,
      display: 'grid',
    }"
    class="grid"
  >
    <AreaEditor v-for="a in areasToShow" :key="`area-${a.name}`" :area="a" @edit="$refs.selection.editArea(a)" />

    <GridCell
      v-for="(section, i) in gridSections(grid)"
      :key="`section-${i}`"
      :area="area"
      :section="section"
      :grid-computed-styles="gridComputedStyles"
      :grayed="!isActive"
      :focused="
        trackFocus &&
        ((trackFocus.type == 'row' && trackFocus.n === section.row.start) ||
          (trackFocus.type == 'col' && trackFocus.n === section.col.start))
      "
      @down="$refs.selection.cellDown($event, section)"
      @move="$refs.selection.cellMove($event, section)"
      @togglelinename="$refs[$event].toggle()"
    >
      <LineName
        v-if="section.row.start === grid.row.sizes.length"
        :ref="`colLine-${section.col.start}`"
        :grid="grid"
        :pos="section.col.start"
        type="col"
      />

      <TrackSize
        v-if="isCurrent && section.row.start === grid.row.sizes.length"
        :grid="grid"
        type="col"
        :track="section.col.start"
        @focused="trackFocus = { type: 'col', n: section.col.start }"
        @blurred="trackFocus = null"
      />

      <LineName
        v-if="section.col.start === grid.col.sizes.length"
        :ref="`rowLine-${section.row.start}`"
        :grid="grid"
        :pos="section.row.start"
        type="row"
      />

      <TrackSize
        v-if="isCurrent && section.col.start === grid.col.sizes.length"
        :grid="grid"
        type="row"
        :track="section.row.start"
        @focused="trackFocus = { type: 'row', n: section.row.start }"
        @blurred="trackFocus = null"
      />
    </GridCell>

    <AreaSelection ref="selection" :area="area" @editstart="(a) => (editingArea = a)" @editend="editingArea = null" />
  </section>
</template>

<script setup="props, { el }">
export { default as GridCell } from './GridCell.vue'
export { default as AreaSelection } from './AreaSelection.vue'
export { default as LineName } from './LineName.vue'
export { default as TrackSize } from './TrackSize.vue'
export { default as AreaEditor } from '../area/AreaEditor.vue'

export { currentArea, dragging } from '../../store.js'
import { useIsCurrentArea, useIsActiveArea } from '../../composables/area.js'

export { gridSections } from '../../utils.js'

export default {
  props: {
    area: { type: Object, required: true },
  },
}

import { ref, computed, toRefs } from 'vue'

export const grid = computed(() => props.area.grid)

export const editingArea = ref(null)

export const areasToShow = computed(() => grid.value.areas.filter((a) => a !== editingArea.value))

export const trackFocus = ref(null)

const { area } = toRefs(props)
export const isCurrent = useIsCurrentArea(area)
export const isActive = useIsActiveArea(area)

export const sectionElement = ref(null)
export function gridComputedStyles() {
  return window.getComputedStyle(sectionElement.value)
}
</script>

<style scoped lang="scss">
.grid {
  touch-action: none;
  height: 100%;
  position: relative;
  background: #300548;
  overflow: hidden;
  border-radius: 2px;
  user-select: none;
  padding-right: 0px;
  padding-bottom: 0px;
  &.dragging section:hover {
    background: #fff;
  }
}
</style>
