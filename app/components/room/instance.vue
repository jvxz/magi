<script lang="ts">
import type { Room } from 'matrix-js-sdk'

export interface RoomInstanceContext extends ReturnType<typeof useRoomInput>, ReturnType<typeof useRoomMembersTyping> {
  room: Readonly<Ref<Room>>
  space: Readonly<Ref<Room | undefined>>
  react: ReturnType<typeof useRoomActions>['react']
}

export const [injectRoomInstanceContext, provideRoomInstanceContext] =
  createContext<RoomInstanceContext>('RoomInstance')
</script>

<script lang="ts" setup>
const props = defineProps<{ room: Room }>()

const route = useRoute()
const isOnRoomPage = computed(() => route.name === 'space-room' || route.name === 'direct-room')

const room = toRef(props, 'room')
const space = useCurrentSpace()

const roomInput = useRoomInput(room, space)
const roomMembersTyping = useRoomMembersTyping(room)
const { react } = useRoomActions(room)

provideRoomInstanceContext({
  ...roomInput,
  ...roomMembersTyping,
  react,
  room,
  space,
})
</script>

<template>
  <LayoutAppSlot v-if="isOnRoomPage" name="page-header">
    <LayoutAppPageHeader>
      <MatrixRoomAvatar square class="rounded-sm size-1.5em" :room />

      <span>{{ resolveRoomName(props.room) }}</span>
    </LayoutAppPageHeader>
  </LayoutAppSlot>

  <div class="flex flex-1 size-full">
    <div class="flex flex-col size-full relative">
      <KeepAlive :max="5">
        <RoomEventList :key="room.roomId" />
      </KeepAlive>

      <RoomInput />
    </div>

    <RoomMembersList :room />
    <RoomEventReactionsViewer />
  </div>
</template>
