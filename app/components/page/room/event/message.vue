<script lang="ts" setup>
import type { MatrixEvent, Room } from 'matrix-js-sdk'
import { MsgType } from 'matrix-js-sdk'

const props = defineProps<{
  event: MatrixEvent
  grouped: boolean
  room: Room
}>()

const { data: replyEvent, isLoading: isReplyEventLoading, isReplyEvent } = useRoomReplyEvent(props.event, props.room)

const { content: eventContent } = useEventContent(() => props.event)
const eventBody = computed(() => trimReplyFromBody(eventContent.value?.body))
const eventProfile = useUserProfile(() => props.event.getSender())
const eventUser = useUser<true>(() => props.event.getSender())

const { content: replyEventContent, isRedacted: isReplyEventRedacted } = useEventContent(() => replyEvent.value)
const replyEventBody = computed(() => isReplyEventRedacted.value ? 'Original message was deleted' : formatReplyPreviewBody(replyEventContent.value?.body))
const replyEventProfile = useUserProfile(() => replyEvent.value?.getSender())

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
    side="right"
    class="py-0.5"
  >
    <PageRoomEventMessageRoot class="flex-col gap-px">
      <div v-if="isReplyEvent" class="text-sm flex gap-1.5 items-center relative">
        <Icon name="custom:reply" class="text-muted-foreground shrink-0 h-6 w-12 translate-x-2.5 translate-y-1" />

        <div class="ms-1.5 size-3.5 aspect-square">
          <MatrixAvatar
            v-if="!isReplyEventRedacted"
            class="size-full"
            :user="replyEvent?.getSender()"
          />
          <Icon
            v-else
            class="text-muted-foreground -translate-y-0.5"
            name="tabler:arrow-back-up"
          />
        </div>

        <template v-if="!isReplyEventLoading">
          <p v-if="!isReplyEventRedacted" class="text-muted-foreground font-medium">
            {{ replyEventProfile?.displayname }}
          </p>

          <p
            v-if="!isReplyEventRedacted"
            class="max-w-2/3 truncate"
            :class="{ 'italic text-muted-foreground': replyEvent?.isDecryptionFailure() || !replyEventBody || isReplyEventRedacted }"
          >
            {{ replyEventBody }}
          </p>
        </template>
        <template v-else>
          <USkeleton class="h-4 w-32" />
        </template>
      </div>

      <div class="flex gap-4">
        <UProfilePopoverTrigger :user="eventUser" as-child>
          <PageRoomEventMessageAvatar :user="eventUser ?? undefined" :ghost="grouped" />
        </UProfilePopoverTrigger>

        <PageRoomEventMessageContent>
          <template v-if="!grouped && isDefined(event.getTs())" #header>
            <UProfilePopoverTrigger :user="eventUser" as-child>
              <span :class="cn(interactiveStyles.base, interactiveStyles.variant.link, 'text-sm')">{{ eventProfile?.displayname }}</span>
            </UProfilePopoverTrigger>
            <NuxtTime
              :datetime="event.getTs()"
              hour="numeric"
              minute="numeric"
              class="text-xs text-muted-foreground"
            />
          </template>

          <RenderMd
            v-if="!isDecrypting"
            :content="eventBody"
            :class="{ 'italic text-muted-foreground': event?.isDecryptionFailure() || !eventContent?.body }"
          />
          <p v-else class="italic">
            Decrypting message...
          </p>
        </PageRoomEventMessageContent>
      </div>
    </PageRoomEventMessageRoot>
  </PageRoomEvent>
</template>
