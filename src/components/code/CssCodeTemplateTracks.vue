<template>
  <template v-if="isInteractive">
    <span v-for="(item, i) in trackSizesAndLineNames" :key="item.type + (item.pos || item.track)" class="token string"
      >{{ separatorBeforeItem(i)
      }}<CssCodeTrackSize
        v-if="item.type === 'size'"
        :grid="grid"
        :type="type"
        :track="item.track"
        :el="item.el"
        @move="onMove($event, i)"
      /><CssCodeLineName
        v-if="item.type === 'line'"
        :grid="grid"
        :type="type"
        :pos="item.pos"
        :el="item.el"
        @move="onMove($event, i)"
      />{{ separatorAfterItem(i) }}
    </span>
  </template>
  <span v-if="!isInteractive" class="token string">{{
    type === 'col' ? namedTemplateColumns(grid, repeat) : namedTemplateRows(grid, repeat)
  }}</span>
</template>

<script setup lang="ts">
import { isValidTrackSize, parseGridTemplate } from '../../store.js'

import { namedTemplateColumns, namedTemplateRows } from '../../utils.js'

const {
  grid,
  type,
  repeat = false,
} = defineProps<{
  grid
  type: string
  repeat?: boolean
}>()

let isInteractive = $computed(() => {
  return !(repeat && grid[type].lineNames.every((l) => !l.active))
})

let multiline = $computed(() => {
  const { lineNames } = grid[type]
  return lineNames.some((line) => line.name !== '' && line.active === true)
})

function separatorBeforeItem(i) {
  return multiline.value && i === 0 ? '\n    ' : ''
}
function separatorAfterItem(i) {
  const isLast = i === trackSizesAndLineNames.length - 1
  return trackSizesAndLineNames[i].type === 'size' && !isLast && multiline.value ? '\n    ' : isLast ? '' : ' '
}

let trackSizesAndLineNames = $computed(() => {
  const { sizes, lineNames } = grid[type]
  const items = []
  for (var i = 0; i < lineNames.length; i++) {
    const { active, name } = lineNames[i]
    if (active && name) {
      items.push({ type: 'line', pos: i + 1, el: ref(null) })
    }
    if (i < sizes.length) {
      items.push({ type: 'size', track: i + 1, el: ref(null) })
    }
  }
  return items
})

function onMove(event, i) {
  switch (event.action) {
    case 'right':
      if (i + 1 < trackSizesAndLineNames.length) {
        trackSizesAndLineNames[i + 1].el.value.focus()
      } else {
        if (document.activeElement) {
          document.activeElement.blur()
        }
      }
      break
    case 'left':
      if (i - 1 >= 0) {
        trackSizesAndLineNames[i - 1].el.value.focus()
      } else {
        if (document.activeElement) {
          document.activeElement.blur()
        }
      }
      break
  }
}
</script>

<style scoped lang="postcss"></style>
