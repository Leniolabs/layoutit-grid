<template>
  <div class="props-accordion-item">
    <h1 :class="{ independent }" @click="independent ? (opened = !opened) : (accordion.active = name)">
      {{ (!opened && closedHeading) || heading }}
    </h1>
    <div
      v-if="independent || accordion.active === name"
      v-show="!independent || opened"
      class="props-accordion-content"
    >
      <slot />
    </div>
  </div>
</template>

<script setup="props">
import { ref } from 'vue'

export default {
  props: {
    name: { type: String, required: true },
    heading: { type: String, required: true },
    closedHeading: { type: String, default: '' },
    accordion: { type: Object, required: true },
    independent: { type: Boolean, default: false },
  },
}

export const opened = ref(true)
</script>

<style scoped lang="scss">
.props-accordion-item {
  overflow: hidden;
  margin: 0;
}

h1 {
  margin: 0 0 0 0;
  font-size: 0.8em;
  width: 100%;
  padding: 0.3em 0 0 5px;
  height: 1.8em;
  border-bottom: 1px solid #444;
  background-color: #ddd;
  color: black;
  &.independent {
    background-color: gold;
  }
}

.props-accordion-content {
  padding-top: 8px;
  padding-bottom: 8px;
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

.items {
  font-size: 11px;
  margin-bottom: 10px;
}
</style>
