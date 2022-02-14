<template>
  <button :type="type" :class="{ expanded }" :title="title" @click="handleClick">
    <slot></slot>
    <span v-if="expanded">{{ title }}</span>
  </button>
</template>

<script setup lang="ts">
import { useAppState } from '../../store.js'

let { preferredExport } = $(useAppState())

const {
  type = 'button',
  app,
  title,
} = defineProps<{
  type?: string
  app: string
  title: string
}>()

const emit = defineEmits(['click'])

let expanded = $computed(() => preferredExport === app)

function handleClick(event: Event) {
  preferredExport = app
  emit('click', event)
}
</script>

<style scoped lang="postcss">
button {
  border: 0;
  border-radius: 50px;
  color: var(--color-gray-lightest);
  cursor: pointer;
  font-family: inherit;
  font-size: 15px;
  text-align: center;
  margin: 0 auto;
  background: var(--color-black);
  user-select: none;
  border: 1px solid var(--color-gray-darkest);
  display: flex;
  align-items: center;
  transition: all 0.2s ease-in-out;
  padding: 10px 15px;
  &:hover {
    background: var(--color-gray-dark);
  }
  span {
    margin-left: 10px;
  }
}
</style>
