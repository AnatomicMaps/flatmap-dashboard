<script setup lang="ts">
  import { ref } from 'vue'

  type TableHeader = {
    key: string
    label: string
  }[]
  type Item = Record<string, string|number>
  type Table = {
    headers: TableHeader
    items: Item[]
    sort?: string
    keyword: string
    keywordFilter: (keyword: string) => (item: Item) => boolean
  }

  async function getMapTable(mapHeaders: TableHeader): Promise<Table>
  {
    const result = await fetch("http://localhost:8000")
    const maps: Item[] = await result.json()
    let index = 1
    const flatmapTable: Table = {
      headers: mapHeaders,
      items: [],
      sort: `+${mapHeaders[0].key}`,
      keyword: '',
      keywordFilter: (keyword: string) => {
        return (item: Item) => {
          // Concatenate all the columns into a single string for a faster lookup.
          const allColumns = mapHeaders.map(hdr => item[hdr.key]).join(' ')
          // Lookup the keyword variable in the string with case-insensitive flag.
          return new RegExp(keyword, 'i').test(allColumns)
        }
      }
    }
    maps.forEach(map => {
      flatmapTable.items.push(Object.assign({biologicalSex: ''}, map, {id: index}))
      index += 1
    })
    return flatmapTable
  }

  const mapHeaders = [
    { label: 'Name', key: 'name' },
    { label: 'Describes', key: 'describes' },
    { label: 'Taxon', key: 'taxon' },
    { label: 'Biological Sex', key: 'biologicalSex' },
    { label: 'Created', key: 'created' },
  ]

  const tableData = await getMapTable(mapHeaders)
  const table = ref(tableData)

  const selectionInfo = ref()
</script>

<template lang='pug'>
w-input.mb3(
  v-model="table.keyword"
  placeholder="Search..."
  inner-icon-left="wi-search")
w-table(
  :headers="table.headers"
  :items="table.items"
  :filter="table.keywordFilter(table.keyword)"
  :selectable-rows="1"
  :mobile-breakpoint="700"
  v-model:sort="table.sort"
  @row-select="selectionInfo = $event"
  fixed-headers
  resizable-columns
  style="height: 250px")

//.mt4.title4 Selection info:
//pre {{ selectionInfo }}
</template>
