<script lang="ts">
import type { EventHookOn, EventHookTrigger } from '@vueuse/core'
import type { CompactEmoji } from 'emojibase'
import type { PrimitiveProps } from 'reka-ui'

import { useForwardPropsEmits } from 'reka-ui'

type Dir = 'up' | 'down' | 'left' | 'right'

export interface InputMoveEvent {
  dir: Dir
}

export function getEmojiNodeAttrs(emoji: Emoji): EmojiNodeAttrs {
  if (emoji.type === 'unicode') {
    return { hexcode: emoji.hexcode, label: emoji.label, unicode: emoji.unicode }
  }

  return { label: emoji.body ?? null, shortcode: emoji.shortcode, url: emoji.url }
}

export interface EmojiPickerContext {
  activeEmoji: Ref<Emoji | undefined>
  searchQuery: Ref<string>
  isInputFocused: Ref<boolean>
  scopeId: string
  gridId: string
  onInputMove: EventHookOn<InputMoveEvent>
  triggerInputMove: EventHookTrigger<InputMoveEvent>
  onPick?: (emoji: Emoji) => void
  userEmojis: Ref<boolean>
  userRoomPacks: Ref<boolean>
  roomIds: Ref<string[]>
  spaceIds: Ref<string[]>
}

export const [injectEmojiPickerContext, provideEmojiPickerContext] =
  createContext<EmojiPickerContext>('EmojiPickerRoot')

export interface EmojiPickerRootProps extends PrimitiveProps {
  padding?: number
  userEmojis?: boolean
  userRoomPacks?: boolean
  roomIds?: string[]
  spaceIds?: string[]
}

export interface EmojiPickerRootEmits {
  pick: [emoji: Emoji]
}
</script>

<script lang="ts" setup>
const props = withDefaults(defineProps<EmojiPickerRootProps>(), {
  padding: 0.625,
  userEmojis: true,
  userRoomPacks: true,
})
const emits = defineEmits<EmojiPickerRootEmits>()

const inputMoveHook = createEventHook<InputMoveEvent>()

const activeEmoji = shallowRef<Emoji>()
const searchQuery = shallowRef('')
const scopeId = useId()
const gridId = `${scopeId}-grid`

const isInputFocused = shallowRef(false)

const onPick = (emoji: Emoji) => {
  emits('pick', emoji)
}

provideEmojiPickerContext({
  activeEmoji,
  gridId,
  isInputFocused,
  onInputMove: inputMoveHook.on,
  onPick,
  roomIds: toRef(() => props.roomIds ?? []),
  scopeId,
  searchQuery,
  spaceIds: toRef(() => props.spaceIds ?? []),
  triggerInputMove: inputMoveHook.trigger,
  userEmojis: toRef(props, 'userEmojis'),
  userRoomPacks: toRef(props, 'userRoomPacks'),
})

const forwarded = useForwardPropsEmits(props, emits)
</script>

<template>
  <Primitive
    v-bind="forwarded"
    :style="{
      '--emoji-picker-padding': `${padding}rem`,
    }"
  >
    <slot />
  </Primitive>
</template>
