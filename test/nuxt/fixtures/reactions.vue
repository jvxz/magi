<script lang="ts" setup>
import type { MatrixEvent, Room } from 'matrix-js-sdk'

import { provideEventListItemContext } from '~/components/room/event/generic.vue'
import { provideRoomInstanceContext } from '~/components/room/instance.vue'

const props = defineProps<{ event: MatrixEvent; room: Room }>()

const room = toRef(props, 'room')
const space = useCurrentSpace()
provideRoomInstanceContext({
  ...useRoomInput(room),
  ...useRoomMembersTyping(room),
  react: useRoomActions(room).react,
  room,
  space,
})

provideEventListItemContext({
  ...useRoomEventReactions(room, () => props.event),
  event: toRef(props, 'event'),
  eventMember: useRoomMember(
    () => props.room,
    () => props.event.getSender(),
  ),
  eventProfile: useUserProfile(() => props.event?.getSender() ?? ''),
  eventState: ref(),
  eventUserId: computed(() => props.event.getSender()),
  grouped: ref(false),
})
</script>

<template>
  <UTooltipProvider>
    <RoomEventListProviders>
      <RoomEventMessage v-if="event && room" />
    </RoomEventListProviders>
  </UTooltipProvider>
</template>
