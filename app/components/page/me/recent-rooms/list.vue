<script lang="ts" setup>
const { sortedRecentRooms } = useRecentRooms()

const collapsiblesState = useHomeRoomListCollapsibles()
</script>

<template>
  <div class="flex flex-col gap-2.5">
    <UCollapsibleRoot v-model:open="collapsiblesState.recents">
      <UCollapsibleTrigger class="gap-2">
        <UCollapsibleTriggerIcon />

        <h3 class="font-medium flex gap-2 items-center">
          <Icon name="tabler:clock" />
          <span>Recent rooms</span>
        </h3>
      </UCollapsibleTrigger>

      <UCollapsibleContent>
        <template v-if="!sortedRecentRooms.length">
          <div class="text-sm text-muted-foreground pl-3 flex gap-1 items-center">
            <Icon name="tabler:ghost-3" />
            <span>You have no recent rooms</span>
          </div>
        </template>

        <div v-else class="flex flex-col gap-2">
          <UContextMenuRegionTrigger
            v-for="recentRoom in sortedRecentRooms"
            :key="recentRoom.key"
            region="homeRoom"
            :value="{ room: recentRoom, type: 'recent' }"
            as-child
          >
            <PageMeListCard :payload="recentRoom" />
          </UContextMenuRegionTrigger>
        </div>
      </UCollapsibleContent>
    </UCollapsibleRoot>
  </div>
</template>
