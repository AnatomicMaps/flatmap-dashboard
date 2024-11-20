<script setup lang="ts">

  import { ref } from 'vue'

  import type {ServerEndpoint} from '../App.vue'

//==============================================================================

  type TableHeader = {
    key: string
    label: string
  }

  interface FlatmapTable {
    headers: TableHeader[]
    items: FlatmapData[]
    sort: string
    keyword: string
    keywordFilter: (keyword: string) => (item: FlatmapData) => boolean
    loading: boolean|string
  }

  interface FlatmapData {
    id: number,
    name: string
    describes: string
    taxon: string
    biologicalSex?: string
    created: string
    servers: string[]
    uuid?: string
    [propName: string]: unknown
  }
const tableHeaders: TableHeader[] = [
    { label: 'Name', key: 'name' },
    { label: 'Describes', key: 'describes' },
    { label: 'Taxon', key: 'taxon' },
    { label: 'Biological Sex', key: 'biologicalSex' },
    { label: 'Created', key: 'created' },
    { label: 'Servers', key: 'servers' },
    { label: 'UUID', key: 'uuid' },
  ]

  const flatmapTable: FlatmapTable = {
    headers: tableHeaders,
    items: [],
    sort: '+name',
    keyword: '',
    keywordFilter: (keyword: string) => {
      return (item: FlatmapData) => {
        // Concatenate all the columns into a single string for a faster lookup.
        const allColumns = tableHeaders.map(hdr => item[hdr.key]).join(' ')
        // Lookup the keyword variable in the string with case-insensitive flag.
        return new RegExp(keyword, 'i').test(allColumns)
      }
    },
    loading: 'header'
  }

  const table = ref(flatmapTable)

//==============================================================================

  async function loadMapData(serverEndpoints: ServerEndpoint[]): Promise<null>
  {
    const flatmaps: FlatmapData[] = []
    const mapsByUUID: Map<string, FlatmapData> = new Map()
    for (const server of serverEndpoints) {
      try {
        const result = await fetch(server.url)
        const maps: FlatmapData[] = await result.json()
        maps.forEach(map => {
          if (!('biologicalSex' in map)) {
            map.biologicalSex = ''
          }
          if ('uuid' in map) {
            if (mapsByUUID.has(map.uuid!)) {
              const fm = mapsByUUID.get(map.uuid!)!
              fm.servers.push(server.name)
            } else {
              map.servers = [server.name]
              mapsByUUID.set(map.uuid!, map)
              flatmaps.push(map)
            }
          } else {
            map.servers = [server.name]
            flatmaps.push(map)
          }
        })
      } catch {
        console.log(`Cannot connect to ${server.name} flatmap server at ${server.url}`)
      }
    }
    let index = 1
    flatmaps.forEach(map => {
      map.id = index
      index += 1
    })
    table.value.items = flatmaps
    table.value.loading = false
    return null
  }

//==============================================================================

  defineExpose({
    loadMapData
  })

//  const selectionInfo = ref()
</script>

<template lang='pug'>
w-input.mb3(
  v-model="table.keyword"
  placeholder="Search..."
  inner-icon-left="wi-search")
w-table.flatmap-table(
  :headers="table.headers"
  :items="table.items"
  :filter="table.keywordFilter(table.keyword)"
  :selectable-rows="1"
  :mobile-breakpoint="700"
  v-model:sort="table.sort"
  v-model:loading='table.loading'
  fixed-headers
  resizable-columns
  style="height: 600px")
//  @row-select="selectionInfo = $event"
//.mt4.title4 Selection info:
//  pre {{ selectionInfo }}
</template>
