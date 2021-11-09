<template>
  <div
    class="props-accordion-item area-actions-sidebar"
    :class="{ active: area === currentArea && area !== mainArea }"
    :style="[
      area === currentArea && area !== mainArea
        ? { background: `${area.color}` }
        : { 'border-left': `2px solid ${area.color}` },
    ]"
    @click="setCurrentArea(area)"
  >
    <h1>
      <div class="area-name">
        .<CssCodeAreaName
          v-if="area === currentArea"
          :color="area === currentArea && area !== mainArea ? 'white' : null"
          :area="area"
        /><span v-else>{{ area.name }}</span>
      </div>

      <div class="area-action-buttons">
        <OptionsButton
          v-show="area.display === 'block'"
          title="Remove this area from the grid"
          class="remove-button"
          @click.stop="removeArea(area)"
        >
          <IconRemove />
        </OptionsButton>
        <OptionsButton
          v-show="area.display !== 'block'"
          :disabled="!area.parent"
          class="remove-button clear"
          title="Clear this area of subgrids"
          @click="clearArea(area)"
        >
          <IconClear />
        </OptionsButton>
        <OptionsButton
          v-show="area.display === 'grid'"
          class="add-area-button"
          title="Add implicit element to this grid area"
          @click="addImplicitArea(area)"
        >
          <IconAdd />
        </OptionsButton>
      </div>
    </h1>
  </div>
</template>

<script setup lang="ts">
import { useAppState, setCurrentArea, clearArea, addImplicitArea, removeArea } from '../../store.js'

let { mainArea, selection, currentArea } = $(useAppState())

defineProps<{ area }>()
</script>

<style scoped lang="postcss">
.props-accordion-item {
  h1 {
    position: relative;
    width: 100%;
    border-top: 1px solid rgba(var(--color-gray-dark-rgb), 0.5);

    color: var(--color-white);
    font-size: 15px;
    margin: 0;
    padding: 10px 15px;
    cursor: pointer;
    span {
      font-weight: normal;
      font-size: 13px;
      text-shadow: none;
      color: var(--color-golden);
      font-family: Consolas, Monaco, 'Andale Mono', 'Ubuntu Mono', monospace;
    }
  }
  &.active {
    .area-action-buttons {
      button:hover {
        background: rgba(var(--color-white-rgb), 0.1);
      }
    }
    .area-name {
      color: var(--color-white);
      &:hover {
        background: transparent;
      }
    }
  }
}

.area-actions-sidebar {
  &.active h1:before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    z-index: -1;
    background: rgba(var(--color-white-rgb), 0.5);
  }
  h1 {
    border-bottom: 1px solid rgba(var(--color-gray-dark-rgb), 0.5);
    color: var(--color-golden);
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
    display: flex;
    align-items: center;
    padding: 0;
    position: relative;
    > * {
      flex: 1;
    }
  }
}

.area-name {
  height: 40px;
  display: flex;
  align-items: center;
  padding-left: 15px;
  &:hover {
    background: var(--color-gray-dark);
  }
}

.area-type {
  font-size: 14px;
  font-weight: 700;
  color: black;
  margin-bottom: 10px;
  text-align: center;
  padding: 5px;
  border-radius: 4px;
  background: var(--color-gray-light);
  border-bottom: 1px solid black;
}

.area-props {
  overflow: auto;
}

.items {
  font-size: 11px;
  margin-bottom: 10px;
}

.area-action-buttons {
  display: flex;
  max-width: max-content;
  justify-content: flex-end;
  align-items: center;
  cursor: default;
  button {
    margin: 0;
    max-width: 40px;
    height: 40px;
    border-left: 1px solid rgba(var(--color-gray-dark-rgb), 0.5);
  }
}

button,
.add-button,
.remove-button {
  background: transparent;
  margin: 0;
  padding: 0;
  height: auto;
  font-size: 13px;
  text-shadow: none;
  direction: ltr;
  text-align: left;
  white-space: pre;
  word-spacing: normal;
  max-width: 30px;
  width: 50px;
  height: 30px;
  display: flex;
  align-items: center;
  flex: 1;
  justify-content: center;
  border-radius: 2px;
  margin-top: 2px;
  &[disabled] {
    svg {
      opacity: 0.25;
    }
  }
  &.remove-button.clear {
    svg {
      width: 15px;
      fill: var(--color-white);
      stroke: transparent;
    }
  }
  svg {
    width: 10px;
    stroke: var(--color-white);
    stroke-width: 15px;
  }
  &:hover {
    opacity: 1;
    background: var(--color-gray-dark);
  }
}

.add-button {
  height: 30px;
  svg {
    transform: rotate(45deg);
  }
}

.add-area-button svg {
  stroke-width: 15px;
}
</style>
