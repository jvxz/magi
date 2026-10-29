<script lang="ts" setup>
import { KnownMembership } from 'matrix-js-sdk'

const props = defineProps<{ room: MaybeRoomOrId | undefined }>()

const matrixStatus = useMatrixStatus()
const roomId = useResolveRoomId(() => props.room)
const room = useRoom(() => props.room)
const { self } = useSelf()
const membership = useRoomMembership(roomId, () => self.value?.userId)

const route = useRoute()
const isOnRoomPage = computed(() => route.name === 'space-room' || route.name === 'direct-room')
</script>

<template>
  <LayoutAppSlot v-if="isOnRoomPage" name="page-header">
    <LayoutAppPageHeader>
      <MatrixRoomAvatar v-if="room" square class="rounded-sm size-1.5em" :do-placeholder="false" :room />

      <span v-if="room">{{ resolveRoomName(room) }}</span>
      <USkeleton v-else class="rounded-sm h-1em w-24" />
    </LayoutAppPageHeader>
  </LayoutAppSlot>

  <RoomInstancePreview v-if="matrixStatus.isDataSynced && roomId && membership !== KnownMembership.Join" :room-id />

  <template v-else-if="room">
    <div v-if="membership === KnownMembership.Join" class="flex flex-1 size-full">
      <div class="flex flex-col size-full relative">
        <KeepAlive :max="5">
          <RoomEventList :key="room.roomId" :room />
        </KeepAlive>
        <RoomInput />
      </div>

      <RoomMembersList :room />
      <RoomEventReactionsViewer />
    </div>

    <div v-else>your not joined</div>
  </template>
</template>
