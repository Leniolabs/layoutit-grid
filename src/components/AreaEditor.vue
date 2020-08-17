<template>
  <section
    :class="{ grayed }"
    :style="{ 'grid-area': gridArea, 'border-color': area.color }"
    class="area-editor"
    @pointerdown="handleDown($event, area)"
  >
    <div
      v-if="!isMain"
      :style="{ top: 5 + toolbarStart * 32 + 'px', left: toolbarStart ? toolbarStart * 20 + 'px' : '5px' }"
      class="area-info"
    >
      <span
        :style="{ 'border-color': area.color }"
        class="area-name"
        title="Area Name"
      >{{ area.name }}</span>
      <button v-show="!hasDisplay" class="btn-subgrid" title="Add Sub Grid" @click="subGrid(area)">
        <icon-subgrid />
      </button>
      <!--<button v-show="!hasDisplay" class="btn-subgrid" @click="subFlex(area)"><icon-flex /></button>-->
      <button v-show="!hasDisplay" class="btn-remove" title="Remove Area" @click="removeArea(area)">
        <icon-remove />
      </button>
      <button v-show="hasDisplay" class="btn-remove" title="Clear Area" @click="clearArea(area)">
        <icon-clear />
      </button>
    </div>

    <grid-editor
      v-if="area.grid"
      :area="area"
      :current-area="currentArea"
      :current-item="currentItem"
      :parent-active="isActive || parentActive"
    />

    <flexit
      v-if="area.flex"
      :area="area"
      :current-area="currentArea"
      :current-item="currentItem"
      :parent-active="isActive || parentActive"
    />
  </section>
</template>

<script>
import { defineAsyncComponent } from 'vue'
import { store, createGridState, createFlexState } from '../store.js'
import { getGridArea } from '../utils.js'

import IconRemove from './icons/icon-remove.vue'
import IconClear from './icons/icon-clear.vue'
import IconSubgrid from './icons/icon-subgrid.vue'
import IconFlex from './icons/icon-flex.vue'
import Flexit from './flex/Flexit.vue'

export default {
  name: 'AreaEditor',
  components: {
    IconRemove,
    IconClear,
    IconSubgrid,
    IconFlex,
    Flexit,
    // See Circular References Between Components @ Vue docs
    GridEditor: defineAsyncComponent(() => import('./grid/GridEditor.vue'))
  },
  props: {
    area: { type: Object, required: true },
    currentArea: { type: Object, required: true },
    currentItem: { type: Number, default: null },
    parentActive: { type: Boolean, default: false }
  },
  computed: {
    gridArea() {
      return getGridArea(this.area)
    },
    isMain() {
      return this.area.name === store.data.area.name
    },
    isActive() {
      return this.area.name === this.currentArea.name
    },
    grayed() {
      return !(this.isActive || this.parentActive)
    },
    hasDisplay() {
      const { area } = this
      return area.grid || area.flex
    },
    toolbarStart() {
      const { area } = this
      return area.gridRegion
        ? area.gridRegion.col.start === 1 && area.gridRegion.row.start === 1
          ? store.getAreaDepth(area) - 1
          : 0
        : 0
    }
  },
  methods: {
    clearArea(area) {
      area.grid = null
      area.flex = null
      this.deselectSubGrid()
    },
    handleDown(event, area) {
      if (!area.grid) {
        event.stopPropagation()
        event.preventDefault()
        const parent = store.getAreaParent(area)
        if (parent) {
          store.data.currentArea = parent
        }
      }
    },
    removeArea(area) {
      this.$emit('removearea', area)
      this.deselectSubGrid()
    },
    subFlex(area) {
      this.clearArea(area)
      if (!area.flex) {
        area.flex = createFlexState()
      }
      store.data.currentArea = area
    },
    subGrid(area) {
      this.clearArea(area)
      if (!area.grid) {
        area.grid = createGridState(3, 2)
      }
      store.data.currentArea = area
    },
    deselectSubGrid() {
      store.data.currentArea = store.data.area
    }
  }
}
</script>

<style scoped lang="scss">
@import './css/area-button.scss';

.current-grid-backdrop {
  display: none;
  position: fixed;
  top: 10px;
  left: calc(14em + 15px);
  right: 10px;
  bottom: 10px;
  background: rgba(0, 0, 0, 0.4);
  z-index: -1;
  &.reactive {
    display: block;
    z-index: 1;
  }
  &.active {
    display: block;
  }
  @media screen and (max-width: 768px) {
    left: 0;
    right: 0;
    bottom: 0;
    top: 45px;
  }
}

.area-editor {
  touch-action: none;
  background: #fff;
  height: 100%;
  cursor: pointer;
  position: absolute;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  border: 2px solid;
  background: rgba(255, 255, 255, 0.7);
  &.grayed {
    background: #dddddd;
  }
  z-index: 1;
  &:before {
    display: none;
  }
  button {
    position: absolute;
    z-index: 999;
    top: 5px;
    pointer-events: all;
    margin-bottom: 5px;
    vertical-align: top;
    &.btn-save {
      right: 38px;
    }
    &.btn-remove {
      right: 5px;
    }
  }
  .area-info {
    position: absolute;
    top: 5px;
    left: 5px;
    width: auto;
    z-index: 9;
    &:after {
      display: table;
      content: '';
      clear: both;
    }
    .area-name {
      position: relative;
      background: #ddd;
      padding: 5px 10px;
      border-left: 2px solid green;
      border-radius: 2px 0 0 2px;
      font-size: 16px;
      float: left;
      font-family: 'Alegreya Sans', 'Helvetica Neue', Arial, sans-serif;
      margin-right: 5px;
      pointer-events: none;
    }
    .btn-subgrid,
    .btn-remove {
      position: relative;
      float: left;
      right: 0;
      top: 0;
      margin-right: 5px;
    }
  }
}
</style>
