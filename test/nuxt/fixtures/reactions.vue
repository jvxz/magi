<script lang="ts" setup>
import type { MatrixEvent, Room } from 'matrix-js-sdk'

import { provideEventListItemContext } from '~/components/room/event/generic.vue'
import { provideRoomInstanceContext } from '~/components/room/instance.vue'

const props = defineProps<{ event: MatrixEvent; room: Room }>()

provideRoomInstanceContext({ room: toRef(props, 'room') })

provideEventListItemContext({
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
