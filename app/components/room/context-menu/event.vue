<script lang="ts" setup>
import { ContextMenuSubContent } from '#components'

const props = defineProps<ContextMenuRegions['event']>()

const { openDialog } = useGlobalDialog()

const { close } = useContextMenuRegion('event')
const { self } = useSelf()

const { reactions, reactTo } = useRoomEventReactions(
  () => props.room,
  () => props.event,
)

function onEmojiPick(emoji: Emoji) {
  if (props.event) {
    if (emoji.type === 'unicode') reactTo(emoji.unicode, true)
    else reactTo(emoji.url, true, emoji.shortcode)
  }

  close()
}

const recentReactions = useRoomRecentReactions(() => [props.room.roomId])
const firstFourRecentReactions = computed(() => recentReactions.value.slice(0, 4))

const { canRedactOwnMessages, canRedactMessages } = useRoomMemberPermissions(
  () => props.room,
  () => self.value?.userId,
)

const canRedact = computed(() =>
  props.event.getSender() === self.value?.userId ? canRedactOwnMessages.value : canRedactMessages.value,
)

const { current } = useMagicKeys()
const { redact } = useRoomActions(
  () => props.room,
  () => props.event.getId(),
)
const handleDeleteMessage = () => {
  if (current.has('shift')) redact.mutate({ reason: undefined })
  else openDialog('deleteMessage', { eventId: props.event.getId()!, roomId: props.room.roomId })
}

// lazy, only calculates if node structure item is selected
const { messageNodes } = useMessageBodyNodes(props.event)
</script>

<template>
  <template v-if="event && MATRIX__REACTABLE_EVENT_TYPES.includes(event.getType())">
    <div class="flex items-center justify-around">
      <ContextMenuItem v-for="emoji in firstFourRecentReactions" :key="emoji.key" as-child>
        <UButton
          :title="resolveEmojiReadableName(emoji)"
          size="icon"
          variant="ghost"
          class="grow h-full aspect-square cursor-default"
          @click="onEmojiPick(emoji)"
        >
          <UEmoji v-if="emoji.type === 'unicode'" class="text-4" :unicode="emoji.unicode" />
          <UEmoji v-else class="text-4" :url="emoji.url" :alt="emoji.shortcode" />
        </UButton>
      </ContextMenuItem>
    </div>
    <UContextMenuSub>
      <UContextMenuSubTrigger> Add reaction </UContextMenuSubTrigger>

      <UEmojiPickerRoot :as="ContextMenuSubContent" :room-ids="[room.roomId]" :space-ids="[]" @pick="onEmojiPick">
        <UEmojiPickerSearch />
        <ContextMenuItem as-child>
          <UEmojiPickerList />
        </ContextMenuItem>
      </UEmojiPickerRoot>
    </UContextMenuSub>
    <UContextMenuItem
      :disabled="!reactions || !reactions.size"
      @select="openDialog('reactionsViewer', { event, room })"
    >
      View reactions
    </UContextMenuItem>

    <UContextMenuItem v-if="canRedact" variant="danger" @select="handleDeleteMessage">
      Delete message
    </UContextMenuItem>

    <template v-if="$settings.value.advanced.developerMode">
      <UContextMenuSeparator />

      <UContextMenuItem
        @select="openDialog('codeViewer', { lang: 'json', code: JSON.stringify(props.event, null, 2) })"
      >
        View source
      </UContextMenuItem>

      <UContextMenuItem
        @select="openDialog('codeViewer', { lang: 'json', code: JSON.stringify(messageNodes, null, 2) })"
      >
        View node structure
      </UContextMenuItem>
    </template>
  </template>
</template>
