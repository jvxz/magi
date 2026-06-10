<script lang="ts" setup>
import type { PopoverContentProps } from 'reka-ui'

import { MsgType } from 'matrix-js-sdk'

import { injectEventContext } from './generic.vue'

const { room, event, grouped } = injectEventContext()

const { content: eventContent } = useEventContent(event)
const eventBody = computed(() => trimReplyFromBody(eventContent.value?.body))
const eventProfile = useUserProfile(() => (grouped.value ? undefined : event.value.getSender()))
const eventUser = useUser<true>(() => event.value.getSender())

const hasReactions = useRoomEventHasReactions(room, event)

const isDecrypting = computed(() => event.value.isBeingDecrypted())

const isJumboEmoji = computed(() => {
  const body = eventBody.value?.trim()
  if (!body) return false

  if (body.replace(EMOJI_RE, '').trim() !== '') return false

  const count = body.match(EMOJI_RE)?.length ?? 0
  return count > 0 && count <= 27
})

const shouldRender = computed(() => {
  const content = event.value.getContent()

  const type = content.msgtype

  const isMsg = type === MsgType.Text || type === 'm.bad.encrypted'
  const isEdit = isEditEvent(event.value)

  return (isMsg || isDecrypting.value) && !isEdit
})

const contentProps: PopoverContentProps = {
  align: 'start',
  collisionPadding: 12,
  side: 'right',
  sideOffset: 8,
}

const { openProfilePopover } = useProfilePopover()
function openProfile(e: MouseEvent) {
  const el = e.currentTarget
  if (!(el instanceof HTMLElement) || !eventUser.value) return

  openProfilePopover(el, eventUser.value.userId, contentProps)
}
</script>

<template>
  <PageRoomEvent
    v-if="shouldRender"
    :room="room"
    :event="event"
    :event-id="event.getId()"
    :event-type="event.getType()"
    :grouped
    side="right"
    class="py-0.5 w-full"
  >
    <PageRoomEventMessageRoot class="flex flex-col gap-px">
      <PageRoomEventMessageReply v-if="checkReplyEvent(event)" />

      <div class="flex gap-4">
        <PageRoomEventMessageAvatar
          :user="eventUser"
          :ghost="grouped"
          :data-profile-user="eventUser?.userId"
          @click="openProfile"
        />
        <div>
          <PageRoomEventMessageContent>
            <template v-if="!grouped && isDefined(event.getTs())" #header>
              <UButton
                variant="link"
                class="data-[state=open]:no-underline data-[popover-open]:underline!"
                :data-profile-user="eventUser?.userId"
                @click="openProfile"
              >
                {{ eventProfile?.displayname }}
              </UButton>

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

          <PageRoomEventMessageReactions v-if="hasReactions" v-memo="[hasReactions]" />
        </div>
      </div>
    </PageRoomEventMessageRoot>
  </PageRoomEvent>
</template>
