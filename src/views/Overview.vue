<script setup lang="ts">
  import { onMounted, ref } from 'vue'

  import {FLATMAP_SERVER_ENDPOINTS} from '../App.vue'

  import ServerTable from '../components/ServerTable.vue'

  const title = 'Overview'

  const serverTable = ref(0)

  onMounted(async () => {
    // @ts-ignore
    await serverTable.value.loadServerData(FLATMAP_SERVER_ENDPOINTS)
  })

</script>

<template lang='pug'>
w-card.light-blue-light5--bg(tile)
  template(#title)
    w-toolbar
      .title2.ml2.text-light {{title}}
  Suspense
    ServerTable(ref='serverTable')
</template>
