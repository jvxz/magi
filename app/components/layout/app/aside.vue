<script lang="ts" setup>
const rooms = useRooms('space')
</script>

<template>
  <aside class="shrink-0 w-20 top-0 sticky isolate">
    <LayoutAppAsideHome />

    <USeparator class="mx-auto mb-[2px] w-1/2!" />
    <div class="py-2.5 flex flex-col gap-2.5 items-center">
      <template v-if="rooms">
        <LazyLayoutAppAsideRoom v-for="room in rooms" :key="room.roomId" :room />
      </template>
      <LayoutAppAsidePublicRooms />
    </div>

    <div
      aria-hidden="true"
      class="pointer-events-none duration-100 flex items-center absolute position-anchor-active w-full anchor-top anchor-bottom ease-snappy z-1"
    >
      <div class="w-1 rounded-r bg-foreground h-3/4"></div>
    </div>
  </aside>
</template>
