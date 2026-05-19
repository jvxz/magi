<script lang="ts">
import type { EventHookOn, EventHookTrigger } from '@vueuse/core'
import type { CompactEmoji } from 'emojibase'
import type { PrimitiveProps } from 'reka-ui'
import { createContext, useForwardPropsEmits } from 'reka-ui'

type Dir = 'up' | 'down' | 'left' | 'right'

export interface InputMoveEvent {
  dir: Dir
}

export interface GridMoveEvent {
  dir: Dir
  cellIdx: number
}

export const [injectEmojiPickerContext, provideEmojiPickerContext] = createContext<{
  activeEmoji: Ref<CompactEmoji | undefined>
  searchQuery: Ref<string>
  isInputFocused: Ref<boolean>
  onInputMove: EventHookOn<InputMoveEvent>
  triggerInputMove: EventHookTrigger<InputMoveEvent>
  onPick?: (emoji: CompactEmoji) => void
}>('UEmojiPickerRoot')

export interface EmojiPickerRootProps extends PrimitiveProps {
  padding?: number
}

export interface EmojiPickerRootEmits {
  pick: [emoji: CompactEmoji]
}

export function getEmojiKey(emoji: CompactEmoji) {
  return `r-${emoji.hexcode}`
}
</script>

<script lang="ts" setup>
const props = withDefaults(defineProps<EmojiPickerRootProps>(), {
  padding: 0.625,
})
const emits = defineEmits<EmojiPickerRootEmits>()

const inputMoveHook = createEventHook<InputMoveEvent>()

const activeEmoji = shallowRef<CompactEmoji>()
const searchQuery = shallowRef('')

const isInputFocused = shallowRef(false)

const onPick = (emoji: CompactEmoji) => {
  emits('pick', emoji)
}

provideEmojiPickerContext({
  activeEmoji,
  isInputFocused,
  onInputMove: inputMoveHook.on,
  onPick,
  searchQuery,
  triggerInputMove: inputMoveHook.trigger,
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
