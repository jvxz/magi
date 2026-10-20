<script lang="ts" setup>
import { useForwardPropsEmits } from 'reka-ui'

import type { EmojiPickerRootEmits, EmojiPickerRootProps } from '~/components/emoji-picker/root.vue'

export type UEmojiPickerRootProps = EmojiPickerRootProps & { class?: HTMLAttributes['class'] }
export type UEmojiPickerRootEmits = EmojiPickerRootEmits

const props = defineProps<UEmojiPickerRootProps>()
const emits = defineEmits<UEmojiPickerRootEmits>()

const delegated = reactiveOmit(props, 'class')
const forwarded = useForwardPropsEmits(delegated, emits)
</script>

<template>
  <EmojiPickerRoot
    v-bind="forwarded"
    :class="
      cn(popoverContentBase(), 'p-0 gap-[calc(var(--emoji-picker-padding)*1.25)] flex-col flex h-96 w-84', props.class)
    "
  >
    <slot />
  </EmojiPickerRoot>
</template>
