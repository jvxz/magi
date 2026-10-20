<script lang="ts" setup>
import type { RouteLocationRaw } from 'vue-router'

const { payload } = useContextMenuRegion('homeRoom')

const { isRoomPinned, pinRoom, unpinRoom } = usePinnedRooms()
const { blacklistRoom, removeRecentRoom } = useRecentRooms()

const isPinned = computed(() => (payload.value ? isRoomPinned(payload.value.room.roomId) : false))

const handlePin = () => (payload.value ? (!isPinned.value ? pinRoom : unpinRoom)(payload.value?.room) : noop)

const to = computed<RouteLocationRaw | undefined>(() =>
  payload.value
    ? payload.value?.room.kind === 'direct'
      ? {
          name: 'direct-room',
          params: {
            directRoomId: payload.value?.room.roomId,
          },
        }
      : {
          name: 'space-room',
          params: {
            roomId: payload.value?.room.roomId,
            spaceId: payload.value?.room.spaceId,
          },
        }
    : undefined,
)
</script>

<template>
  <UContextMenuRegionContent v-if="payload" name="homeRoom" align="start">
    <UContextMenuItem as-child>
      <NuxtLink :to>
        <Icon :name="ICON__OPEN_ROOM" />
        <span>Go to room</span>
      </NuxtLink>
    </UContextMenuItem>
    <UContextMenuItem @select="handlePin">
      <Icon :name="isPinned ? ICON__UNPIN : ICON__PIN" />
      <span>{{ isPinned ? 'Unpin' : 'Pin' }} room</span>
    </UContextMenuItem>

    <template v-if="payload.type === 'recent'">
      <UContextMenuSeparator />
      <UContextMenuItem @select="removeRecentRoom(payload.room.roomId)">
        <Icon :name="ICON__DELETE" />
        <span>Remove from recents</span>
      </UContextMenuItem>
      <UContextMenuItem @select="blacklistRoom(payload.room.roomId)">
        <Icon :name="ICON__BLOCK" />
        <span>Never show in recents</span>
      </UContextMenuItem>
    </template>
  </UContextMenuRegionContent>
</template>
