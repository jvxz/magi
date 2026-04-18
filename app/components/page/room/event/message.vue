<script lang="ts" setup>
import type { MatrixEvent, Room } from 'matrix-js-sdk'
import { MsgType } from 'matrix-js-sdk'

const props = defineProps<{
  event: MatrixEvent
  grouped: boolean
  room: Room
}>()

const { data: replyEvent, isLoading: isReplyEventLoading, isReplyEvent } = useRoomReplyEvent(props.event, props.room)

const eventContentBody = useEventContent(props.event, 'body')
const { data: eventProfile } = useUserProfile(() => props.event.getSender())

const replyEventContentBody = useEventContent(replyEvent.value, 'body')
const { data: replyEventProfile } = useUserProfile(() => replyEvent.value?.getSender())

const isDecrypting = computed(() => props.event.isBeingDecrypted())

const shouldRender = computed(() => {
  const { event } = props
  const content = event.getContent()

  const type = content.msgtype

  const isMsg = type === MsgType.Text || type === 'm.bad.encrypted'
  const isEdit = isEditEvent(event)

  return (isMsg || isDecrypting.value) && !isEdit
})
</script>

<template>
  <PageRoomEvent
    v-if="shouldRender"
    :event-id="props.event.getId()"
    :event-type="props.event.getType()"
    :grouped
    class="py-0.5"
  >
    <PageRoomEventMessageRoot class="flex-col gap-px">
      <div v-if="isReplyEvent" class="text-sm flex gap-1.5 items-center relative">
        <Icon name="custom:reply" class="text-muted-foreground shrink-0 h-6 w-12 translate-x-2.5 translate-y-1" />

        <div class="ps-1.5">
          <MatrixAvatar class="size-3.5" :user="replyEvent?.getSender()" />
        </div>

        <template v-if="!isReplyEventLoading">
          <p class="text-muted-foreground font-medium">
            {{ replyEventProfile?.displayname ?? replyEvent?.getSender() }}
          </p>

          <p
            class="max-w-2/3 truncate"
            :class="{ 'italic text-muted-foreground': replyEvent?.isDecryptionFailure() }"
          >
            {{ replyEventContentBody }}
          </p>
        </template>
        <template v-else>
          <USkeleton class="h-4 w-32" />
        </template>
      </div>

      <div class="flex gap-4">
        <PageRoomEventMessageAvatar :user="event.getSender()" />
        <PageRoomEventMessageContent>
          <template v-if="!grouped" #header>
            {{ eventProfile?.displayname }}
            <NuxtTime
              :datetime="event.getTs()"
              hour="numeric"
              minute="numeric"
              class="text-xs text-muted-foreground"
            />
          </template>

          <p v-if="!isDecrypting" :class="{ 'italic text-muted-foreground': event?.isDecryptionFailure() }">
            {{ eventContentBody }}
          </p>
          <p v-else class="italic">
            Decrypting message...
          </p>
        </PageRoomEventMessageContent>
      </div>
    </PageRoomEventMessageRoot>
  </PageRoomEvent>
</template>
