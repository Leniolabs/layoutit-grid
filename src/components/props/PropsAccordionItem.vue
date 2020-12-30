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

<style scoped lang="scss">
.props-accordion-item {
  overflow: hidden;
  margin: 0;
  opacity: 0.7;
  &:hover,
  &.active {
    opacity: 1;
  }
  &.active {
    h1 {
      background: transparent;
    }
  }
  /*   &.active {
    background: rgb(35, 36, 31);
    .props-accordion-content {
      background: rgb(35, 36, 31);
    }
    h1:hover {
      background: rgb(35, 36, 31);
    }
  } */
  &.tree-item {
    margin: auto 15px 15px;
    min-height: 150px;
    max-height: 250px;
    overflow: auto;
    background: rgb(35, 36, 31);
    opacity: 1;
    h1 {
      position: relative;
      display: block;
      color: #bbb;
      font-weight: 700;
      font-size: 12px;
      padding: 8px;
      user-select: none;
      text-transform: uppercase;
      border: 0;
    }
    .props-accordion-content {
      padding: 5px 15px;
    }
  }
}

h1 {
  width: 100%;
  border-top: 1px solid rgba(68, 68, 68, 0.5);
  color: #eee;
  font-size: 15px;
  margin: 0;
  padding: 10px 15px;
  cursor: pointer;
  &:hover {
    background: rgb(29, 3, 45);
  }
}

.props-accordion-content {
  padding: 0 15px 15px;
  &:empty {
    padding: 0;
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
