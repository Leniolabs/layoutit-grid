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

<script setup lang="ts">
import { isValidFlexBasis } from '../../store.js'
import { inputSetter } from '../../composables'

const { area } = defineProps<{ area }>()

const onFlexGrowInput = inputSetter((value) => (area.flexGrow = value))
const onFlexShrinkInput = inputSetter((value) => (area.Shrink = value))
const onFlexBasisInput = inputSetter((value) => (area.flexBasis = value), isValidFlexBasis)
</script>

<style scoped lang="postcss">
.layout-props {
  display: flex;
  flex-direction: column;
  gap: 10px;
  padding-top: 8px;
}
</style>
