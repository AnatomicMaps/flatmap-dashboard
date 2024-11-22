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
    loading: boolean
  }

  interface FlatmapData {
    id: number
    name: string
    describes: string
    taxon: string
    biologicalSex: string
    created: string
    creator: string
    knowledge: string
    servers: string[]
    uuid?: string
    'git-description': string
    [propName: string]: unknown
  }

  interface FlatmapMetadata {
    id: string
    name: string
    describes: string
    taxon: string
    biologicalSex?: string
    created: string
    creator: string
    uuid?: string
    'git-status': Record<string, any>
    sckan: Record<string, any>
  }

//==============================================================================

const tableHeaders: TableHeader[] = [
    { label: 'Name', key: 'name' },
    { label: 'Describes', key: 'describes' },
    { label: 'Taxon', key: 'taxon' },
    { label: 'Biological Sex', key: 'biologicalSex' },
    { label: 'Created', key: 'created' },
    { label: 'Release', key: 'git-description'},
    { label: 'Mapmaker', key: 'creator' },
    { label: 'SCKAN', key: 'knowledge' },
    { label: 'Servers', key: 'serverList' },
    { label: 'UUID', key: 'uuid' },
  ]

  const defaultRow: FlatmapData = {
      id: 0,
      name: '',
      describes: '',
      taxon: '',
      biologicalSex: '',
      created: '',
      creator: '',
      'git-description': '',
      knowledge: '',
      servers: ['']
  }

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
    loading: true
  }

  const table = ref(flatmapTable)

//==============================================================================

  async function loadMapData(serverEndpoints: ServerEndpoint[]): Promise<null>
  {
    const flatmaps: FlatmapData[] = []
    const mapsByUUID: Map<string, FlatmapData> = new Map()
    const viewerUrls: Map<string, string> = new Map()
    for (const server of serverEndpoints) {
      let mapMetadata: FlatmapMetadata[] = []
      try {
        const result = await fetch(server.url)
        mapMetadata = await result.json()
      } catch {
        console.log(`Cannot connect to ${server.name} flatmap server at ${server.url}`)
        continue
      }
      if (server.viewer === true) {
        viewerUrls.set(server.name, `${server.url}viewer/`)
      } else if (server.viewer) {
        viewerUrls.set(server.name, server.viewer)
      }
      mapMetadata.forEach(metadata => {
        const map = Object.assign({}, defaultRow, metadata)
        if ('creator' in map && map.creator.startsWith('mapmaker ')) {
          map.creator = map.creator.slice(9)
        }
        if ('git-status' in map && 'description' in map['git-status']) {
          map['git-description'] = map['git-status'].description
        }
        if ('sckan' in map && 'knowledge-source' in map['sckan']) {
          map.knowledge = map.sckan['knowledge-source']
          if (map.knowledge.startsWith('sckan-')) {
            map.knowledge = map.knowledge.slice(6)
          }
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
          map.uuid = map.id
          map.servers = [server.name]
          flatmaps.push(map)
        }
      })
    }
    let index = 1
    flatmaps.forEach(map => {
      if (map.uuid !== '') {
        map.serverList = map.servers.map(server => viewerUrls.has(server)
                                                 ? `<a href="${viewerUrls.get(server)}?id=${map.uuid}" title="View map" target="_blank">${server}</a>`
                                                 : server)
                                    .join(', ')
      } else {
        map.serverList = map.servers.join(', ')
      }
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
  style="height: calc(100vh - 210px)")
//  @row-select="selectionInfo = $event"
//.mt4.title4 Selection info:
//  pre {{ selectionInfo }}
</template>
