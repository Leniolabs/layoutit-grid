<template>
  <div class="output-settings">
    <template v-if="isOpen">
      <SlideCheckbox id="checkbox-repeat" v-model="modelValue.repeat">
        Apply CSS
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
            >legacy grid spec</a
          >
        </strong>
        (IE 10/11).
      </SlideCheckbox>
      <div v-if="modelValue.oldSpec" class="checkbox-warning">
        Warning: the legacy grid specification does not support
        <a
          target="_blank"
          rel="noreferrer"
          class="auto-placement-link"
          href="https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_Grid_Layout/Auto-placement_in_CSS_Grid_Layout"
          >auto-placement of elements!</a
        >
      </div>
    </template>
    <div class="props-accordion-item" @click="isOpen = !isOpen">
      <h1>Options</h1>
    </div>
  </div>
</template>

<script setup>
import { defineProps, ref } from 'vue'
import SlideCheckbox from '../basic/SlideCheckbox.vue'

defineProps({
  modelValue: { type: Object, required: true },
})

const isOpen = ref(false)
</script>

<style scoped lang="postcss">
.output-settings {
  margin: auto 0 0 0;
  width: 100%;
  font-size: 13px;
  user-select: none;
  cursor: pointer;
  a {
    color: #9cdcfe;
  }
  .checkbox-warning {
    color: #333;
    margin-top: 5px;
    padding: 6px 10px;
    border-radius: 2px;
    background-color: #fdd835;
    width: 100%;
    font-size: 13px;
    .auto-placement-link {
      font-weight: 600;
    }
    a {
      color: #333;
    }
  }
  strong {
    font-weight: normal;
    font-size: 13px;
    text-shadow: none;
    font-family: Consolas, Monaco, 'Andale Mono', 'Ubuntu Mono', monospace;
  }
  .slide-checkbox {
    padding-bottom: 5px;

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
</style>
