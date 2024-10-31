<script setup lang="ts">
  import { ref } from 'vue'

  const showDrawer = ref(false)
  const showThankYou = ref(false)

  const title = 'Overview'

</script>

<template lang='pug'>
  w-card.light-blue-light5--bg(tile)
    template(#title)
      w-toolbar
        .title2.ml2.text-light {{title}}
  w-card
    p Testing
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
}

</script>
