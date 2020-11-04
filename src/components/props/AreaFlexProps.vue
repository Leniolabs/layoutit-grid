<template>
  <div class="layout-props">
    <template v-if="area.parent && area.parent.display === 'flex'">
      <div class="inner-items">
        <div>
          Flex Grow
          <input
            :value="area.flexGrow"
            type="number"
            aria-label="flex grow"
            @input="area.flexGrow = +$event.target.value"
          />
        </div>
        <br />
        <div>
          Flex Shrink
          <input
            :value="area.flexShrink"
            type="number"
            aria-label="flex shrink"
            @input="area.flexShrink = +$event.target.value"
          />
        </div>
        <br />
        <div>
          Flex Basis
          <input
            :value="area.flexBasis"
            type="text"
            aria-label="flex basis"
            @input="area.flexBasis = $event.target.value"
          />
        </div>
      </div>
    </template>
  </div>
</template>

<script setup="props">
import { computed } from 'vue'

export default {
  name: 'AreaProps',
  props: {
    area: { type: Object, required: true },
  },
}
</script>

<style scoped lang="scss">
.layout-props {
  display: flex;
  flex-direction: column;
  gap: 10px;
}
</style>
