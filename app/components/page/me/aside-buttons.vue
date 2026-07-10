<script lang="ts" setup>
const route = useRoute()
const toggleValue = shallowRef('home')
const toggle = computed({
  // fallback to "recent rooms" button if no param is present
  get: () =>
    'directRoomId' in route.params ? route.params.directRoomId : route.name === 'invites' ? 'invites' : 'home',
  set: (v: string) => (toggleValue.value = v),
})

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
  <UAsideListRoot as-child>
    <UToggleGroupRoot v-model:model-value="toggle">
      <UToggleGroupItem value="home" class="flex w-full items-center" as-child>
        <NuxtLink to="/app/me/home">
          <LazyIcon name="tabler:home" class="size-1lh!" />
          <span class="font-medium">Home</span>
        </NuxtLink>
      </UToggleGroupItem>
      <UToggleGroupItem value="invites" class="flex w-full items-center" as-child>
        <NuxtLink to="/app/me/invites">
          <LazyIcon name="tabler:inbox" class="size-1lh!" />
          <span class="font-medium">Invites</span>
        </NuxtLink>
      </UToggleGroupItem>

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
    </UToggleGroupRoot>
  </UAsideListRoot>
</template>
