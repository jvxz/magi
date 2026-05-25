<script lang="ts" setup>
import type { EmojiPickerRootEmits, EmojiPickerRootProps } from '~/components/emoji-picker/root.vue'
import { useForwardPropsEmits } from 'reka-ui'

const props = defineProps<EmojiPickerRootProps>()
const emits = defineEmits<EmojiPickerRootEmits>()

const forwarded = useForwardPropsEmits(props, emits)
</script>

<template>
  <EmojiPickerRoot
    v-bind="forwarded"
    :class="
      cn(popoverContentBase(), 'p-0 gap-[calc(var(--emoji-picker-padding)*1.25)] flex-col flex h-96 w-84', $attrs.class)
    "
  >
    <slot />
  </EmojiPickerRoot>
</template>
