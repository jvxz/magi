<script lang="ts" setup>
import { VList } from 'virtua/vue'

const currentRoom = useCurrentRoom()
const roomMembers = useRoomMembers(currentRoom)

const listRef = useTemplateRef('list')
watch(() => currentRoom.value?.roomId, () => listRef.value?.scrollTo(0))
</script>

<template>
  <div class="border-l border-border shrink-0 h-full w-72">
    <VList
      v-if="roomMembers"
      v-slot="{ item }"
      ref="list"
      :data="roomMembers.members"
      class="p-1"
    >
      <PageRoomMembersListHeader
        v-if="'type' in item && item.type === 'header'"
        :key="item.title"
        :title="item.title"
        :total="roomMembers.groupTotals[item.title]"
      />

      <PageRoomMembersListCard
        v-else
        :key="item.userId"
        :is-owner="item.powerLevel >= 100"
        :user-id="item.userId"
      />
    </VList>

    <div v-else class="p-1.5 h-full relative">
      <!-- <div class="size-full inset-0 absolute z-1 from-transparent to-card to-80% bg-gradient-to-b" /> -->

      <div class="h-10" />
      <div
        v-for="item in 32"
        :key="item"
        class="mb-1.5 rounded bg-muted/25 h-10 w-full"
      />
    </div>
  </div>
</template>
