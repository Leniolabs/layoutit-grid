<template>
  <div class="props-accordion">
    <slot />
  </div>
</template>

<script setup="props">
import { computed } from 'vue'

export default {
  name: 'AreaProps',
  props: {
    accordion: { type: Object, required: true },
  },
}
</script>

<style scoped lang="scss">
.props-accordion {
  overflow: scroll;
}

* {
  scrollbar-width: thin;
  scrollbar-color: #491988 #300748;
}
::-webkit-scrollbar {
  width: 5px;
}
::-webkit-scrollbar:horizontal {
  height: 5px;
}
::-webkit-scrollbar-track {
  background: #300748;
  border-radius: 10px;
}
::-webkit-scrollbar-thumb {
  background: #491988;
  border-radius: 10px;
}
::-webkit-scrollbar-thumb:hover {
  background: #5c26a2;
}
</style>
