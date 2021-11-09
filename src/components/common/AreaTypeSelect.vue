<template>
  <div class="area-type-select-container">
    <span>type</span>
    <select :value="modelValue" class="area-type-select" @input="onInput">
      <option v-for="option in options" :key="option" :value="option">{{ option }}</option>
    </select>
  </div>
</template>

<script setup lang="ts">
const { modelValue = 'box' } = defineProps<{
  modelValue: string
}>()

const emit = defineEmits(['update:modelValue'])

const options = ['div', 'p', 'button', 'image', 'component']

const onInput = (event: Event) => {
  emit('update:modelValue', (event.target as HTMLInputElement).value)
}
</script>

<style scoped lang="postcss">
.area-type-select-container {
  display: grid;
  grid-template-columns: 0.75fr 1fr;
  margin-bottom: 5px;
  span {
    align-self: center;
    font-size: 12px;
    width: 100%;
  }
}
.area-type-select {
  background: var(--color-white);
  border: 0 none;
  border-radius: 2px;
  width: 100%;
  font-size: 12px;
}
</style>
