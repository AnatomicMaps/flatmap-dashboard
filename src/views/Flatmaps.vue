<script setup lang="ts">
  import FlatmapTable from '../components/FlatMapTable.vue'

  const title = 'Flatmaps'
</script>

<template lang='pug'>
w-card.light-blue-light5--bg(tile)
  template(#title)
    w-toolbar
      .title2.ml2.text-light {{title}}
  Suspense
    FlatmapTable
</template>
