<script setup lang="ts">
  import { ref } from 'vue'

  const title = 'Flatmaps'

</script>

<template lang='pug'>
  w-card.light-blue-light5--bg(tile)
    template(#title)
      w-toolbar
        .title2.ml2.text-light {{title}}

  w-card
    w-table(
      :headers="table.headers"
      :items="table.items"
      fixed-headers
      style="height: 250px")

</template>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 0;
}
</style>

<script lang="ts">
export default {
  data: () => ({
    table: {
      headers: [
        { label: 'ID', key: 'id' },
        { label: 'First name', key: 'firstName' },
        { label: 'Last name', key: 'lastName' }
      ],
      items: [
        { id: 1, firstName: 'Floretta', lastName: 'Sampson' },
        { id: 2, firstName: 'Nellie', lastName: 'Lynn' },
        { id: 3, firstName: 'Rory', lastName: 'Bristol' },
        { id: 4, firstName: 'Daley', lastName: 'Elliott' },
        { id: 5, firstName: 'Virgil', lastName: 'Carman' },
        { id: 6, firstName: 'Baldwin', lastName: 'Morison' },
        { id: 7, firstName: 'Beckah', lastName: 'Mann' },
        { id: 8, firstName: 'Davie', lastName: 'Forester' },
        { id: 9, firstName: 'Andi', lastName: 'Montgomery' },
        { id: 10, firstName: 'Magnolia', lastName: 'Kirk' },
        { id: 11, firstName: 'Hamilton', lastName: 'Mallory' },
        { id: 12, firstName: 'Sheree', lastName: 'Castle' },
        { id: 13, firstName: 'Rebekah', lastName: 'Eason' },
        { id: 14, firstName: 'Maude', lastName: 'Hayley' },
        { id: 15, firstName: 'Josie', lastName: 'Richard' }
      ]
    }
  })
}
</script>
