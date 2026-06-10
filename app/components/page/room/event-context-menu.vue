<script lang="ts" setup>
import type { CompactEmoji } from 'emojibase'
import type { MatrixEvent } from 'matrix-js-sdk'

import { ContextMenuSubContent } from '#components'

const props = defineProps<{
  room: MaybeRoomOrId | undefined
  events: MatrixEvent[]
}>()

const open = ref(false)
const mode = shallowRef<'member' | 'react'>('react')
const targetEvent = shallowRef<MatrixEvent>()
let targetEl: HTMLElement | undefined

const { openReactionViewer } = useRoomEventReactionsViewer()
const { reactions, reactTo } = useRoomEventReactions.provide(
  () => props.room,
  () => targetEvent.value,
)

const { sortedRecentReactions } = useRecentReactions()
const firstFourRecentReactions = computed(() => sortedRecentReactions.value.slice(0, 4))

const isReactable = computed(() => {
  const event = targetEvent.value
  return !!event && REACTABLE_EVENT_TYPES.includes(event.getType())
})

function resolveTarget(e: Event) {
  const node = e.target as HTMLElement | null
  const userEl = node?.closest<HTMLElement>('[data-profile-user]') ?? undefined
  const rowEl = node?.closest<HTMLElement>('[data-item-id]') ?? undefined

  if (targetEl && targetEl !== rowEl) delete targetEl.dataset.contextActive
  targetEl = rowEl

  if (userEl) {
    mode.value = 'member'
    targetEvent.value = undefined
    return
  }

  mode.value = 'react'
  const id = rowEl?.dataset.itemId
  targetEvent.value = id ? props.events.find(ev => ev.getId() === id) : undefined

  if (e.type === 'contextmenu' && !isReactable.value) e.preventDefault()
}

watch(open, isOpen => {
  if (isOpen) targetEl?.setAttribute('data-context-active', '')
  else if (targetEl) delete targetEl.dataset.contextActive
})

function onEmojiPick(emoji: CompactEmoji) {
  if (targetEvent.value) reactTo(emoji.unicode, true)
  open.value = false
}
</script>

<template>
  <UContextMenu v-model:open="open" modal>
    <UContextMenuTrigger
      as="div"
      class="contents"
      @contextmenu.capture="resolveTarget"
      @pointerdown.capture="resolveTarget"
    >
      <slot />
    </UContextMenuTrigger>

    <UContextMenuContent v-if="mode === 'member'" :collision-padding="12">
      <UContextMenuItem> Mention </UContextMenuItem>
      <UContextMenuItem> Message </UContextMenuItem>
      <UContextMenuSeparator />
      <UContextMenuItem> View avatar </UContextMenuItem>
    </UContextMenuContent>

    <UContextMenuContent v-else-if="isReactable && targetEvent" :collision-padding="12">
      <div class="flex items-center justify-around">
        <ContextMenuItem v-for="(reaction, i) in firstFourRecentReactions" :key="i" as-child>
          <UButton
            size="icon"
            variant="ghost"
            class="grow h-full aspect-square cursor-default"
            @click="
              () => {
                reactTo(reaction.key)
                open = false
              }
            "
          >
            <Twemojify class="text-6" :text="reaction.key" />
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
      <UContextMenuItem :disabled="!reactions || !reactions.size" @select="openReactionViewer(room, targetEvent)">
        View reactions
      </UContextMenuItem>
    </UContextMenuContent>
  </UContextMenu>
</template>
