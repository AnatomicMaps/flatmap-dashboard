<script setup lang="ts">
  import { computed } from 'vue'

  const version = computed<string>(() => "0.0.1")

  const drawerOpen = defineModel<boolean>()

</script>

<template lang="pug">
w-toolbar.main-toolbar(fixed)
  router-link.w-flex.no-grow.fill-height.align-center.home-link(to="/" @click.native="scrollTop(false)")
    span.grey-dark1 Flatmap Server Dashboard
  .spacer

  strong.version.size--xs(v-html="`v<code>${version}</code>`")

  w-button.mr-1.hamburger-menu(
    v-if="$waveui.breakpoint.xs"
    @click="$emit('update:drawerOpen', !drawerOpen)"
    lg
    text
    round
    :icon="drawerOpen ? 'wi-cross' : 'mdi mdi-menu'")
</template>

<style lang="scss">
@use '../scss/index.scss' as *;

div.main-toolbar {
  height: 42px;
  padding-top: 0;
  padding-bottom: 0;
  background-color: rgba(var(--w-base-bg-color), 0.85);
  backdrop-filter: blur(4px);
  z-index: 190;
  border-bottom-color: rgba(var(--w-contrast-bg-color), 0.05);

  .home-link {
    @include default-transition;
    &:hover {transform: scale(1.05);}
    &:focus {transform: scale(1.1);}

    span {font: 22px 'title font', helvetica, arial;}
  }

  .version {
    color: rgba(var(--w-base-color), 0.35);

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
