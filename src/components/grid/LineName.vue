<template>
  <input
    v-show="lineNameActive"
    ref="input"
    :value="lineName"
    :style="`width:${lineNameWidth}px`"
    :class="type"
    @input="setLineName($event.target.value)"
    @pointerdown.stop
  />
</template>

<script>
let textWidthCanvas = null
function getTextWidth(text, font) {
  if (!textWidthCanvas) {
    textWidthCanvas = document.createElement('canvas')
  }
  const context = textWidthCanvas.getContext('2d')
  context.font = font
  return context.measureText(text).width
}

export default {
  name: 'LineName',
  props: {
    grid: { type: Object, required: true },
    type: { type: String, required: true }, // 'col' or 'row'
    pos: { type: Number, required: true }
  },
  computed: {
    lineNameState() {
      return this.grid[this.type].lineNames[this.pos - 1]
    },
    lineNameActive() {
      return this.lineNameState.active
    },
    lineName() {
      return this.lineNameState.name
    },
    lineNameWidth() {
      return getTextWidth(this.lineName, '14px arial') + 30
    }
  },
  methods: {
    focus() {
      this.$refs.input.focus()
    },
    toggle() {
      const { lineNameState } = this
      if ((lineNameState.active = !lineNameState.active)) {
        this.$nextTick(() => this.focus())
      }
    },
    setLineName(value) {
      this.lineNameState.name = value
    }
  }
}
</script>

<style scoped lang="scss">
.row,
.col {
  touch-action: none;
  position: absolute;
  background: #bbe5b3;
  z-index: 9;
  top: -12px;
  right: 0;
  padding: 2px 10px;
  height: max-content;
  border: 1px solid green;
  border-right: 0;
  border-top-left-radius: 6px;
  border-bottom-left-radius: 6px;
  font: 14px arial;
  z-index: 999;
  opacity: 1;
}

.col {
  right: initial;
  top: initial;
  left: -1px;
  bottom: 2px;
  transform: translateY(12px) rotate(90deg) translateX(-100%);
  transform-origin: 0 12px;
}
</style>
