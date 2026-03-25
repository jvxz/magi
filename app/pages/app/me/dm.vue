<script lang="ts" setup>
definePageMeta({
  middleware: ({ query }) => {
    if (!query.u) {
      return navigateTo({
        name: 'me',
      })
    }
  },
  name: 'dm',
})
</script>

<template>
  <p>{{ $route.query.u }}</p>
</template>
