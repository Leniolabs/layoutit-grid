<template>
  <div :class="[type, { active: isDraggingTrackLine }]">
    {{ grid[type].sizes[track - 1] }}
  </div>
</template>

<script setup="props, { emit }">
import { dragging, parseValueUnit, valueUnitToString } from '../../store.js'
import { computed } from 'vue'

export default {
  props: {
    grid: { type: Object, required: true },
    type: { type: String, required: true },
    track: { type: Number, required: true },
  },
}

export const isDraggingGrid = computed(() => dragging.value && dragging.value.grid === props.grid)

export const isDraggingTrackLine = computed(
  () =>
    isDraggingGrid.value &&
    (props.track === dragging.value[props.type + 'Line'] || props.track === dragging.value[props.type + 'Line'] - 1)
)
</script>

<style scoped lang="scss">
.col,
.row {
  font-size: 12px;
  color: #888;
  position: absolute;
  padding: 2px;
  &.active {
    color: #27ae60;
  }
}

.col {
  bottom: 0;
  right: 0;
  left: 0;
  text-align: center;
}
.row {
  top: 0;
  bottom: 0;
  right: 0;
  display: grid;
  align-content: center;
}
</style>
