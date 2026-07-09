<script lang="ts" setup>
const displayMode = useScopedLocalStorage<AsideDisplayMode>('asideDisplayMode', 'all')
provide('displayMode', displayMode)

const rooms = useRooms(
  (room, axes) => {
    switch (displayMode.value) {
      case 'all':
        return isDirect(room, axes) || (isGroup(room, axes) && isOrphan(room, axes))
      case 'direct':
        return isDirect(room, axes)
      case 'loose':
        return isGroup(room, axes) && isOrphan(room, axes) && getRoomParentSpaceIds(room).length > 0
      case 'orphan':
        return isGroup(room, axes) && isOrphan(room, axes) && getRoomParentSpaceIds(room).length === 0
    }
  },
  {
    watch: [displayMode],
  },
)
</script>

<template>
  <UAsideListRoot>
    <UAsideListButton
      class="justify-start items-center flex w-full router-link-active:(bg-selected hover:bg-selected text-foreground)"
      as-child
    >
      <NuxtLink to="/app/me/home">
        <LazyIcon name="tabler:home" class="size-1lh!" />
        <span class="font-medium">Home</span>
      </NuxtLink>
    </UAsideListButton>

    <UAsideListButton
      class="justify-start items-center flex w-full router-link-active:(bg-selected hover:bg-selected text-foreground)"
      as-child
    >
      <NuxtLink to="/app/me/invites">
        <LazyIcon name="tabler:inbox" class="size-1lh!" />
        <span class="font-medium">Invites</span>
      </NuxtLink>
    </UAsideListButton>

    <div class="w-full space-y-2">
      <USeparator class="my-2.5" />

      <PageMeAsideButtonsHeader />
    </div>

    <div class="flex flex-col gap-1 w-full">
      <UContextMenuRegionRoot name="directRoom">
        <PageMeAsideButtonsDirectRoom v-for="room in rooms" :key="room.roomId" :room-id="room.roomId" />

        <PageMeAsideButtonsContextMenuContent />
      </UContextMenuRegionRoot>
    </div>
  </UAsideListRoot>
</template>
