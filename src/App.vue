<template lang="pug">
w-drawer.nav-drawer(v-if="isMobile" v-model="drawerOpen" right :width="330")
  nav-menu(v-model:drawer-open="drawerOpen")
header.no-shrink
  toolbar(v-model:drawer-open="drawerOpen")
.content-wrap.w-flex.no-shrink
  transition(name="fade")
    w-progress(v-if="loading" color="primary" tile absolute)
  nav-menu.navigation.no-shrink(v-if="!isMobile" v-model:drawer-open="drawerOpen")
  .main-content.w-flex.column.grow(:class="`main-content--${$route.name}`")
    router-view.grow(#default="{ Component }" :class="`main--${$route.name}`")
      //transition(name="fade-page" mode="out-in")
      //  component(:is="Component")

    w-transition-bounce(v-if="goToTop" appear)
      w-button.go-top.mb8.mr2(
        icon="wi-chevron-up"
        fixed
        bottom
        right
        xl
        :bg-color="$store.state.darkMode ? 'grey-dark4' : 'grey-light5'"
        color="base-color"
        @click="scrollTop")
</template>

<script lang="ts">
  import { defineComponent } from 'vue'

  import Toolbar from './components/toolbar.vue'
  import NavMenu from './components/nav-menu.vue'
  import { useMainStore } from './store'
  import './scss/index.scss'

  export default defineComponent({
    components: { Toolbar, NavMenu },
    data: () => ({
      drawerOpen: false,
      fixMenu: false,
      menuTop: 0,
      scrollingEl: null,
      contentWrapEl: null,
      goToTop: false
    }),

    computed: {
      loading () {
        // Loading status is appended manually in router file.
        return false //this.$router.status.loading
      },
      isMobile () {
        return this.$waveui.breakpoint.xs
      }
    },

    methods: {
      onScroll () {
        this.fixMenu = this.scrollingEl.scrollTop >= this.menuTop
        this.goToTop = this.scrollingEl.scrollTop >= this.contentWrapEl.offsetTop
      },
      onResize () {
        this.menuTop = this.contentWrapEl.offsetTop - 12
      },
      async scrollTop () {
        await this.$nextTick()
        document.documentElement.scrollTo({ top: 0, behavior: 'smooth' })
      }
    },

    watch: {
      '$waveui.preferredTheme' (theme) {
        const store = useMainStore()
        store.darkMode = (theme === 'dark')
      }
    },

    mounted () {
      const store = useMainStore()
      const darkMode = localStorage.darkMode === 'true' || (localStorage.darkMode === undefined && this.$waveui.preferredTheme === 'dark')
      store.darkMode = darkMode
      this.$waveui.switchTheme(darkMode ? 'dark' : 'light')

      this.contentWrapEl = document.querySelector('.content-wrap')
      this.menuTop = this.contentWrapEl.offsetTop - 12
      this.scrollingEl = document.documentElement

      // Scroll to anchor point if any on page load.
      const pageAnchor = window.location.hash.replace('#', '')
      if (pageAnchor) {
        setTimeout(() => {
          const anchorEl = document.getElementById(pageAnchor)
          // Smooth not supported on Safari & IOS, but will still jump to it.
          anchorEl.scrollIntoView({ behavior: 'smooth' })
        }, 200)
      }

      window.addEventListener('scroll', this.onScroll)
      window.addEventListener('resize', this.onResize)
    },

    beforeUnmount () {
      window.removeEventListener('scroll', this.onScroll)
      window.removeEventListener('resize', this.onResize)
    }
  })
</script>
