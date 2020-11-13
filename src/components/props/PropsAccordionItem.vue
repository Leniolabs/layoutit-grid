<template>
  <div class="props-accordion-item" :class="{ active: accordion.active === name }">
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
  opacity: 0.7;
  &:hover,
  &.active {
    opacity: 1;
  }
  &:last-of-type h1 {
    border-bottom: 1px solid #444;
  }
}

h1 {
  width: 100%;
  border-top: 1px solid #444;
  color: #fff;
  font-size: 15px;
  margin: 0;
  padding: 10px 15px;
  cursor: pointer;
  &:hover {
    background: rgb(29, 3, 45);
  }
}

.props-accordion-content {
  padding: 0 15px 8px;
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
