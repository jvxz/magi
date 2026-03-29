<script lang="ts" setup>
definePageMeta({
  layout: 'app',
  middleware: ({ params }) => {
    if (('directRoomId' in params) && !params.directRoomId) {
      return navigateTo({
        name: 'me',
      })
    }
  },
  name: 'direct-room',
})

const route = useRoute()
</script>

<template>
  <pre>{{ route.params.directRoomId }}</pre>
</template>
