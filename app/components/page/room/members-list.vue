<script lang="ts" setup>
import { VList } from 'virtua/vue'

const currentRoom = useCurrentRoom()

const { isLoaded, members } = useRoomMembers(currentRoom)
const membersGrouped = useRoomMemberGrouping(members, () => currentRoom.value?.roomId)

const listRef = useTemplateRef('list')
watch(() => currentRoom.value?.roomId, () => listRef.value?.scrollTo(0))
</script>

<template>
  <div class="border-l border-border shrink-0 h-full w-72">
    <VList
      v-if="membersGrouped && isLoaded"
      :key="currentRoom?.roomId"
      v-slot="{ item }"
      ref="list"
      :item-size="40"
      :data="membersGrouped.members"
      class="px-2 py-1"
      @vue:mounted="console.log"
    >
      <PageRoomMembersListHeader
        v-if="'type' in item && item.type === 'header'"
        :key="item.title"
        :title="item.title"
        :total="membersGrouped.groupTotals[item.title]"
      />

      <PageRoomMembersListCard
        v-else
        :key="item.userId"
        :is-owner="item.powerLevel >= 100"
        :user-id="item.userId"
      />
    </VList>

    <div v-else class="p-2 h-full relative">
      <!-- <div class="size-full inset-0 absolute z-1 from-transparent to-card to-80% bg-gradient-to-b" /> -->

      <!-- <div class="h-10" /> -->
      <USkeleton
        v-for="item in 8"
        :key="item"
        class="mb-3 h-10 w-full"
      />
    </div>
  </div>
</template>
