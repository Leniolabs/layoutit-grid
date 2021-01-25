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
  overflow-y: scroll;
  margin: 0;
  opacity: 0.8;
  &:hover,
  &.active {
    opacity: 1;
  }
  &.active {
    //max-height: 370px;
    padding-bottom: 10px;
    h1 {
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
    margin: auto 0 0;
    min-height: 150px;
    max-height: 300px;
    overflow: auto;
    background: #151515;
    opacity: 1;
    display: none;
    .props-accordion-content {
      padding: 5px 15px 5px 10px;
      margin-left: 0;
    }
  }
}

h1 {
  width: 100%;
  border-top: 1px solid rgba(68, 68, 68, 0.5);
  color: #fff;
  font-size: 15px;
  margin: 0;
  padding: 10px 15px;
  cursor: pointer;
  &:hover {
    background: #151515;
  }
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
