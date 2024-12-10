<script setup lang="ts">

  import { ref } from 'vue'

  import type {ServerEndpoint} from '../App.vue'

//==============================================================================

  type TableHeader = {
    key: string
    label: string
    sortable?: boolean
    width?: string|number
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
    serverList: string
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
    { label: 'Id', key: 'id' },
    { label: 'Name', key: 'name',  width: 160 },
    { label: 'Describes', key: 'describes', width: 150  },
    { label: 'Taxon', key: 'taxon', width: 140 },
    { label: 'Biological Sex', key: 'biologicalSex' },
    { label: 'Created', key: 'created', width: 220 },
    { label: 'Release', key: 'git-description', width: 100},
    { label: 'Mapmaker', key: 'creator' },
    { label: 'SCKAN', key: 'knowledge' },
    { label: 'Servers', key: 'serverList', sortable: false },
    { label: 'UUID', key: 'uuid', width: 200 },
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
      servers: [''],
      serverList: ''
  }

  const flatmapTable: FlatmapTable = {
    headers: tableHeaders,
    items: [],
    sort: '',
    keyword: '',
    keywordFilter: (keyword: string) => {
      const keywords = keyword.split(' ').filter(k => (k !== ''))
      return (item: FlatmapData) => {
        // Concatenate all the columns into a single string for a faster lookup.
        const allColumns = tableHeaders.map(hdr => item[hdr.key]).join(' ')
        // Lookup the keyword variable in the string with case-insensitive flag.
        return keywords.every(keyword => new RegExp(keyword, 'i').test(allColumns))
      }
    },
    loading: true
  }

  const table = ref(flatmapTable)

//==============================================================================

  async function loadMapData(serverEndpoints: ServerEndpoint[]): Promise<null>
  {
    const flatmapData: FlatmapData[] = []
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
            flatmapData.push(map)
          }
        } else {
          map.uuid = map.id
          map.servers = [server.name]
          flatmapData.push(map)
        }
      })
    }

    let index = 1
    flatmapData.forEach(map => {
      map.id = index
      index += 1
    })

    flatmapData.forEach(map => {
      if (map.uuid !== '') {
        map.serverList = map.servers.map(server => viewerUrls.has(server)
                                                 ? `<a href="${viewerUrls.get(server)}?id=${map.uuid}" title="View map" target="_blank">${server}</a>`
                                                 : server)
                                    .join(', ')
      } else {
        map.serverList = map.servers.join(', ')
      }
    })

    table.value.items = flatmapData
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

<style>
.w-table__cell {
  word-break: break-word;
  text-overflow: ellipsis;
  hyphens: manual;
}
</style>
