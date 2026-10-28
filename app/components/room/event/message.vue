<script lang="ts" setup>
import { MsgType } from 'matrix-js-sdk'

import { injectEventListItemContext } from './generic.vue'

const { event, grouped, room, eventMember, eventUserId, eventProfile, ...ctx } = injectEventListItemContext()

const { data: replyEvent, isLoading: isReplyEventLoading, isReplyEvent } = useRoomReplyEvent(event.value, room.value)

const { content: eventContent, state: eventState } = useEventContent(event)
syncRef(eventState, ctx.eventState, { direction: 'ltr' })

const messageType = computed(() => eventContent.value?.msgtype)

const { content: replyEventContent, isRedacted: isReplyEventRedacted } = useEventContent(() => replyEvent.value)
const replyEventBody = computed(() =>
  isReplyEventRedacted.value ? 'Original message was deleted' : formatReplyPreviewBody(replyEventContent.value?.body),
)
const replySenderId = computed(() => replyEvent.value?.getSender())
const replyEventProfile = useUserProfile(replySenderId)

const shouldRender = computed(() => {
  const isValid = [MsgType.Text, MsgType.Image, 'm.bad.encrypted'].includes(messageType.value as MsgType)
  const isEdit = isEditEvent(event.value)

  return (isValid || eventState.value === 'decrypting') && !isEdit
})
</script>

<template>
  <RoomEvent v-if="shouldRender" :event-type="event.getType()" side="right" class="py-0.5 w-full">
    <RoomEventMessageRoot class="flex flex-col gap-px">
      <div v-if="isReplyEvent" class="text-sm flex gap-1.5 items-center relative">
        <Icon
          :name="ICON__REPLY_CONNECTOR"
          class="text-muted-foreground shrink-0 h-6 w-12 translate-x-2.5 translate-y-1"
        />

        <div class="ms-1.5 size-3.5 aspect-square">
          <MatrixRoomMemberAvatar
            v-if="!isReplyEventRedacted && replySenderId"
            class="size-full"
            :room
            :member="replySenderId"
          />
          <Icon v-else class="text-muted-foreground -translate-y-0.5" :name="ICON__REPLY" />
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
        <UContextMenuRegionTrigger region="member" :value="{ member: eventMember, roomId: room.roomId }" as-child>
          <UProfilePopoverTrigger
            v-if="eventUserId"
            :content-props="{ align: 'start', collisionPadding: 12, side: 'right', sideOffset: 8 }"
            :user="eventUserId"
            as-child
          >
            <RoomEventMessageAvatar :room :member="eventUserId" :ghost="grouped" />
          </UProfilePopoverTrigger>
        </UContextMenuRegionTrigger>

        <RoomEventMessageContent>
          <template v-if="!grouped && isDefined(event.getTs()) && eventUserId" #header>
            <UContextMenuRegionTrigger region="member" :value="{ member: eventMember, roomId: room.roomId }" as-child>
              <UProfilePopoverTrigger
                :content-props="{ align: 'start', collisionPadding: 12, side: 'right', sideOffset: 8 }"
                :user="eventUserId"
                as-child
              >
                <UButton
                  variant="link"
                  class="data-popover-open:underline! context-menu-open:underline data-[state=open]:no-underline"
                >
                  {{ eventProfile.displayname }}
                </UButton>
              </UProfilePopoverTrigger>
            </UContextMenuRegionTrigger>

            <RoomEventMessageTimestamp :datetime="event.getTs()" />
          </template>

          <RoomEventMessageImage v-if="messageType === MsgType.Image" />
          <RoomEventMessageText />
        </RoomEventMessageContent>
      </div>
    </RoomEventMessageRoot>
  </RoomEvent>
</template>
