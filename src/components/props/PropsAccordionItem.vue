<template>
  <div class="props-accordion-item" :class="{ active: accordion.active === name }">
    <h1 :class="{ independent }" @click="independent ? (opened = !opened) : (accordion.active = name)">
      {{ (!opened && closedHeading) || heading }}
      <slot name="buttons"></slot>
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

<script setup>
import { defineProps, ref } from 'vue'

defineProps({
  name: { type: String, required: true },
  heading: { type: String, required: true },
  closedHeading: { type: String, default: '' },
  accordion: { type: Object, required: true },
  independent: { type: Boolean, default: false },
})
const opened = ref(true)
</script>

<style scoped lang="postcss">
.props-accordion-item {
  overflow: hidden;
  overflow-y: auto;
  margin: 0;
  opacity: 1;
  transition: opacity 0.1s ease-in;
  &:first-of-type {
    opacity: 1;
    h1:hover {
      background: transparent;
    }
  }
  &:hover,
  &.active {
    opacity: 1;
  }
  h1 {
    width: 100%;
    position: relative;
    color: #fff;
    font-size: 15px;
    margin: 0;
    padding: 10px 15px;
    cursor: pointer;
    //border-bottom: 1px solid rgba(68, 68, 68, 0.5);
    opacity: 0.6;
    &.independent {
      border-top: 1px solid rgba(68, 68, 68, 0.5);
      opacity: 1;
    }
    &:hover {
      background: #151515;
    }
  }
  &.active h1 {
    border-bottom: 0;
    opacity: 1;
    &:hover {
      background: transparent;
    }
  }
}

.area-actions-sidebar h1 {
  color: #d7ba7d;
  font-size: 13px;
  text-shadow: none;
  font-family: Consolas, Monaco, 'Andale Mono', 'Ubuntu Mono', monospace;
  direction: ltr;
  text-align: left;
  white-space: pre;
  word-spacing: normal;
  word-break: normal;
  line-height: 1.5;
  font-weight: normal;
}

.props-accordion-content {
  margin: 0 10px 15px 15px;
  &:empty {
    margin: 0;
  }
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
