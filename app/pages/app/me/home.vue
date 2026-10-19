<script lang="ts" setup>
definePageMeta({
  layout: 'app',
  name: 'me-home',
})

defineAppLabel({ label: 'Home' })

const { sortedRecentRooms } = useRecentRooms()
const { pinnedRoomEntries } = usePinnedRooms()

const collapsiblesState = useScopedLocalStorage<{ recents: boolean; pinned: boolean }>('homeRoomListCollapsibles', {
  pinned: false,
  recents: true,
})
</script>

<template>
  <LayoutAppSlot name="page-header">
    <LayoutAppPageHeader>
      <div class="flex gap-2 items-center">
        <Icon :name="ICON__HOME" />
        <p>Home</p>
      </div>
    </LayoutAppPageHeader>
  </LayoutAppSlot>

  <UContextMenuRegionRoot name="homeRoom">
    <div class="p-3 flex flex-col *:shrink-0 gap-2 overflow-auto">
      <PageMeRoomList label="Pinned" v-model:model-value="collapsiblesState.pinned" :entries="pinnedRoomEntries" />
      <PageMeRoomList label="Recent" v-model:model-value="collapsiblesState.recents" :entries="sortedRecentRooms" />
    </div>

    <PageMeRoomListContextMenu />
  </UContextMenuRegionRoot>
</template>
