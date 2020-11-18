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
            @input="onFlexGrowInput(+$event.target.value)"
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
            @input="onFlexBasisInput($event.target.value)"
          />
        </div>
      </div>
    </template>
  </div>
</template>

<script setup="props">
import { computed } from 'vue'
import { isValidFlexBasis } from '../../store.js'
import { inputSetter } from '../../composables'

export default {
  props: {
    area: { type: Object, required: true },
  },
}

const onFlexGrowInput = inputSetter((value) => (props.area.flexGrow = value))
const onFlexShrinkInput = inputSetter((value) => (props.area.Shrink = value))
const onFlexBasisInput = inputSetter((value) => (props.area.flexBasis = value), isValidFlexBasis)
</script>

<style scoped lang="scss">
.layout-props {
  display: flex;
  flex-direction: column;
  gap: 10px;
}
</style>
