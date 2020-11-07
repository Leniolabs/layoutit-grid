<template>
  <div class="grid-settings-container">
    <div class="items gaps">
      <h2><span>⊞</span> Grid Gap</h2>
      <GapInput :grid="grid" type="row" />
      <GapInput :grid="grid" type="col" />
    </div>
  </div>
</template>

<script setup="props">
import GapInput from '../common/GapInput.vue'

import { computed } from 'vue'

export default {
  props: {
    area: { type: Object, required: true },
  },
}

ref: grid = computed(() => props.area.grid)
</script>

<style scoped lang="scss">
h2 {
  font-family: 'Alegreya Sans', 'Helvetica Neue', Arial, sans-serif;
  margin: 0;
  font-size: 15px;
  padding: 0;
  line-height: 30px;
  display: flex;
  align-items: center;
  span {
    font-weight: normal;
    margin-right: 6px;
    height: 30px;
  }
}

.items {
  margin-bottom: 10px;
  margin-top: 0px;
}
</style>
