<template>
  <section
    :class="[
      'grid-line',
      type,
      {
        first: pos === 1,
        last,
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
          dragging: dragging && dragging.grid === grid && dragging[type + 'Line'] === pos,
          focused: currentFocus && currentFocus.on === 'line' && currentFocus.type === type && currentFocus.pos === pos,
        },
      ]"
    >
      {{ pos }}
    </div>

    <div
      :class="['line-handle', type, { first: pos === 1, 'dragging-something': dragging }]"
      @pointerdown.stop="$emit('down', $event, { [type]: pos })"
    />

    <LineName ref="lineNameRef" :grid="grid" :pos="pos" :type="type" :gap="gap" />
  </section>
</template>

<script setup="props, { emit }">
import LineName from './LineName.vue'
import { dragging as ref_dragging, currentFocus } from '../../store.js'
import { computed } from 'vue'

export default {
  props: {
    type: { type: String, required: true },
    pos: { type: Number, required: true },
    area: { type: Object, required: true },
    gap: { type: String, default: '0px' },
  },
  emits: ['down'],
}

ref: dragging = ref_dragging

ref: grid = computed(() => props.area.grid)

ref: last = computed(() => props.pos === grid[props.type].lineNames.length)

ref: showNumber = computed(() => {
  const otherLineNames = grid[props.type === 'col' ? 'row' : 'col'].lineNames
  return !(last && otherLineNames[0].active)
})

ref: gridArea = computed(() => {
  // The first line uses the same track as the second one
  const pos = Math.max(props.pos - 1, 1)
  return props.type === 'row' ? `${pos} / 1 / ${pos + 1} / -1` : `1 / ${pos} / -1 / ${pos + 1}`
})

ref: lineNameRef = null
function toggleLineName() {
  lineNameRef.toggle()
}
</script>

<style scoped lang="scss">
// vars="{ gap }"
section {
  --gap: 1px;
  touch-action: none;
  pointer-events: none;
  height: 100%;
  position: relative;

  .line-number {
    position: absolute;
    font-size: 10px;
    width: 14px;
    border-radius: 3px;
    color: #888;
    background: #fff;
    line-height: 15px;
    text-align: center;
    &.dragging,
    &.focused {
      background: #27ae60;
      color: #fff;
      z-index: 10000;
    }
  }

  &.row .line-number {
    bottom: calc(-7px - 0.5 * var(--gap));
    left: 0px;
    width: 15px;
    text-align: left;
    border-bottom-left-radius: 0;
    border-bottom-right-radius: 5px;
    border-top-right-radius: 5px;
    border-top-left-radius: 0;
    padding-left: 4px;
  }
  &.row.first .line-number {
    border-top-right-radius: 0px;
    bottom: auto;
    top: 0px;
  }
  &.row.last .line-number {
    bottom: 0px;
    border-bottom-right-radius: 0px;
  }

  &.col .line-number {
    right: calc(-6.5px - 0.5 * var(--gap));
    top: 0px;
    border-top-left-radius: 0;
    border-top-right-radius: 0;
    border-bottom-right-radius: 5px;
    border-bottom-left-radius: 5px;
    height: 16px;
  }
  &.col.first .line-number {
    border-bottom-left-radius: 0px;
    right: auto;
    left: 0px;
  }
  &.col.last .line-number {
    border-bottom-right-radius: 0px;
    right: 0px;
  }

  .line-handle {
    pointer-events: initial;
    touch-action: none;
    position: absolute;
    &.col {
      bottom: 0;
      height: 100%;
      width: calc(var(--gap) + 20px);
      right: calc(-10px - var(--gap));
      &.first {
        right: initial;
        left: calc(-10px - var(--gap));
      }
      &:not(.dragging-something) {
        cursor: col-resize;
      }
    }
    &.row {
      right: 0;
      width: 100%;
      height: calc(var(--gap) + 20px);
      bottom: calc(-10px - var(--gap));
      &.first {
        bottom: initial;
        top: calc(-10px - var(--gap));
      }
      &:not(.dragging-something) {
        cursor: row-resize;
      }
    }

    overflow: hidden;
  }
}
</style>
