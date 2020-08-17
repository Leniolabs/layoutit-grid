<template>
  <section
    v-if="isAdding"
    :style="{ 'grid-area': gridArea, 'border-color': selection.color }"
    class="area-selection"
  >
    <input
      ref="addingName"
      v-model="gridName"
      class="area-text"
      type="text"
      placeholder="Area Name"
      @keyup.enter="selectionSave"
    />
    <button class="btn-remove" title="Remove Selection" @click="selectionRemove">
      <icon-remove />
    </button>
    <button
      :disabled="gridName === '' || !isValidAreaName(gridName) || invalidClassName"
      class="btn-save"
      @click="selectionSave"
    >Save</button>
  </section>
</template>

<script>
import { gridRegionToGridArea } from '../../utils.js'
import { store, isValidAreaName } from '../../store.js'

import IconRemove from '../icons/icon-remove.vue'

function selectionDimension(type, start, end) {
  return {
    start: Math.min(start[type].start, end[type].start),
    end: Math.max(start[type].end, end[type].end),
  }
}

function selectionArea(selection) {
  const { start, end } = selection
  return {
    row: selectionDimension('row', start, end),
    col: selectionDimension('col', start, end),
  }
}

function farEnough(a, b, delta = 5) {
  return Math.abs(a.x - b.x) > delta || Math.abs(a.y - b.y) > delta
}

export default {
  name: 'AreaSelection',
  components: { IconRemove },
  props: {
    area: { type: Object, required: true },
  },
  data() {
    return {
      selection: null,
      gridName: '',
    }
  },
  computed: {
    grid() {
      return this.area.grid
    },
    gridArea() {
      if (this.isAdding) {
        return gridRegionToGridArea(selectionArea(this.selection))
      } else {
        return 'initial'
      }
    },
    isAdding() {
      return !!this.selection
    },
    invalidClassName() {
      const { gridName } = this
      return (gridName[0] >= '0' && gridName[0] <= '9') || !gridName[0] ? true : false
    },
  },
  methods: {
    isValidAreaName,

    cellDown({ clientX, clientY }, section) {
      store.data.currentArea = this.area

      let { selection } = this

      if (!selection) {
        selection = {
          start: section,
          end: section,
          color: store.getRandomColor(),
          fresh: true,
        }
      }

      selection.dragging = {
        initial: { x: clientX, y: clientY },
        section,
      }

      const finishDraggingSelection = () => {
        if (selection.dragging) {
          selection.end = selection.dragging.section
          selection.dragging = null
        }
        selection.fresh = false
        window.removeEventListener('pointerup', finishDraggingSelection)
      }
      window.addEventListener('pointerup', finishDraggingSelection, false)

      this.selection = selection

      // nextTick$ is not working here
      setTimeout(() => this.$refs.addingName.focus(), 1)
    },

    cellMove({ clientX, clientY }, section) {
      const { selection } = this
      if (selection) {
        const { dragging } = selection
        if (dragging) {
          if (!selection.fresh) {
            if (farEnough(dragging.initial, { x: clientX, y: clientY })) {
              selection.fresh = true
              selection.start = section
            }
          }
          dragging.section = section
          if (selection.fresh) {
            selection.end = section
          }
        }
      }
    },

    selectionRemove() {
      this.selection = null
    },

    selectionSave() {
      if (!this.invalidClassName) {
        const { color } = this.selection
        this.grid.areas.push({
          gridRegion: selectionArea(this.selection),
          color,
          name: this.gridName,
          grid: null,
          flex: null,
        })
        this.gridName = ''
        this.selectionRemove()
      }
    },
  },
}
</script>

<style scoped lang="scss">
@import '../css/area-button.scss';
.area-selection {
  touch-action: none;
  background: #fff;
  height: 100%;
  cursor: pointer;
  pointer-events: none;
  position: absolute;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  border: 2px solid;
  background: rgba(255, 255, 255, 0.7);
  z-index: 1;
  &:before {
    display: none;
  }
  input {
    position: absolute;
    top: 50%;
    left: 0;
    bottom: 0;
    right: 0;
    transform: translate(0, -50%);
    width: 100%;
    text-align: center;
    border: 0;
    font-size: 30px;
    color: #300548;
    font-family: 'Alegreya Sans', 'Helvetica Neue', Arial, sans-serif;
    background: transparent;
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
}

.invalid-class-name {
  color: red;
}
</style>
