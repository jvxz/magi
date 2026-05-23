<script lang="ts" setup>
import type { CompactEmoji } from 'emojibase'
import type { EventType, MatrixEvent } from 'matrix-js-sdk'
import type { PrimitiveProps } from 'reka-ui'
import type { HTMLAttributes } from 'vue'
import { ContextMenuSubContent } from '#components'

const props = withDefaults(
  defineProps<
    PrimitiveProps & {
      class?: HTMLAttributes['class']
      event?: MatrixEvent | undefined
      eventType: EventType | string
      grouped?: boolean
      room: MaybeRoomOrId | undefined
    }
  >(),
  {
    as: 'div',
  },
)

const { openReactionViewer } = useRoomEventReactionsViewer()

const mounted = ref(true)
const { reactions, reactTo } = useRoomEventReactions.provide(
  () => props.room,
  () => props.event,
)

function onEmojiPick(emoji: CompactEmoji) {
  if (props.event) {
    reactTo(emoji.unicode, true)
  }

  mounted.value = false
  nextTick(() => (mounted.value = true))
}
</script>

<template>
  <UContextMenu v-if="mounted" modal>
    <UContextMenuTrigger
      v-bind="$props"
      data-testid="event-root"
      :data-event-id="event?.getId()"
      data-event
      :data-event-type="eventType"
      :class="
        cn(
          'px-6 data-[grouped=false]:mt-4.5 group hover:bg-card-lighter data-[popover-open]:bg-card-lighter shrink-0 data-[grouped=true]:min-h-0',
          $props.class,
        )
      "
      :data-grouped="grouped"
    >
      <slot />
    </UContextMenuTrigger>

    <UContextMenuContent v-if="event" :collision-padding="12">
      <div class="flex items-center justify-around">
        <ContextMenuItem as-child>
          <UButton v-for="i in 4" :key="i" size="icon" variant="ghost" class="grow h-full aspect-square cursor-default">
            🥺
          </UButton>
        </ContextMenuItem>
      </div>
      <UContextMenuSub>
        <UContextMenuSubTrigger> Add reaction </UContextMenuSubTrigger>

        <UEmojiPickerRoot :as="ContextMenuSubContent" @pick="onEmojiPick">
          <UEmojiPickerSearch />
          <ContextMenuItem as-child>
            <UEmojiPickerList />
          </ContextMenuItem>
        </UEmojiPickerRoot>
      </UContextMenuSub>
      <UContextMenuItem :disabled="!reactions || !reactions.size" @select="openReactionViewer(room, event)">
        View reactions
      </UContextMenuItem>
    </UContextMenuContent>
  </UContextMenu>
</template>
