<script lang="ts" setup>
import type { ScrollAreaRootProps } from 'reka-ui'

export type UScrollAreaRootProps = ScrollAreaRootProps & { class?: HTMLAttributes['class'] }

const props = defineProps<UScrollAreaRootProps>()

const delegated = reactiveOmit(props, 'class')
</script>

<template>
  <ScrollAreaRoot
    v-bind="delegated"
    :class="cn('relative overflow-hidden h-full flex-1', props.class)"
    data-slot="scroll-area-root"
  >
    <slot />
  </ScrollAreaRoot>
</template>
