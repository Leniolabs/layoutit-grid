<template>
  <mobile-button @click="activeSidebar = !activeSidebar" />

  <grid-editor
    :area="area"
    :current-area="currentArea"
    :current-item="currentItem"
    :parent-active="currentArea.name === area.name"
  />
  <sidebar v-if="activeSidebar" :area="area" :current-area="currentArea" :current-item="currentItem" />
  <SidebarRight v-if="activeSidebarRight" :save-design="saveDesign">
    <template v-slot:header>
      <h1>Live</h1>
    </template>
    <template v-slot:body>
      <Code :area="area" />
    </template>
  </SidebarRight>
</template>

<script>
import store from '../store.js'

import MobileButton from './MobileButton.vue'

import GridEditor from './grid/GridEditor.vue'
import AreaEditor from './AreaEditor.vue'
import Sidebar from './sidebar/Sidebar.vue'
import SidebarRight from './basic/SidebarRight.vue'
import Code from './sidebar/Code.vue'

export default {
  name: 'Editor',
  components: {
    AreaEditor,
    GridEditor,
    Sidebar,
    SidebarRight,
    Code,
    MobileButton,
  },
  props: {
    saveDesign: { type: Function, default: null },
  },
  data: function () {
    return {
      activeSidebar: true,
      activeSidebarRight: true,
    }
  },
  computed: {
    area() {
      return store.data.area
    },
    currentArea() {
      return store.data.currentArea
    },
    currentItem() {
      return store.data.currentItem
    },
  },
}
</script>

<style lang="scss">
@import url('https://fonts.googleapis.com/css?family=Alegreya+Sans:400,400i,700,700i,900,900i');

*,
*:before,
*:after {
  box-sizing: border-box;
}

html,
body {
  margin: 0;
  height: 100%;
  background: #300548;
  font-size: 100%;
}
input[type='number']::-webkit-inner-spin-button,
input[type='number']::-webkit-outer-spin-button {
  opacity: 1;
}

p {
  margin-top: 0;
  font-size: 18px;
  font-family: 'Alegreya Sans', 'Helvetica Neue', Arial, sans-serif;
}

.disabled,
[disabled],
.area-selection button[disabled] {
  opacity: 0.6;
  pointer-events: none;
}

*:focus {
  outline: none;
}

#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  text-align: center;
  color: #2c3e50;
  margin-top: 0px;
  padding-left: calc(14em + 15px);
  padding-right: 10px;
  padding-top: 10px;
  padding-bottom: 10px;
  background: linear-gradient(#1d032d, #300748);
  height: 100%;
  display: flex;
  flex-flow: row;
  flex-wrap: nowrap;
  flex-wrap: nowrap;
  > section {
    flex: 1 0 auto;
  }
  @media screen and (max-width: 768px) {
    padding: 45px 0 0;
  }
}

.mobile-button {
  position: fixed;
  bottom: 1em;
  right: 1em;
}
</style>
