<script setup lang="ts">

  import { ref } from 'vue'

  import type {ServerEndpoint} from '@/App.vue'

//==============================================================================

  type TableHeader = {
    key: string
    label: string
    align?: string
    width?: string|number
  }

  interface ServerTable {
    headers: TableHeader[]
    items: ServerData[]
    sort: string
    loading: boolean
  }

  interface ServerData {
    id: number
    name: string
    version: string
    url: string
    status: string
    mapCount: number
    viewer?: string
    mapmaker?: string
  }

  interface ServerMetadata {
    id: string
    version: string
  }

//==============================================================================

const tableHeaders: TableHeader[] = [
    { label: 'Server name', key: 'name' },
    { label: 'Endpoint', key: 'url' },
    { label: 'Version', key: 'version' },
    { label: 'Status', key: 'status' },
    { label: 'Standalone<br/>Viewer', key: 'viewer' },
    { label: 'Mapmaker', key: 'mapmaker' },
    { label: 'Available maps', key: 'mapCount',  width: 40, align: 'right' }
  ]

  const serverTable: ServerTable = {
    headers: tableHeaders,
    items: [],
    sort: '+name',
    loading: true
  }

  const table = ref(serverTable)

//==============================================================================

  async function loadServerData(serverEndpoints: ServerEndpoint[]): Promise<null>
  {
    const servers: ServerData[] = []
    let index = 1
    for (const server of serverEndpoints) {
      let status
      let systemInfo: ServerMetadata|ServerMetadata[] = []
      let mapCount = 0
      try {
        let result = await fetch(`${server.url}/version`)
        systemInfo = await result.json()
        status = 'Active'
        result = await fetch(server.url)
        const maps = await result.json()
        mapCount = maps.length
      } catch {
        console.log(`Cannot connect to ${server.name} flatmap server at ${server.url}`)
        status = 'Unable to connect'
        continue
      }
      let version = ''
      let mapmaker = 'Disabled'
      let viewer = 'Disabled'
      if (Array.isArray(systemInfo)) {
        for (const system of systemInfo) {
          if (system.id === 'server') {
            version = `v${system.version}`  
          } else if (system.id === 'mapmaker') {
            mapmaker = `v${system.version}`
          } else if (system.id === 'viewer') {
            viewer = `v${system.version}`
          }
        }
      } else {
        version = systemInfo.version
      }
      servers.push({
        id: index,
        name: server.name,
        url: server.url,
        version,
        status,
        mapCount,
        mapmaker,
        viewer
      })
      index += 1
    }
    table.value.loading = false
    table.value.items = servers
    return null
  }

//==============================================================================

  defineExpose({
    loadServerData
  })
</script>

<!--=========================================================================-->

<template lang='pug'>
w-table.flatmap-table(
  :headers="table.headers"
  :items="table.items"
  :selectable-rows="1"
  :mobile-breakpoint="700"
  v-model:sort="table.sort"
  v-model:loading='table.loading'
  @row-select="selected"
  fixed-headers
  resizable-columns
  style="height: calc(100vh - 210px)")
</template>

<!--=========================================================================-->
