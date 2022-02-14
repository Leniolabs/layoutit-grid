<template>
  <div class="display-select-container">
    <div class="radio-toolbar">
      <template v-for="option in options" :key="option">
        <input
          :id="`display-${option}`"
          :checked="modelValue === option"
          type="radio"
          name="display"
          :value="option"
          @input="$emit('update:modelValue', option)"
        />
        <label :for="`display-${option}`">{{ option }}</label>
      </template>
    </div>
  </div>
</template>

<script setup lang="ts">
const options = ['block', 'flex', 'grid'] as const
type Option = typeof options[number]

const { modelValue = 'block' } = defineProps<{
  modelValue?: Option
}>()

defineEmits(['update:modelValue'])
</script>

<style scoped lang="postcss">
.display-select-container {
  margin-bottom: 5px;
  span {
    align-self: center;
    font-size: 12px;
    width: 100%;
  }
}
.display-select {
  background: var(--color-white);
  border: 0 none;
  border-radius: 2px;
  width: 100%;
  font-size: 12px;
}

.radio-toolbar {
  display: flex;
  flex-wrap: wrap;
  gap: 0px;
}

.radio-toolbar input {
  display: none;
}

.radio-toolbar label {
  flex: 1;
  font-size: 13px;
  text-shadow: none;
  font-family: Consolas, Monaco, 'Andale Mono', 'Ubuntu Mono', monospace;
  cursor: pointer;
  position: relative;
  margin: 0 6px 6px 0;
  border: solid 1px var(--color-gray-darkest);
  background: var(--color-black);
  line-height: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  color: var(--color-gray);
  svg {
    stroke: var(--color-gray-lightest);
    width: 20px;
  }
  &:hover {
    color: var(--color-white);
    svg {
      stroke: var(--color-white);
    }
  }
  &.default-value > div {
    opacity: 1;
    color: var(--color-white);
    background: var(--color-blue);
    border-radius: 2px;
    &:hover {
      background: var(--color-blue);
    }
  }
}
input[type='radio']:checked + label {
  opacity: 1;
  color: var(--color-white);
  background: var(--color-blue);
  border-radius: 2px;
}
</style>
