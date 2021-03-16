<template>
  <div
    class="props-accordion-item area-actions-sidebar"
    :style="{ 'border-left': `2px solid ${area.color}` }"
    @click="setCurrentArea(area)"
  >
    <h1>
      {{ `.${area.name}` }}
      <div class="area-action-buttons">

        <OptionsButton v-show="area.display === 'block'" class="remove-button" @click="$emit('removearea', area)"
          ><IconRemove
        /></OptionsButton>
        <OptionsButton
          v-show="area.display !== 'block'"
          :disabled="!area.parent"
          class="remove-button clear"
          @click="clearArea(area)"
          ><IconClear
        /></OptionsButton>
        <OptionsButton v-show="area.display === 'grid'" class="add-area-button" @click="addImplicitArea(area)">
          <IconAdd />
        </OptionsButton>        
      </div>
    </h1>
  </div>
</template>

<script>
import OptionsButton from '../basic/OptionsButton.vue'
import IconAdd from '../icons/IconAdd.vue'
import IconClear from '../icons/IconClear.vue'
import IconRemove from '../icons/IconRemove.vue'

import { setCurrentArea, clearArea, addImplicitArea, removeArea } from '../../store.js'

export default {
  components: { IconAdd, OptionsButton, IconClear, IconRemove },
  props: {
    area: { type: Object, required: true },
  },
  emits: ['removearea'],
  methods: {
    clearArea,
    removeArea,
    addImplicitArea,
    setCurrentArea,
    click() {
      setCurrentArea(this.area)
    },
  },
}
</script>

<style scoped lang="scss">
.props-accordion-item h1 {
  position: relative;
  width: 100%;
  border-top: 1px solid rgba(68, 68, 68, 0.5);

  color: #fff;
  font-size: 15px;
  margin: 0;
  padding: 10px 15px;
  cursor: pointer;
  span {
    font-weight: normal;
    font-size: 13px;
    text-shadow: none;
    color: #d7ba7d;
    font-family: Consolas, Monaco, 'Andale Mono', 'Ubuntu Mono', monospace;
  }
}

.area-actions-sidebar {
  h1 {
    border-bottom: 1px solid rgba(68, 68, 68, 0.5);
  }
}

.area-actions-sidebar h1 {
  color: #d7ba7d;
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
}

.area-type {
  font-size: 14px;
  font-weight: 700;
  color: black;
  margin-bottom: 10px;
  text-align: center;
  padding: 5px;
  border-radius: 4px;
  background: #ddd;
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
  position: absolute;
  display: flex;
  right: 0;
  top: 0;
  bottom: 0;
  justify-content: center;
  align-items: center;
  button {
    margin: 0;
    width: 40px;
    height: 40px;
    max-width: initial;
    border-left: 1px solid rgba(68, 68, 68, 0.5);
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
  &[disabled] svg {
    opacity: 0.5;
  }
  &.remove-button.clear {
    svg {
      width: 15px;
      fill: #fff;
      stroke: transparent;
    }
  }
  svg {
    width: 10px;
    stroke: #fff;
    stroke-width: 20px;
  }
  &:hover {
    opacity: 1;
    background: transparent;
  }
}

.add-button {
  height: 30px;
  svg {
    transform: rotate(45deg);
  }
}
</style>
