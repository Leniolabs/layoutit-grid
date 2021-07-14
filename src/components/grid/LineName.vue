<template>
  <input
    v-show="line.active"
    ref="inputElement"
    :value="line.name"
    :style="style"
    :class="[type, { first: pos === 1, last: pos === grid[type].lineNames.length }]"
    aria-label="line name"
    @input="line.name = $event.target.value"
    @keydown="onKeydown"
    @pointerdown.stop
    @focus="currentFocus = { on: 'line', grid, type, pos }"
    @blur="currentFocus = null"
  />
</template>

<script>
import { useLineNameWidth } from '../../composables/lineName.js'
import { parseValue, currentFocus } from '../../store.js'

export default {
  props: {
    grid: { type: Object, required: true },
    type: { type: String, required: true }, // 'col' or 'row'
    pos: { type: Number, required: true },
    gap: { type: String, default: '0px' },
  },
  setup(props, { expose }) {
    const line = computed(() => props.grid[props.type].lineNames[props.pos - 1])

    const lineNameWidth = useLineNameWidth(line, '14px arial', 30)

    const style = computed(() => {
      const g = parseValue(props.gap)
      const s = { width: lineNameWidth.value + 'px' }
      if (props.pos > 1 && props.pos < props.grid[props.type].lineNames.length) {
        return { ...s, ...(props.type === 'row' ? { bottom: -11 - g / 2 + 'px' } : { right: -2 - g / 2 + 'px' }) }
      }
      return s
    })

    const inputElement = ref(null)

    function focus() {
      inputElement.value.focus()
    }

    function toggle() {
      if ((line.value.active = !line.value.active)) {
        nextTick(focus)
      }
    }

    function onKeydown(event) {
      const { code } = event
      if (code === 'Enter' || code === 'NumpadEnter' || code === 'Escape') {
        event.preventDefault()
        inputElement.value.blur()
        return
      }
    }

    expose({ focus, toggle })
    return { line, inputElement, style, currentFocus, onKeydown }
  },
}
</script>

<style scoped lang="postcss">
.row,
.col {
  z-index: 1;
  pointer-events: initial;
  background: var(--color-green-ligth);
  border: 1px solid var(--color-green);
  font: 0.85rem arial;
  height: max-content;
  opacity: 1;
  padding: 2px 10px;
  overflow: visible;
  position: absolute;
  touch-action: none;
  user-select: none;
}
.row {
  border-right: 0;
  &:not(.first) {
    border-top-left-radius: 6px;
  }
  &:not(.last) {
    border-bottom-left-radius: 6px;
  }
  right: 0;
  bottom: -12px;
  &.first {
    top: 0px;
  }
  &.last {
    bottom: 0px;
  }
}
.col {
  border-left: 0;
  &:not(.first) {
    border-top-right-radius: 6px;
  }
  &:not(.last) {
    border-bottom-right-radius: 6px;
  }
  bottom: 0;
  right: -2px;
  transform-origin: 0 12px;
  transform: translateX(100%) translateY(10px) rotate(-90deg);
  &.first {
    left: 11px;
    transform: translateY(10px) rotate(-90deg);
  }
  &.last {
    transform: translateX(calc(100% - 11px)) translateY(10px) rotate(-90deg);
  }
}
</style>
