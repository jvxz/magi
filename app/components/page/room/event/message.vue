<script lang="ts" setup>
import type { MatrixEvent } from 'matrix-js-sdk'
import { EventType } from 'matrix-js-sdk'

const props = defineProps<{
  content: MatrixEvent
}>()

assert(props.content.getType() === EventType.RoomMessage, 'Event provided in PageRoomEventMessage is not a RoomMessage event')

const { client } = useMatrixClient()

const member = getMember(client.value, props.content.getSender(), props.content.getRoomId())
const content = props.content.getContent()

const displayName = member?.displayName ?? props.content.getSender()
</script>

<template>
  <PageRoomEvent data-event-type="message" class="flex gap-4 select-text">
    <MatrixAvatar
      :user="member"
      :size="32"
      class="mt-1 shrink-0 size-10"
    />

    <div class="flex flex-1 flex-col">
      <p class="font-medium space-x-2">
        <span class="text-sm">{{ displayName }}</span>
        <NuxtTime
          :datetime="props.content.getTs()"
          hour="numeric"
          minute="numeric"

          class="text-xs text-muted-foreground"
        />
      </p>
      <p class="">
        {{ content.body }}
      </p>
    </div>
  </PageRoomEvent>
</template>
