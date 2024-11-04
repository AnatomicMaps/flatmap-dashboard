<script setup lang="ts">
  import { computed, inject } from 'vue'
  import { RouterLink, RouterView } from 'vue-router'

  import type {$waveui as WaveUI} from 'wave-ui'
  const $waveui = inject('$waveui') as WaveUI

  import NavMenu from './components/NavMenu.vue'
  import Toolbar from './components/Toolbar.vue'

  const drawerOpen = defineModel<boolean>()
  const isMobile = computed(() => $waveui.breakpoint.xs)
</script>

<template lang="pug">
w-drawer.nav-drawer(v-if="isMobile" v-model="drawerOpen" right :width="330")
  nav-menu(v-model:drawer-open="drawerOpen")
header.no-shrink
  toolbar(v-model:drawer-open="drawerOpen")
w-flex.content-wrap.no-shrink
  nav-menu.navigation.no-shrink(v-if="!isMobile" v-model:drawer-open="drawerOpen")
  .main-content.w-flex.column.grow(:class="`main-content--${$route.name}`")
    router-view
</template>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
  margin-top: 0;
}
</style>
