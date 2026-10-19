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
          <Icon :name="ICON__RECENT" />
          <span>Recent rooms</span>
        </h3>
      </UCollapsibleTrigger>

      <UCollapsibleContent as-child>
        <UCardGroupRoot variant="raised">
          <template v-if="!sortedRecentRooms.length">
            <div class="text-sm text-muted-foreground pl-3 flex gap-1 items-center">
              <Icon :name="ICON__EMPTY" />
              <span>You have no recent rooms</span>
            </div>
          </template>

          <div v-else class="flex flex-col gap-2">
            <template v-for="(recentRoom, i) in sortedRecentRooms" :key="recentRoom.key">
              <UCardGroupSeparator v-if="i" />
              <UContextMenuRegionTrigger region="homeRoom" :value="{ room: recentRoom, type: 'recent' }" as-child>
                <PageMeListCard :payload="recentRoom" />
              </UContextMenuRegionTrigger>
            </template>
          </div>
        </UCardGroupRoot>
      </UCollapsibleContent>
    </UCollapsibleRoot>
  </div>
</template>
