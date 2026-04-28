<script lang="ts" setup>
const props = defineProps<{
  currentPage: IPublicRoomsResponse | undefined
  error: Error | null
}>()

const isEmpty = computed(() => props.error || !props.currentPage || !props.currentPage.chunk.length)
</script>

<template>
  <div
    class="gap-4 grid grid-cols-4"
    :class="{
      'opacity-25': isEmpty,
    }"
  >
    <template v-if="!error && currentPage?.chunk.length">
      <PageExploreRoom
        v-for="room in currentPage.chunk"
        :key="room.room_id"
        :room="room"
      />
    </template>
    <template v-else-if="isEmpty">
      <PageExploreRoom
        v-for="(_, i) in Array.from({ length: PUBLIC_ROOM_PAGINATION_LIMIT })"
        :key="i"
        :room="undefined"
      />
    </template>
  </div>
</template>
