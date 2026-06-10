<script lang="ts" setup>
import { injectEventContext } from '../generic.vue'

const { event, room } = injectEventContext()
const { data: replyEvent, isLoading } = useRoomReplyEvent(event.value, room.value)

const { content: replyEventContent, isRedacted: isReplyEventRedacted } = useEventContent(() => replyEvent.value)
const replyEventBody = computed(() =>
  isReplyEventRedacted.value ? 'Original message was deleted' : formatReplyPreviewBody(replyEventContent.value?.body),
)
const replyEventProfile = useUserProfile(() => replyEvent.value?.getSender())
</script>

<template>
  <div class="text-sm flex gap-1.5 items-center relative">
    <Icon name="custom:reply" class="text-muted-foreground shrink-0 h-6 w-12 translate-x-2.5 translate-y-1" />

    <div class="ms-1.5 size-3.5 aspect-square">
      <MatrixAvatar v-if="!isReplyEventRedacted" class="size-full" :user="replyEvent?.getSender()" />
      <Icon v-else class="text-muted-foreground -translate-y-0.5" name="tabler:arrow-back-up" />
    </div>

    <template v-if="!isLoading">
      <p v-if="!isReplyEventRedacted" class="text-muted-foreground font-medium">
        {{ replyEventProfile?.displayname }}
      </p>

      <p
        v-if="!isReplyEventRedacted"
        class="max-w-2/3 truncate"
        :class="{
          'italic text-muted-foreground': replyEvent?.isDecryptionFailure() || !replyEventBody || isReplyEventRedacted,
        }"
      >
        <RenderMd :content="replyEventBody" />
      </p>
    </template>
    <template v-else>
      <USkeleton class="h-4 w-32" />
    </template>
  </div>
</template>
