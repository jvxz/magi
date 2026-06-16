<script lang="ts" setup>
const { isRoomPinned, pinRoom, unpinRoom } = usePinnedRooms()
const { blacklistRoom, removeRecentRoom } = useRecentRooms()
const { payload } = useContextMenuRegion('homeRoom')

const isPinned = computed(() => (payload.value?.roomId ? isRoomPinned(payload.value?.roomId) : false))

function handlePin() {
  if (!payload.value) return

  if (!isPinned.value) {
    pinRoom(payload.value.roomId, payload.value.spaceId)
  } else unpinRoom(payload.value.roomId)
}
</script>

<template>
  <UContextMenuRegionContent v-if="payload?.roomId" name="homeRoom" align="start">
    <UContextMenuItem as-child>
      <NuxtLink
        :to="{
          name: 'space-room',
          params: {
            roomId: payload.roomId,
            spaceId: payload.spaceId,
          },
        }"
      >
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

      <UContextMenuItem @select="removeRecentRoom(payload.roomId)">
        <Icon name="tabler:trash" />
        <span>Remove from recents</span>
      </UContextMenuItem>
      <UContextMenuItem @select="blacklistRoom(payload.roomId)">
        <Icon name="tabler:circle-x" />
        <span>Never show in recents</span>
      </UContextMenuItem>
    </template>
  </UContextMenuRegionContent>
</template>
