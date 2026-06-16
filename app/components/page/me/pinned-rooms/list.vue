<script lang="ts" setup>
const { pinnedRoomEntries } = usePinnedRooms()

const collapsiblesState = useHomeRoomListCollapsibles()
</script>

<template>
  <div class="flex flex-col gap-2.5">
    <UCollapsibleRoot v-model:open="collapsiblesState.pinned">
      <UCollapsibleTrigger class="gap-2">
        <UCollapsibleTriggerIcon />

        <h3 class="font-medium flex gap-2 items-center">
          <Icon name="tabler:pin" />
          <span>Pinned rooms</span>
        </h3>
      </UCollapsibleTrigger>

      <UCollapsibleContent>
        <template v-if="!pinnedRoomEntries.length">
          <div class="text-sm text-muted-foreground pl-3 flex gap-1 items-center">
            <Icon name="tabler:ghost-3" />
            <span>You have no pinned rooms</span>
          </div>
        </template>

        <div v-else class="flex flex-col gap-2">
          <UContextMenuRegionTrigger
            v-for="pinnedRoom in pinnedRoomEntries"
            :key="pinnedRoom.key"
            region="homeRoom"
            :value="{ roomId: pinnedRoom.key, spaceId: pinnedRoom.spaceId, type: 'pinned' }"
            as-child
          >
            <PageMeListCard :room-id="pinnedRoom.key" :space-id="pinnedRoom.spaceId" />
          </UContextMenuRegionTrigger>
        </div>
      </UCollapsibleContent>
    </UCollapsibleRoot>
  </div>
</template>
