<template>
  <div class="output-settings">
    <div class="props-accordion-item" :class="{ active: isOpen }" @click="isOpen = !isOpen">
      <h1>Settings</h1>
    </div>
    <div v-if="isOpen" class="output-panel" @click.self="isOpen = !isOpen">
      <SlideCheckbox id="checkbox-repeat" v-model="modelValue.repeat">
        Use
        <strong>
          <a href="https://developer.mozilla.org/en-US/docs/Web/CSS/repeat" rel="noreferrer" target="_blank"
            >repeat()</a
          >
        </strong>
        function.
      </SlideCheckbox>
      <SlideCheckbox id="checkbox-template-areas" v-model="modelValue.templateAreas">
        Use
        <strong>
          <a
            href="https://developer.mozilla.org/en-US/docs/Web/CSS/grid-template-areas"
            rel="noreferrer"
            target="_blank"
            >grid-template-areas</a
          >
        </strong>
        for positioning.
      </SlideCheckbox>
      <SlideCheckbox id="checkbox-old-spec" v-model="modelValue.oldSpec">
        Add support for
        <strong>
          <a
            target="_blank"
            rel="noreferrer"
            href="https://rachelandrew.co.uk/archives/2016/11/26/should-i-try-to-use-the-ie-implementation-of-css-grid-layout/"
            >legacy grid</a
          >
        </strong>
        (IE 10/11).
      </SlideCheckbox>
      <div v-if="modelValue.oldSpec" class="checkbox-warning">
        Warning: legacy grid spec does not support
        <a
          target="_blank"
          rel="noreferrer"
          class="auto-placement-link"
          href="https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_Grid_Layout/Auto-placement_in_CSS_Grid_Layout"
          >auto-placement of elements!</a
        >
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  modelValue
}>()

let isOpen = $ref(false)
</script>

<style scoped lang="postcss">
.output-settings {
  margin: auto 0 0 0;
  width: 100%;
  font-size: 14px;
  user-select: none;
  cursor: pointer;
  position: absolute;
  top: 0;
  right: 0;
  height: 100%;
  pointer-events: none;
  .output-panel {
    position: absolute;
    top: 35px;
    bottom: 0;
    right: 6px;
    left: 0;
    background: rgba(var(--color-black-rgb), 0.9);
    padding: 10px;
    pointer-events: all;
  }
  a {
    color: var(--color-blue-lightest);
  }
  .checkbox-warning {
    color: var(--color-gray-dark);
    margin-top: 5px;
    padding: 6px 10px;
    border-radius: 2px;
    background-color: var(--color-yellow);
    width: 100%;
    font-size: 13px;
    .auto-placement-link {
      font-weight: 600;
    }
    a {
      color: var(--color-gray-dark);
    }
  }
  strong {
    font-weight: normal;
    font-size: 13px;
    text-shadow: none;
    font-family: Consolas, Monaco, 'Andale Mono', 'Ubuntu Mono', monospace;
  }
  .slide-checkbox {
    padding-bottom: 10px;

    &:last-child {
      padding-bottom: 0;
    }
  }
  > {
    padding-bottom: 5px;
  }
  @media screen and (max-width: 768px) {
    visibility: hidden;
  }
}

.props-accordion-item {
  overflow: hidden;
  overflow-y: auto;
  margin: 0;
  opacity: 1;
  transition: opacity 0.1s ease-in;
  position: absolute;
  right: 65px;
  top: 7px;
  pointer-events: all;
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
    font-size: 13px;
    margin: 0;
    padding: 0;
    cursor: pointer;
    opacity: 0.6;
    &:hover {
      opacity: 1;
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
</style>
