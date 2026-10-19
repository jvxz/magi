<script lang="ts" setup>
definePageMeta({
  layout: 'app',
  name: 'me-home',
})

defineAppLabel({ label: 'Home' })

const matrixStatus = useMatrixStatus()
const { sortedRecentRooms } = useRecentRooms()
const { pinnedRoomEntries } = usePinnedRooms()

const sortedRecentRoomsCachedCount = useCachedCount(
  'sortedRecentRooms',
  () => (matrixStatus.value.isDataSynced ? sortedRecentRooms.value.length : undefined),
  4,
)
const pinnedRoomEntriesCachedCount = useCachedCount(
  'pinnedRoomEntries',
  () => (matrixStatus.value.isDataSynced ? pinnedRoomEntries.value.length : undefined),
  2,
)

const collapsiblesState = useLocalStorage<{ recents: boolean; pinned: boolean }>('homeRoomListCollapsibles', {
  pinned: true,
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

  <UContextMenuRegionRoot name="homeRoom" class="shrink-0">
    <div class="p-3 flex flex-col gap-2 overflow-y-auto">
      <PageMeRoomList
        v-model:model-value="collapsiblesState.pinned"
        :cached-count="pinnedRoomEntriesCachedCount"
        label="Pinned"
        :entries="pinnedRoomEntries"
      />
      <PageMeRoomList
        v-model:model-value="collapsiblesState.recents"
        :cached-count="sortedRecentRoomsCachedCount"
        label="Recent"
        :entries="sortedRecentRooms"
      />
    </div>

    <PageMeRoomListContextMenu />
  </UContextMenuRegionRoot>
</template>
