<script setup lang="ts">

  import { computed, getCurrentInstance, inject, onMounted, ref, useTemplateRef } from 'vue'
  import type { Ref } from 'vue'

  import type { WTable } from 'wave-ui/dist/types/components'

  import type {ServerEndpoint} from '@/App.vue'

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

//==============================================================================

  let selectionAnchor: number = -1
  let selectionFocus: number = -1
  const selectedRowIds: Ref<number[]> = ref([])

  const flatmapWTable: WTable = useTemplateRef<WTable>('flatmap-table')

  type Filter = Record<string, boolean>

  // Faster lookup than array.includes(id)
  function makeFilter(idList: string[]|number[]): Filter
  //====================================================
  {
    return idList.reduce((obj: Record<string, boolean>, id) => (obj[id] = true) && obj, {})
  }

  function selectionDownload()
  //==========================
  {
    const destination = 'flatmap-export.json'
    const selectedItems = table.value.items.filter(item => selectedRowIdsFilter.value[item.id])
                                           .map(item => {
                                             const {_uid, id, serverList, ...cleaned} = item
                                             return cleaned
                                           })
    alert(`Downloading ${selectedItems.length} records as "${destination}"...`)
    const a = document.createElement('a')
    a.href = URL.createObjectURL(new Blob([JSON.stringify(selectedItems)], {type: "text/json"}))
    a.download = destination
    a.click()
    selectionReset()
  }

  function selectAll()
  //==================
  {
    selectedRowIds.value = flatmapWTable.value.sortedItems.map((item: FlatmapData) => +item.id)
    selectionAnchor = 0
    selectionFocus = selectedRowIds.value.length - 1
  }

  function selectionReset()
  //=======================
  {
    selectionAnchor = -1
    selectionFocus = -1
    selectedRowIds.value = []
  }

  function selectionIdRange(): Filter
  //=================================
  {
    const startIndex = Math.min(selectionAnchor, selectionFocus)
    const endIndex = Math.max(selectionAnchor, selectionFocus)
    return makeFilter(Array.from({length: (endIndex - startIndex + 1)}, (_, i) => i + startIndex)
                           .map(i => flatmapWTable.value.sortedItems[i].id))
    }

  const selectedRowIdsByUid: Ref<Filter> = computed
  //===============================================
  (
    () => makeFilter(selectedRowIds.value)
  )

  function selectionClick(item: FlatmapData, index: number, event: MouseEvent)
  //==========================================================================
  {
    // The following is based on https://github.com/ibash/better-multiselect
    if (event.metaKey) {
      if (selectedRowIdsByUid.value[item.id] === undefined) {
        selectionAnchor = index
        selectionFocus = index
        selectedRowIds.value.push(item.id)
      } else {
        // anchor/focus move to the next selected element with a larger index, if
        // there isn't one then it moves to the next selected with a smaller
        // index. Finally, if that doesn't exist they reset
        let found = false
        const maxIndex = flatmapWTable.value.sortedItems.length - 1
        for (let i = index + 1; i <= maxIndex; i++) {
          const itemId = flatmapWTable.value.sortedItems[i].id
          if (selectedRowIdsByUid.value[itemId]) {      // search forwards
            selectionAnchor = i
            selectionFocus = i
            found = true
            break
          }
        }
        if (!found) {
          for (let i = index - 1; i >= 0; i--) {      // search backwards
            const itemId = flatmapWTable.value.sortedItems[i].id
            if (selectedRowIdsByUid.value[itemId]) {
              selectionAnchor = i
              selectionFocus = i
              found = true
              break
            }
          }
        }
        if (!found) {  // nothing selected
          selectionAnchor = -1
          selectionFocus = -1
        }
        selectedRowIds.value = selectedRowIds.value.filter(id => (id !== item.id))
      }
    } else if (event.shiftKey) {
      const deletedIds = selectionIdRange()
      selectedRowIds.value = selectedRowIds.value.filter(id => deletedIds[id] === undefined)
      selectionFocus = index
      const newIds = selectionIdRange()
      selectedRowIds.value.push(...Object.keys(newIds).map(id => +id))
      selectedRowIds.value = [...(new Set(selectedRowIds.value)).values()]
    } else {
      selectionAnchor = index
      selectionFocus = index
      selectedRowIds.value = [item.id]
    }
  }

//==============================================================================

const selectedRowIdsFilter: Ref<Filter> = computed
//================================================
(
  () => {
    if (flatmapWTable.value === null) {
      return {}
    }
    const filter = makeFilter(flatmapWTable.value.sortedItems.map((item: FlatmapData) => +item.id))
    return makeFilter(selectedRowIds.value.filter(id => filter[id]))
  }
)

function summarise(idList: string[]): string
//==========================================
{
  // @ts-ignore
  const s = idList.map(a => +a).toSorted((a, b) => +a - +b)
  const l = s.length - 1

  const r: string[] = []
  let n = 0
  let a = s[n]
  r.push(a)
  let b = a + 1
  while (n <= l) {
    if (n < l && b === s[n+1]) {
      b += 1
    } else {
      if (b > (a + 2)) {
        r.push(` - ${b - 1}`)
      } else if (b === (a + 2)) {
        r.push(`, ${b}`)
      }
      if (n < l) {
        r.push(', ')
        a = s[n+1]
        r.push(a)
        b = a + 1
      }
    }
    n += 1
  }
  return r.join('')
}

const filteredSelectedRowText: Ref<string> = computed
//===================================================
(
  () => summarise([...Object.keys(selectedRowIdsFilter.value)])
)

//==============================================================================
</script>

<template lang='pug'>
w-input.mb3(
  v-model="table.keyword"
  placeholder="Enter words to filter by..."
  inner-icon-left="wi-search"
  inner-icon-right="wi-cross"
  @click:inner-icon-right="() => table.keyword = ''")
w-table(
  ref='flatmap-table'
  :headers="table.headers"
  :items="table.items"
  :filter="table.keywordFilter(table.keyword)"
  :mobile-breakpoint="700"
  v-model:sort="table.sort"
  v-model:loading='table.loading'
  fixed-headers
  resizable-columns
  style="height: calc(100vh - 260px)")
  template(#item="{ item, index, select, classes }")
    tr.w-table__row(
      @click="selectionClick(item, index-1, $event)"
      :class="{ 'w-table__row': true, 'w-table__row--selected': selectedRowIdsByUid[item.id] !== undefined }")
      td.w-table__cell(
        v-for="(header, j) in table.headers"
        :key="j"
        :class="{ [`text-${header.align || 'left'}`]: true, 'w-table__cell--sticky': header.sticky }")
        div(v-html="item[header.key] || ''")
div.selected-rows.w-flex
  | Selected rows:
  div.text-bold.ml2 {{ filteredSelectedRowText }}
  .spacer
  w-button.ma1(
    bg-color="info"
    @click="selectionReset") Clear selection
  w-button.ma1(
    bg-color="info"
    @click="selectAll") Select all
  w-button.ma1(
    @click="selectionDownload") Download
</template>

<style>
.selected-rows {
  margin-top: 10px;
}
.w-table__cell {
  word-break: break-word;
  text-overflow: ellipsis;
  hyphens: manual;
}
</style>
