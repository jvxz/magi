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
      :data="roomMembers.members"
      ref="list"
      class="p-1"
    >
      <PageRoomMembersListHeader
        v-if="'type' in item && item.type === 'header'"
        :title="item.title"
        :total="roomMembers.groupTotals[item.title]"
      />

      <PageRoomMembersListCard
        v-else
        :key="item.userId"
        :user-id="item.userId"
      />
    </VList>
  </div>
</template>
