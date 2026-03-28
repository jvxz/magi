<script lang="ts" setup>
definePageMeta({
  layout: 'room',
  middleware: ({ params }) => {
    if (('roomId' in params) && !params.roomId) {
      return navigateTo({
        name: 'me',
      })
    }
  },
  name: 'room',
})

const route = useRoute()
</script>

<template>
  <pre>{{ route.params.roomId }}</pre>
</template>
