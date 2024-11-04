<script setup lang="ts">
  const title = 'Overview'
</script>

<template lang='pug'>
w-card.light-blue-light5--bg(tile)
  template(#title)
    w-toolbar
      .title2.ml2.text-light {{title}}
  p Testing
</template>
