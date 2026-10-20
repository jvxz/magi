<script lang="ts" setup>
import type { ScrollAreaViewportProps } from 'reka-ui'

export type UScrollAreaViewportProps = ScrollAreaViewportProps & { class?: HTMLAttributes['class'] }

const props = defineProps<UScrollAreaViewportProps>()

const delegated = reactiveOmit(props, 'class')
</script>

<template>
  <ScrollAreaViewport v-bind="delegated" :class="cn('size-full', props.class)" data-slot="scroll-area-viewport">
    <slot />
  </ScrollAreaViewport>
</template>
