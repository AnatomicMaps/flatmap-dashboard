<template lang="pug">
w-toolbar.main-toolbar(fixed)
  router-link.w-flex.no-grow.fill-height.align-center.home-link(to="/" @click.native="scrollTop(false)")
    span.grey-dark1 Flatmap Server Dashboard
  .spacer

  w-switch.mr2(
    :model-value="store.darkMode"
    @update:model-value="$store.setDarkMode($event), $waveui.switchTheme($event ? 'dark' : 'light')"
    bg-color="blue-dark5")
    template(#thumb)
      w-icon mdi {{ store.darkMode ? 'mdi-weather-night' : 'mdi-white-balance-sunny' }}

  strong.version.size--xs(v-html="`v<code>${version}</code>`")

  w-button.mr-1.hamburger-menu(
    v-if="$waveui.breakpoint.xs"
    @click="$emit('update:drawerOpen', !drawerOpen)"
    lg
    text
    round
    :icon="drawerOpen ? 'wi-cross' : 'mdi mdi-menu'")
</template>

<script setup lang="ts">
  import { useMainStore } from '../store'
  const store = useMainStore()
</script>

<script lang="ts">
  import { defineComponent } from 'vue'

  export default defineComponent({
    props: {
      drawerOpen: { type: Boolean, default: false }
    },

    emits: ['update:drawerOpen'],

    computed: {
      version () {
        return "0.0.1"
      }
    },

    methods: {
      async scrollTop (toContent = false) {
        await this.$nextTick()
        document.documentElement.scrollTop = toContent
          ? document.querySelector('.content-wrap').offsetTop - 42
          : 0
      }
    }
  })
</script>

<style lang="scss">
@use '../scss/index.scss' as *;

div.main-toolbar {
  height: 42px;
  padding-top: 0;
  padding-bottom: 0;
  background-color: rgba(var(--w-base-bg-color-rgb), 0.85);
  backdrop-filter: blur(4px);
  z-index: 190;
  border-bottom-color: rgba(var(--w-contrast-bg-color-rgb), 0.05);

  .home-link {
    @include default-transition;
    &:hover {transform: scale(1.05);}
    &:focus {transform: scale(1.1);}

    span {font: 22px 'title font', helvetica, arial;}
  }

  .v3-is-out {
    color: #000;
    cursor: pointer;
    font-weight: bold;
    padding: 2px 8px;
    background: linear-gradient(110deg, #bf953f, #fcf6ba, #b38728, #fbf5b7, #aa771c);
    mix-blend-mode: difference;
    overflow: hidden;
    position: relative;

    &:before {
      content: '';
      position: absolute;
      top: -120%;
      right: -150%;
      width: 50%;
      height: 300%;
      transform: rotate(30deg);
      background: linear-gradient(to right, rgba(255, 255, 255, 0.13), rgba(255, 255, 255, 0.13), rgba(255, 246, 198, 0.8), rgba(255, 255, 255, 0));
    }
    &:hover:before {animation: shine 2s infinite;}
  }

  .version {
    color: rgba(var(--w-base-color-rgb), 0.35);

    code {
      letter-spacing: -0.5px;
      background: none;
      border: none;
      color: inherit;
      padding: 0;
    }
  }
  .github-link .w-icon, .wave-logo {color: #1670b4;}

  .hamburger-menu {margin-left: 8px;}
  .hamburger-menu .w-icon {width: 26px;}
}

@keyframes shine {
  to {right: 300%;}
}

@media screen and (max-width: 410px) {
  div.main-toolbar {
    .version {display: none;}
    .hamburger-menu {margin-left: 0;}
  }
}
</style>
