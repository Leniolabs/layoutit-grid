<template>
  <section
    :class="{ active: isActive, dragging }"
    :style="{
      'grid-template-rows': grid.row.sizes.join(' '),
      'grid-template-columns': grid.col.sizes.join(' '),
      'grid-gap': grid.row.gap + ' ' + grid.col.gap,
      display: 'grid'
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
      @removearea="removeArea(area)"
    />

    <cell
      v-for="(section, i) in sections"
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
    </cell>

    <area-selection ref="selection" :area="area" />
  </section>
</template>

<script>
import IconRemove from '../icons/icon-remove.vue'
import IconClear from '../icons/icon-clear.vue'
import IconSubgrid from '../icons/icon-subgrid.vue'

import Cell from './Cell.vue'
import AreaSelection from './AreaSelection.vue'
import AreaEditor from '../AreaEditor.vue'
import LineName from './LineName.vue'

import { store } from '../../store.js'
import { gridSections } from '../../utils.js'

export default {
  name: 'GridEditor',
  components: { IconRemove, IconClear, IconSubgrid, Cell, AreaSelection, AreaEditor, LineName },
  props: {
    area: { type: Object, required: true },
    currentArea: { type: Object, required: true },
    currentItem: { type: Number, default: null },
    parentActive: { type: Boolean, default: false }
  },
  computed: {
    grid() {
      return this.area.grid
    },
    isActive() {
      return this.area.name === this.currentArea.name
    },
    sections() {
      return gridSections(this.grid)
    },
    dragging() {
      return store.data.dragging
    }
  },
  methods: {
    gridComputedStyles() {
      return window.getComputedStyle(this.$el)
    },
    removeArea(area) {
      const { areas } = this.grid
      areas.splice(areas.indexOf(area), 1)
    }
  }
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
