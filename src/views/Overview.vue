<script setup lang="ts">

  import {FLATMAP_SERVER_ENDPOINTS} from '../App.vue'

  const title = 'Overview'

  /*
    Table of servers and their version
  */
</script>

<template lang='pug'>
w-card.light-blue-light5--bg(tile)
  template(#title)
    w-toolbar
      .title2.ml2.text-light {{title}}
  p Flatmap server table (name, url, version) ...
</template>
