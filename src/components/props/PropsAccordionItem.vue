<template>
  <div class="props-accordion-item" :class="{ active: !!accordion && accordion.active === name }">
    <h1 :class="{ independent }" @click="onHeaderClick">
      {{ (!opened && closedHeading) || heading }}
      <slot name="buttons"></slot>
    </h1>
    <div v-if="(independent && opened) || accordion.active === name" class="props-accordion-content">
      <slot />
    </div>
  </div>
</template>

<script setup>
import { defineProps, ref } from 'vue'

const props = defineProps({
  name: { type: String, required: true },
  heading: { type: String, required: true },
  closedHeading: { type: String, default: '' },
  accordion: { type: Object, default: undefined },
  independent: { type: Boolean, default: false },
  startOpened: { type: Boolean, default: false },
})
const opened = ref(props.startOpened)

function onHeaderClick() {
  opened.value = !opened.value
  props.accordion.active = opened.value ? props.name : ''
}
</script>

<style scoped lang="postcss">
.props-accordion-item {
  overflow: hidden;
  overflow-y: auto;
  margin: 0;
  opacity: 1;
  transition: opacity 0.1s ease-in;
  border-bottom: 1px dashed rgba(68, 68, 68, 0.4);
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
    color: #eee;
    font-size: 15px;
    margin: 0;
    padding: 10px 15px;
    cursor: pointer;
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

.props-accordion-content {
  margin: 0 15px 10px 15px;
  &:empty {
    margin: 0;
  }
}

.child-accordion .props-accordion-content {
  margin: 0;
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
