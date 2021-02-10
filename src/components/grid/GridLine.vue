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
          compact: area.padding !== '0',
          dragging: dragging && dragging.grid === grid && dragging[type + 'Line'] === pos,
          focused: currentFocus && currentFocus.on === 'line' && currentFocus.type === type && currentFocus.pos === pos,
        },
      ]"
    >
      {{ pos }}
    </div>

    <div
      :class="['line-handle', type, { first: pos === 1, last, 'dragging-something': dragging }]"
      @pointerdown.stop="$emit('down', $event, { [type]: pos })"
    />

    <LineName ref="lineNameRef" :grid="grid" :pos="pos" :type="type" :gap="gap" />
  </section>
</template>

<script>
import LineName from './LineName.vue'
import { dragging, currentFocus } from '../../store.js'
import { ref, computed, defineProps, defineEmit } from 'vue'

export default {
  components: { LineName },
  props: {
    type: { type: String, required: true },
    pos: { type: Number, required: true },
    area: { type: Object, required: true },
    gap: { type: String, default: '0px' },
  },
  emits: ['down'],
  setup(props, { expose }) {
    const grid = computed(() => props.area.grid)

    const last = computed(() => props.pos === grid.value[props.type].lineNames.length)

    const showNumber = computed(() => {
      const otherLineNames = grid.value[props.type === 'col' ? 'row' : 'col'].lineNames
      return !(last.value && otherLineNames[0].active)
    })

    const gridArea = computed(() => {
      // The first line uses the same track as the second one
      const pos = Math.max(props.pos - 1, 1)
      return props.type === 'row' ? `${pos} / 1 / ${pos + 1} / -1` : `1 / ${pos} / -1 / ${pos + 1}`
    })

    const lineNameRef = ref(null)
    function toggleLineName() {
      lineNameRef.value.toggle()
    }

    expose({ toggleLineName })
    return {
      lineNameRef,
      gridArea,
      showNumber,
      last,
      grid,
      dragging,
      currentFocus,
    }
  },
}
</script>

<style scoped lang="scss">
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
    color: #aaa;
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
    bottom: calc(-7px - 0.5 * v-bind(gap));
    width: 15px;
    text-align: left;
    border-bottom-left-radius: 0;
    border-bottom-right-radius: 5px;
    border-top-right-radius: 5px;
    border-top-left-radius: 0;
    padding-left: 4px;
    left: 0;
    &.compact {
      left: 1px;
    }
  }
  &.row.first .line-number {
    border-top-right-radius: 0px;
    bottom: auto;
    top: 0px;
    &.compact {
      top: 1px;
    }
  }
  &.row.last .line-number {
    border-bottom-right-radius: 0px;
    bottom: 0px;
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
    top: 0px;
    &.compact {
      top: 1px;
    }
  }
  &.col.first .line-number {
    border-bottom-left-radius: 0px;
    right: auto;
    left: 0px;
    &.compact {
      left: 1px;
    }
  }
  &.col.last .line-number {
    border-bottom-right-radius: 0px;
    right: 0px;
    &.compact {
      right: 1px;
    }
  }

  .line-handle {
    pointer-events: initial;
    touch-action: none;
    position: absolute;
    &.col {
      bottom: 0;
      height: 100%;
      width: calc(v-bind(gap) + 20px);
      right: calc(-10px - v-bind(gap));
      &.first {
        width: 14px;
        right: initial;
        left: 0;
      }
      &.last {
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
      &.first {
        bottom: initial;
        top: 0;
        height: 14px;
      }
      &.last {
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
