<template>
  <section
    :class="[
      'grid-line',
      type,
      {
        firstExplicit,
        lastExplicit,
        firstImplicit,
        lastImplicit,
      },
    ]"
    :style="{
      gridArea,
    }"
  >
    <div
      v-if="showNumber"
      :class="[
        'line-number',
        {
          grayed,
          compact: area.padding !== '0',
          dragging: dragging && dragging.grid === grid && dragging[type + 'Line'] === pos,
          focused:
            currentFocus &&
            currentFocus.grid === grid &&
            currentFocus.on === 'line' &&
            currentFocus.type === type &&
            currentFocus.pos === pos,
        },
      ]"
    >
      {{ asValidLineNumber(pos, type, implicitGrid) }}
    </div>

    <div
      :class="['line-handle', type, { firstImplicit, lastImplicit, 'dragging-something': dragging }]"
      :style="{
        'pointer-events':
          (selection && selection.fresh) || (area !== mainArea && (firstImplicit || lastImplicit)) ? 'none' : 'initial',
      }"
      @pointerdown.stop="$emit('down', $event, { [type]: pos })"
      @pointermove="onMove"
    />

    <LineName v-if="isExplicit" ref="lineNameRef" :grid="grid" :pos="pos" :type="type" :gap="gap" />
  </section>
</template>

<script setup lang="ts">
import { useAppState } from '../../store.js'
import { asValidGridArea, asValidLineNumber } from '../../utils/grid.js'

let { dragging, selection, currentFocus, overArea, mainArea } = $(useAppState())

const {
  type,
  pos,
  area,
  implicitGrid,
  gap = '0px',
  grayed = false,
} = defineProps<{
  type: string
  pos: number
  area
  implicitGrid
  gap?: string
  grayed?: boolean
}>()

const emit = defineEmits(['down', 'overcell'])

let grid = $computed(() => area.grid)

let firstExplicit = $computed(() => pos === 1)
let lastExplicit = $computed(() => pos === grid[type].lineNames.length)

// TODO: refactor implicitGrid -> { col: { size, i }, row: { size, i } }
let firstImplicit = $computed(() => pos === (type === 'row' ? implicitGrid.ri : implicitGrid.ci))
let lastImplicit = $computed(
  () =>
    pos ===
    (type === 'row' ? implicitGrid.rows : implicitGrid.cols) + (type === 'row' ? implicitGrid.ri : implicitGrid.ci)
)

let isExplicit = $computed(() => {
  return pos >= 1 && pos <= grid[type].lineNames.length
})

let showNumber = $computed(() => {
  const otherLineNames = grid[type === 'col' ? 'row' : 'col'].lineNames
  return !(lastImplicit && otherLineNames[0].active)
})

let gridArea = $computed(() => {
  // The first line uses the same track as the second one
  const cpos = Math.max(pos - 1, type === 'row' ? implicitGrid.ri : implicitGrid.ci)
  return type === 'row'
    ? asValidGridArea(cpos, implicitGrid.ci, cpos + 1, implicitGrid.cols + implicitGrid.ci, implicitGrid)
    : asValidGridArea(implicitGrid.ri, cpos, implicitGrid.rows + implicitGrid.ri, cpos + 1, implicitGrid)
})

let lineNameRef = $ref(null)
function toggleLineName() {
  lineNameRef.toggle()
}

function onMove(event) {
  if (dragging) {
    return
  }
  const lineEl = event.target
  lineEl.style.pointerEvents = 'none'
  const cellEl = document.elementFromPoint(event.clientX, event.clientY)
  lineEl.style.pointerEvents = 'initial'
  const { colStart, rowStart } = cellEl.dataset || {}
  if (colStart !== undefined && rowStart !== undefined) {
    emit('overcell', { col: +colStart, row: +rowStart })
    return
  }
}

defineExpose({ toggleLineName })
</script>

<style scoped lang="postcss">
section {
  touch-action: none;
  pointer-events: none;
  height: 100%;
  position: relative;

  .line-number {
    position: absolute;
    font-size: 10px;
    width: 14px;
    border-radius: 3px;
    color: var(--color-gray);
    background: var(--color-white);
    line-height: 15px;
    text-align: center;
    /*z-index: 1;*/
    &.grayed {
      background: var(--color-gray-lightest);
    }
    &.dragging,
    &.focused {
      background: var(--color-green);
      color: var(--color-white);
      z-index: 10000;
    }
  }

  &.row .line-number {
    bottom: calc(-7px - 0.5 * v-bind(gap));
    width: 15px;
    text-align: left;
    border-bottom-left-radius: 0;
    border-bottom-right-radius: 5px;
    border-top-right-radius: 5px;
    border-top-left-radius: 0;
    padding-left: 4px;
    left: 1px;
    &.compact {
      left: 1px;
    }
  }
  &.row.firstImplicit .line-number {
    border-top-right-radius: 0px;
    bottom: auto;
    top: 1px;
    &.compact {
      top: 1px;
    }
  }
  &.row.lastImplicit .line-number {
    border-bottom-right-radius: 0px;
    bottom: 1px;
    &.compact {
      bottom: 1px;
    }
  }

  &.col .line-number {
    right: calc(-6.5px - 0.5 * v-bind(gap));
    border-top-left-radius: 0;
    border-top-right-radius: 0;
    border-bottom-right-radius: 5px;
    border-bottom-left-radius: 5px;
    height: 16px;
    top: 1px;
    &.compact {
      top: 1px;
    }
  }
  &.col.firstImplicit .line-number {
    border-bottom-left-radius: 0px;
    right: auto;
    left: 1px;
    &.compact {
      left: 1px;
    }
  }
  &.col.lastImplicit .line-number {
    border-bottom-right-radius: 0px;
    right: 1px;
    &.compact {
      right: 1px;
    }
  }

  .line-handle {
    touch-action: none;
    position: absolute;
    &.col {
      bottom: 0;
      height: 100%;
      width: calc(v-bind(gap) + 20px);
      right: calc(-10px - v-bind(gap));
      &.firstImplicit {
        width: 14px;
        right: initial;
        left: 0;
      }
      &.lastImplicit {
        width: 14px;
        right: 0;
      }
      &:not(.dragging-something) {
        cursor: col-resize;
      }
    }
    &.row {
      right: 0;
      width: 100%;
      height: calc(v-bind(gap) + 20px);
      bottom: calc(-10px - v-bind(gap));
      &.firstImplicit {
        bottom: initial;
        top: 0;
        height: 14px;
      }
      &.lastImplicit {
        bottom: 0;
        height: 14px;
      }
      &:not(.dragging-something) {
        cursor: row-resize;
      }
    }

    overflow: hidden;
  }
}
</style>
