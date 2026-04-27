<script lang="ts" setup>
defineProps<{
  currentPage: IPublicRoomsResponse | undefined
  hasError: boolean
}>()
</script>

<template>
  <div class="gap-4 grid grid-cols-4">
    <template v-if="!hasError && currentPage">
      <PageExploreRoom
        v-for="room in currentPage.chunk"
        :key="room.room_id"
        :room="room"
      />
    </template>
    <template v-else-if="!hasError && !currentPage">
      <PageExploreRoom
        v-for="(_, i) in Array.from({ length: 16 })"
        :key="i"
        :room="undefined"
      />
    </template>
  </div>
</template>
