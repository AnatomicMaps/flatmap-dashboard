<script setup lang="ts">
  import { computed, inject } from 'vue'
  import { RouterLink, RouterView } from 'vue-router'

  import type {$waveui as WaveUI} from 'wave-ui'
  const $waveui = inject('$waveui') as WaveUI

  const drawerOpen = defineModel<boolean>()
  const isMobile = computed(() => $waveui.breakpoint.xs)
</script>

<script lang="ts">
  import NavMenu from '@/components/NavMenu.vue'
  import Toolbar from '@/components/Toolbar.vue'

  export type ServerEndpoint = {
    name: string
    url: string
    viewer?: boolean|string
  }
  export const FLATMAP_SERVER_ENDPOINTS: ServerEndpoint[] = [
    {name: 'local', url: 'http://localhost:8000/', viewer: 'http://localhost:3000/'},
    {name: 'curation', url: 'https://mapcore-demo.org/curation/flatmap/', viewer: true},
    {name: 'devel', url: 'https://mapcore-demo.org/devel/flatmap/v4/', viewer: true},
    {name: 'fccb', url: 'https://mapcore-demo.org/fccb/flatmap/', viewer: true},
    {name: 'isan', url: 'https://mapcore-demo.org/isan/flatmap/', viewer: true},
    {name: 'staging', url: 'https://mapcore-demo.org/staging/flatmap/v1/'},
    {name: 'production', url: 'https://mapcore-demo.org/current/flatmap/v3/'},
  ]
</script>

<template lang="pug">
w-drawer.nav-drawer(v-if="isMobile" v-model="drawerOpen" right :width="330")
  NavMenu(v-model:drawer-open="drawerOpen")
header.no-shrink
  Toolbar(v-model:drawer-open="drawerOpen")
w-flex.content-wrap.no-shrink
  NavMenu.navigation.no-shrink(v-if="!isMobile" v-model:drawer-open="drawerOpen")
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
