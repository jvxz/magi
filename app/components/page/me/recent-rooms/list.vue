<script lang="ts" setup>
const { sortedRecentRooms } = useRecentRooms()

const collapsiblesState = useHomeRoomListCollapsibles()
</script>

<template>
  <div class="flex flex-col gap-2.5">
    <UCollapsibleRoot v-model:open="collapsiblesState.recents">
      <UCollapsibleTrigger class="gap-2">
        <UCollapsibleTriggerIcon />

        <h3 class="font-medium flex items-center gap-2">
          <Icon name="tabler:clock" />
          <span>Recent rooms</span>
        </h3>
      </UCollapsibleTrigger>

      <UCollapsibleContent>
        <div class="flex flex-col gap-2">
          <UContextMenuRegionTrigger
            v-for="recentRoom in sortedRecentRooms"
            :key="recentRoom.key"
            region="homeRoom"
            :value="{ roomId: recentRoom.key, spaceId: recentRoom.parentSpaceId, type: 'recent' }"
            as-child
          >
            <PageMeListCard :room-id="recentRoom.key" :space-id="recentRoom.parentSpaceId" />
          </UContextMenuRegionTrigger>
        </div>
      </UCollapsibleContent>
    </UCollapsibleRoot>
  </div>
</template>
