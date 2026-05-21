<script lang="ts" setup>
import type { MatrixEvent, Room } from 'matrix-js-sdk'
import type { PopoverContentProps } from 'reka-ui'
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
const replyEventBody = computed(() =>
  isReplyEventRedacted.value ? 'Original message was deleted' : formatReplyPreviewBody(replyEventContent.value?.body),
)
const replyEventProfile = useUserProfile(() => replyEvent.value?.getSender())

const isDecrypting = computed(() => props.event.isBeingDecrypted())

const isJumboEmoji = computed(() => {
  const body = eventBody.value?.trim()
  if (!body) return false

  if (body.replace(EMOJI_RE, '').trim() !== '') return false

  const count = body.match(EMOJI_RE)?.length ?? 0
  return count > 0 && count <= 27
})

const shouldRender = computed(() => {
  const { event } = props
  const content = event.getContent()

  const type = content.msgtype

  const isMsg = type === MsgType.Text || type === 'm.bad.encrypted'
  const isEdit = isEditEvent(event)

  return (isMsg || isDecrypting.value) && !isEdit
})

const contentProps: PopoverContentProps = {
  align: 'start',
  collisionPadding: 12,
  side: 'right',
  sideOffset: 8,
}
</script>

<template>
  <PageRoomEvent
    v-if="shouldRender"
    :event-id="props.event.getId()"
    :event-type="props.event.getType()"
    :grouped
    side="right"
    class="py-0.5 w-full"
  >
    <PageRoomEventMessageRoot class="flex-col gap-px">
      <div v-if="isReplyEvent" class="text-sm flex gap-1.5 items-center relative">
        <Icon name="custom:reply" class="text-muted-foreground shrink-0 h-6 w-12 translate-x-2.5 translate-y-1" />

        <div class="ms-1.5 size-3.5 aspect-square">
          <MatrixAvatar v-if="!isReplyEventRedacted" class="size-full" :user="replyEvent?.getSender()" />
          <Icon v-else class="text-muted-foreground -translate-y-0.5" name="tabler:arrow-back-up" />
        </div>

        <template v-if="!isReplyEventLoading">
          <p v-if="!isReplyEventRedacted" class="text-muted-foreground font-medium">
            {{ replyEventProfile?.displayname }}
          </p>

          <p
            v-if="!isReplyEventRedacted"
            class="max-w-2/3 truncate"
            :class="{
              'italic text-muted-foreground':
                replyEvent?.isDecryptionFailure() || !replyEventBody || isReplyEventRedacted,
            }"
          >
            <Twemojify :text="replyEventBody ?? ''" />
          </p>
        </template>
        <template v-else>
          <USkeleton class="h-4 w-32" />
        </template>
      </div>

      <div class="flex gap-4">
        <PageRoomEventMessageMemberContextMenu as-child>
          <UProfilePopoverTrigger :content-props :user="eventUser" as-child>
            <PageRoomEventMessageAvatar :user="eventUser ?? undefined" :ghost="grouped" />
          </UProfilePopoverTrigger>
        </PageRoomEventMessageMemberContextMenu>

        <PageRoomEventMessageContent>
          <template v-if="!grouped && isDefined(event.getTs())" #header>
            <PageRoomEventMessageMemberContextMenu as-child>
              <UProfilePopoverTrigger :content-props :user="eventUser" as-child>
                <UButton variant="link">
                  {{ eventProfile?.displayname }}
                </UButton>
              </UProfilePopoverTrigger>
            </PageRoomEventMessageMemberContextMenu>

            <PageRoomEventMessageTimestamp :datetime="event.getTs()" />
          </template>

          <RenderMd
            v-if="!isDecrypting"
            inline
            :content="eventBody"
            class="whitespace-pre-wrap"
            :class="{
              'italic text-muted-foreground': event?.isDecryptionFailure() || !eventContent?.body,
              'text-4xl': isJumboEmoji,
            }"
          />
          <p v-else class="italic">Decrypting message...</p>
        </PageRoomEventMessageContent>

        <UContextMenuContent>
          <UContextMenuItem> Edit </UContextMenuItem>
        </UContextMenuContent>
      </div>
    </PageRoomEventMessageRoot>
  </PageRoomEvent>
</template>
