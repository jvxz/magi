<script lang="ts" setup>
import type { ScrollAreaScrollbarProps } from 'reka-ui'

const props = defineProps<ScrollAreaScrollbarProps & { class?: string }>()

const delegated = reactiveOmit(props, 'class')
</script>

<template>
  <ScrollAreaScrollbar
    v-bind="delegated"
    :class="
      cn(
        'flex select-none touch-none group',
        'data-[orientation=vertical]:(w-2.5)',
        'data-[orientation=horizontal]:(h-2.5)',
        $props.class,
      )
    "
    data-slot="scroll-area-scrollbar"
  >
    <slot />
  </ScrollAreaScrollbar>
</template>
