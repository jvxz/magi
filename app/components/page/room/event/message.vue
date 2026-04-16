<script lang="ts" setup>
import type { MatrixEvent } from 'matrix-js-sdk'

const props = defineProps<{
  event: MatrixEvent
}>()

const { client } = useMatrixClient()

const member = getMember(client.value, props.event.getSender(), props.event.getRoomId())
const content = props.event.getContent()

const displayName = member?.displayName ?? props.event.getSender()

const isEncrypted = computed(() => {
  if (!props.event.isEncrypted())
    return false

  return props.event.getClearContent() === null
})
</script>

<template>
  <PageRoomEvent
    :event-id="props.event.getId()"
    :event-type="props.event.getType()"
    as-child
  >
    <PageRoomEventMessageRoot>
      <PageRoomEventMessageAvatar :user="member" />
      <PageRoomEventMessageContent>
        <template #header>
          {{ displayName }}
          <NuxtTime
            :datetime="event.getTs()"
            hour="numeric"
            minute="numeric"
            class="text-xs text-muted-foreground"
          />
        </template>
        <PageRoomEventMessageBody :content="content.body" :is-encrypted="isEncrypted" />
      </PageRoomEventMessageContent>
    </PageRoomEventMessageRoot>
  </PageRoomEvent>
</template>
