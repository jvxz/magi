<script lang="ts" setup>
const rooms = useRooms('space')
</script>

<template>
  <aside class="shrink-0 w-20 top-0 sticky">
    <LayoutAppAsideDms />
    <USeparator class="mx-auto mb-[2px] w-1/2!" />
    <div class="py-2.5 flex flex-col gap-2.5 items-center">
      <template v-if="rooms">
        <LayoutAppAsideRoom
          v-for="room in rooms"
          :key="room.roomId"
          :room
        />
      </template>
      <LayoutAppAsidePublicRooms />
    </div>
  </aside>
</template>
