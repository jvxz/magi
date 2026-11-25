<script lang="ts">
import type { EventHookOn, EventHookTrigger } from '@vueuse/core'
import type { CompactEmoji } from 'emojibase'
import type { PrimitiveProps } from 'reka-ui'

import { useForwardPropsEmits } from 'reka-ui'

type Dir = 'up' | 'down' | 'left' | 'right'

export interface InputMoveEvent {
  dir: Dir
}

interface PickerEmojiBase {
  key: string
  label: string
  terms: string
}

export type PickerEmoji =
  | (PickerEmojiBase & { type: 'unicode'; emoji: CompactEmoji })
  | (PickerEmojiBase & { type: 'custom'; packId: string; shortcode: string; image: ImagePackImage })

export function fromCompactEmoji(emoji: CompactEmoji): PickerEmoji {
  return {
    emoji,
    key: emoji.hexcode,
    label: emoji.label,
    terms: [emoji.label, ...(emoji.tags ?? [])].join(' '),
    type: 'unicode',
  }
}

export function fromImagePackImage(packId: string, shortcode: string, image: ImagePackImage): PickerEmoji {
  return {
    image,
    key: `${packId}/${shortcode}`,
    label: shortcode,
    packId,
    shortcode,
    terms: image.body ? `${shortcode} ${image.body}` : shortcode,
    type: 'custom',
  }
}

export function getEmojiNodeAttrs(emoji: PickerEmoji): EmojiNodeAttrs {
  if (emoji.type === 'unicode') {
    return { hexcode: emoji.emoji.hexcode, label: emoji.emoji.label, unicode: emoji.emoji.unicode }
  }

  return { label: emoji.image.body ?? null, shortcode: emoji.shortcode, url: emoji.image.url }
}

export function fromImagePack(pack: ImagePack): PickerEmoji[] {
  return objectEntries(pack.images).map(([shortcode, image]) => fromImagePackImage(pack.id, shortcode, image))
}

export interface EmojiPickerContext {
  activeEmoji: Ref<PickerEmoji | undefined>
  searchQuery: Ref<string>
  isInputFocused: Ref<boolean>
  scopeId: string
  gridId: string
  onInputMove: EventHookOn<InputMoveEvent>
  triggerInputMove: EventHookTrigger<InputMoveEvent>
  onPick?: (emoji: PickerEmoji) => void
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
  pick: [emoji: PickerEmoji]
}

export function getEmojiKey(scopeId: string, emoji: PickerEmoji) {
  return `${scopeId}-${emoji.key}`
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

const activeEmoji = shallowRef<PickerEmoji>()
const searchQuery = shallowRef('')
const scopeId = useId()
const gridId = `${scopeId}-grid`

const isInputFocused = shallowRef(false)

const onPick = (emoji: PickerEmoji) => {
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
