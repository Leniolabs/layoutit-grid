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

<script setup lang="ts">
const {
  name,
  heading,
  accordion,
  closedHeading = '',
  independent = false,
  startOpened = false,
} = defineProps<{
  name: string
  heading: string
  accordion?
  closedHeading?: string
  independent?: boolean
  startOpened?: boolean
}>()

let opened = $ref(startOpened)

function onHeaderClick() {
  opened = !opened
  accordion.active = opened ? name : ''
}
</script>

<style scoped lang="postcss">
.props-accordion-item {
  overflow: hidden;
  overflow-y: auto;
  margin: 0;
  opacity: 1;
  transition: opacity 0.1s ease-in;
  border-bottom: 1px dashed rgba(var(--color-gray-dark-rgb), 0.4);
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
    color: var(--color-gray-lightest);
    font-size: 15px;
    margin: 0;
    padding: 10px 15px;
    cursor: pointer;
    &:hover {
      background: var(--color-black);
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
  scrollbar-color: var(--color-purple-middle) var(--color-purple-dark);
}
::-webkit-scrollbar {
  width: 5px;
}
::-webkit-scrollbar:horizontal {
  height: 5px;
}
::-webkit-scrollbar-track {
  background: var(--color-purple-dark);
  border-radius: 10px;
}
::-webkit-scrollbar-thumb {
  background: var(--color-purple-middle);
  border-radius: 10px;
}
::-webkit-scrollbar-thumb:hover {
  background: var(--color-purple);
}

.items {
  font-size: 11px;
  margin-bottom: 10px;
}
</style>
