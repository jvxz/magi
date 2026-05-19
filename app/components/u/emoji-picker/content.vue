<script lang="ts" setup>
import type { PopoverContentEmits, PopoverContentProps } from 'reka-ui'
import type { EmojiPickerRootEmits } from '~/components/emoji-picker/root.vue'
import { useForwardPropsEmits } from 'reka-ui'
import { PopoverContent } from '#components'

const props = defineProps<Omit<PopoverContentProps, 'as' | 'asChild'>>()
const emits = defineEmits<PopoverContentEmits & EmojiPickerRootEmits>()

const forwarded = useForwardPropsEmits(props, emits)
</script>

<template>
  <PopoverContent v-bind="forwarded" as-child>
    <!-- as-child merges emits from EmojiPickerRoot -->
    <EmojiPickerRoot
      :class="
        cn(
          popoverContentBase(),
          'p-0 gap-[calc(var(--emoji-picker-padding)*1.25)] flex-col flex size-full h-96 w-84',
          $attrs.class,
        )
      "
    >
      <slot />
    </EmojiPickerRoot>
  </PopoverContent>
</template>
