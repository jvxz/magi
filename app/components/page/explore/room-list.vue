<script lang="ts" setup>
defineProps<{
  currentPage: IPublicRoomsResponse | undefined
  error: Error | null
}>()
</script>

<template>
  <div
    class="gap-4 grid grid-cols-4"
    :class="{
      'opacity-25': error,
    }"
  >
    <template v-if="!error && currentPage">
      <PageExploreRoom
        v-for="room in currentPage.chunk"
        :key="room.room_id"
        :room="room"
      />
    </template>
    <template v-else-if="error">
      <PageExploreRoom
        v-for="(_, i) in Array.from({ length: PUBLIC_ROOM_PAGINATION_LIMIT })"
        :key="i"
        :room="undefined"
      />
    </template>
    <template v-else-if="!currentPage">
      <PageExploreRoom
        v-for="(_, i) in Array.from({ length: PUBLIC_ROOM_PAGINATION_LIMIT })"
        :key="i"
        :room="undefined"
      />
    </template>
  </div>
</template>
