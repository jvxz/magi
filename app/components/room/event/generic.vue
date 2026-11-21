<script lang="ts">
import type { MatrixEvent } from 'matrix-js-sdk'

import { injectRoomInstanceContext } from '../instance.vue'

export const [injectEventListItemContext, provideEventListItemContext] = createContext<
  {
    event: Ref<MatrixEvent>
    grouped: Ref<boolean>
    eventMember: ReturnType<typeof useRoomMember>
    eventProfile: ReturnType<typeof useUserProfile>
    eventUserId: Ref<string | undefined>
    eventState: Ref<EventState | undefined>
  } & ReturnType<typeof useRoomEventReactions>
>('RoomEventGeneric')
</script>

<script lang="ts" setup>
import { EventType } from 'matrix-js-sdk'

const props = defineProps<{
  event: MatrixEvent
  grouped: boolean
  dateDiffed: boolean
}>()

const { room } = injectRoomInstanceContext()
const reactions = useRoomEventReactions(room, () => props.event)
const eventUserId = computed(() => props.event.getSender())
const eventProfile = useUserProfile(eventUserId)
const eventMember = useRoomMember(room, eventUserId)

provideEventListItemContext({
  ...reactions,
  event: toRef(props, 'event'),
  eventMember,
  eventProfile,
  eventState: ref(),
  eventUserId,
  grouped: toRef(props, 'grouped'),
})

const type = computed(() => props.event.getType())
</script>

<template>
  <RoomEventDateSeparator v-if="dateDiffed" />

  <RoomEventMessage v-if="type === EventType.RoomMessage || type === EventType.RoomMessageEncrypted" />
  <RoomEventMember v-else-if="type === EventType.RoomMember" />
</template>
