<script setup lang="ts">

  import { onMounted, ref } from 'vue'

  import {FLATMAP_SERVER_ENDPOINTS} from '@/App.vue'

  import FlatmapTable from '@/components/FlatMapTable.vue'

  const title = 'Flatmaps'

  const flatmapTable = ref(0)

  onMounted(async () => {
    // @ts-ignore
    await flatmapTable.value.loadMapData(FLATMAP_SERVER_ENDPOINTS)
  })
</script>

<template lang='pug'>
w-card.light-blue-light5--bg(tile)
  template(#title)
    w-toolbar
      .title2.ml2.text-light {{title}}
  Suspense
    FlatmapTable(ref='flatmapTable')
</template>
