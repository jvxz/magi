<script lang="ts" setup>
import { useForwardPropsEmits } from 'reka-ui'

import type { EmojiPickerRootEmits, EmojiPickerRootProps } from '~/components/emoji-picker/root.vue'

const props = defineProps<EmojiPickerRootProps & { class?: HTMLAttributes['class'] }>()
const emits = defineEmits<EmojiPickerRootEmits>()

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
