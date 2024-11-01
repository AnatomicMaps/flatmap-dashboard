<template lang="pug">
.nav-menu-wrap
  .nav-menu
    w-button.close(
      v-if="$waveui.breakpoint.xs"
      @click="$emit('update:drawerOpen', false)"
      sm
      outline
      round
      color="primary"
      icon="wi-cross")
    w-tree.mt3(
      :data="sections"
      selectable
      @click="onItemClick"
      branch-icon="wi-check"
      leaf-icon="wi-check")
</template>

<script lang="ts">
  import { defineComponent } from 'vue'

  export default defineComponent({
    props: {
      drawerOpen: { type: Boolean, default: false }
    },

    emits: ['update:drawerOpen'],

    data: () => ({
      sections: [
        { label: 'Overview', route: '/', icon: 'mdi-view-dashboard' },
        { label: 'Flatmaps', route: '/flatmaps', icon: 'mdi mdi-human-male-female' },
        { label: 'Knowledge', route: '/knowledge', icon: 'mdi mdi-database' },
        { label: 'Admin', route: '/admin', icon: 'mdi mdi-tools' }
      ]
    }),

    methods: {
      onItemClick () {
        this.$emit('update:drawerOpen', false)
        setTimeout(() => {
          document.documentElement.scrollTop = (<HTMLElement>document.querySelector('.content-wrap')).offsetTop - 42
        }, 200)
      }
    }
  })
</script>

<style lang="scss">
@use '@/scss/index.scss' as *;

.nav-menu-wrap {
  position: relative;
  width: 100%;
  min-width: 180px;
  max-width: 300px;
  margin-left: -12px;
  padding-left: 30px;

  &:after {
    content: '';
    position: absolute;
    top: 0;
    bottom: 0;
    right: 0;
    border-right: 2px solid rgba(#000 , 0.05);
  }
}

.nav-menu {
  // Don't apply to the w-app examples.
  .nav-menu-wrap & {
    height: 90vh;
    overflow: auto;
    z-index: 1;
  }

  .title2 {margin-left: 8px;}

  .w-tree__item {margin-left: 0;}
  .w-tree__item-label {
    display: flex;
    padding: 5px 2px 5px 16px;
    font-size: 1.02rem;
    font-weight: normal;
    border-right: 0 solid $primary;
    color: $primary;
    transition: $transition-duration ease-in-out, border-width 0s;

    &:before {
      content: '';
      display: none;
      position: absolute;
      top: 0;
      left: 0;
      bottom: 0;
      right: 0;
      background-color: currentColor;
      opacity: 0.06;
      border-radius: 99em 0 0 99em;
    }
    &:focus:before,
    &:hover:before {display: block;}

    &.router-link-active {
      border-right-width: 3px;
      font-weight: 700;

      &:before {
        display: block;
        opacity: 0.12;
      }
    }
  }
  .w-tree__item--disabled .w-tree__item-label:before {display: none;}

  .w-tree__item-icon {
    color: rgba(20, 105, 184, 0.5);
    font-size: 1.5em;
    margin-right: 6px;
  }

  .w-tree__item--branch > .w-tree__item-label {text-transform: uppercase;font-weight: bold;}

  .w-tag {padding: 2px 4px 1px;}
  code {padding: 0 1px 1px;margin: 0 -1px;}
}

// Desktop left-side menu.
.content-wrap .nav-menu-wrap {padding-top: 24px;margin-right: 32px;}
.content-wrap .nav-menu {
  position: sticky;
  top: 60px;
}

// Mobile right-side menu.
.nav-drawer .nav-menu-wrap {
  max-width: unset;
  padding: 3em 0 16px;
  margin-left: 12px;
  border-right: none;

  .nav-menu {height: 100%;}

  .close {
    position: absolute;
    top: 2 * $base-increment;
    right: 2 * $base-increment;
    z-index: 10;
  }
}

@media screen and (max-width: 800px) {
  .nav-menu-wrap {max-width: 230px;padding-left: 0;}
}
</style>
