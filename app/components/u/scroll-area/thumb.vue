<script lang="ts" setup>
import type { ScrollAreaThumbProps } from 'reka-ui'

export type UScrollAreaThumbProps = ScrollAreaThumbProps & { class?: HTMLAttributes['class'] }

const props = defineProps<UScrollAreaThumbProps>()

const delegated = reactiveOmit(props, 'class')
</script>

<template>
  <ScrollAreaThumb
    v-bind="delegated"
    :class="
      cn(
        'flex-1 bg-border-strong rounded-full m-0.4 relative',
        'before:(content-empty absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 size-full min-h-44px min-w-44px)',
        props.class,
      )
    "
    data-slot="scroll-area-thumb"
  >
    <slot />
  </ScrollAreaThumb>
</template>
