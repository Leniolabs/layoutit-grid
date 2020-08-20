<template>
  <section
    ref="sectionElement"
    :class="{ active: isActive, dragging }"
    :style="{
      'grid-template-rows': grid.row.sizes.join(' '),
      'grid-template-columns': grid.col.sizes.join(' '),
      'grid-gap': grid.row.gap + ' ' + grid.col.gap,
      display: 'grid',
    }"
    class="grid"
  >
    <area-editor
      v-for="(area, i) in grid.areas"
      :key="`area-${i}`"
      :area="area"
      :current-area="currentArea"
      :current-item="currentItem"
      :parent-active="parentActive"
    />

    <grid-cell
      v-for="(section, i) in gridSections(grid)"
      :key="`section-${i}`"
      :area="area"
      :section="section"
      :grid-computed-styles="gridComputedStyles"
      :grayed="!parentActive"
      @down="$refs.selection.cellDown($event, section)"
      @move="$refs.selection.cellMove($event, section)"
      @togglelinename="$refs[$event].toggle()"
    >
      <line-name
        v-if="grid && section.row.start === grid.row.sizes.length"
        :ref="`colLine-${section.col.start}`"
        :grid="grid"
        :pos="section.col.start"
        type="col"
      />

      <line-name
        v-if="grid && section.col.start === grid.col.sizes.length"
        :ref="`rowLine-${section.row.start}`"
        :grid="grid"
        :pos="section.row.start"
        type="row"
      />
    </grid-cell>

    <area-selection ref="selection" :area="area" />
  </section>
</template>

<script setup="props, { el }">
import GridCell from './GridCell.vue'
import AreaSelection from './AreaSelection.vue'
import LineName from './LineName.vue'

import { store } from '../../store.js'

export { gridSections } from '../../utils.js'
import { defineAsyncComponent } from 'vue'

export default {
  components: {
    GridCell,
    AreaSelection,
    LineName,
    // See Circular References Between Components @ Vue docs
    AreaEditor: defineAsyncComponent(() => import('../area/AreaEditor.vue')),
  },
  props: {
    area: { type: Object, required: true },
    currentArea: { type: Object, required: true },
    currentItem: { type: Number, default: null },
    parentActive: { type: Boolean, default: false },
  },
}

import { ref, computed } from 'vue'

export const grid = computed(() => props.area.grid)

export const isActive = computed(() => props.area.name === props.currentArea.name)

export const { dragging } = store.data

export const sectionElement = ref(null)
export function gridComputedStyles() {
  return window.getComputedStyle(sectionElement.value)
}
</script>

<style scoped lang="scss">
@import '../css/area-button.scss';

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
