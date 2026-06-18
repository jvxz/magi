<script lang="ts" setup>
import type { RouteLocationRaw } from 'vue-router'

const { isRoomPinned, pinRoom, unpinRoom } = usePinnedRooms()
const { blacklistRoom, removeRecentRoom } = useRecentRooms()
const { payload } = useContextMenuRegion('homeRoom')

const isPinned = computed(() => (payload.value?.room.roomId ? isRoomPinned(payload.value?.room.roomId) : false))

function handlePin() {
  if (!payload.value) return

  ;(!isPinned.value ? pinRoom : unpinRoom)(payload.value.room)
}

const to = computed<RouteLocationRaw | undefined>(() => {
  if (payload.value)
    return payload.value?.room.kind === 'direct'
      ? {
          name: 'direct-room',
          params: {
            directRoomId: payload.value.room.roomId,
          },
        }
      : {
          name: 'space-room',
          params: {
            roomId: payload.value.room.roomId,
            spaceId: payload.value.room.spaceId,
          },
        }
})
</script>

<template>
  <UContextMenuRegionContent v-if="payload?.room.roomId" name="homeRoom" align="start">
    <UContextMenuItem as-child>
      <NuxtLink :to>
        <Icon name="tabler:door-enter" />
        <span>Go to room</span>
      </NuxtLink>
    </UContextMenuItem>
    <UContextMenuItem @select="handlePin">
      <Icon :name="isPinned ? 'tabler:pinned-off' : 'tabler:pin'" />
      <span>{{ isPinned ? 'Unpin' : 'Pin' }} room</span>
    </UContextMenuItem>

    <template v-if="payload.type === 'recent'">
      <UContextMenuSeparator />

      <UContextMenuItem @select="removeRecentRoom(payload.room.roomId)">
        <Icon name="tabler:trash" />
        <span>Remove from recents</span>
      </UContextMenuItem>
      <UContextMenuItem @select="blacklistRoom(payload.room.roomId)">
        <Icon name="tabler:circle-x" />
        <span>Never show in recents</span>
      </UContextMenuItem>
    </template>
  </UContextMenuRegionContent>
</template>
