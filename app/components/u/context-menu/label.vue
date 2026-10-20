<script setup lang="ts">
import type { ContextMenuLabelProps } from 'reka-ui'

import { reactiveOmit } from '@vueuse/core'

const props = defineProps<ContextMenuLabelProps & { class?: HTMLAttributes['class']; inset?: boolean }>()

const delegated = reactiveOmit(props, 'class')
</script>

<template>
  <ContextMenuLabel
    v-bind="delegated"
    :class="cn(`px-2 py-1.5 text-sm text-foreground data-[inset]:pl-8`, inset && 'pl-8', props.class)"
  >
    <slot />
  </ContextMenuLabel>
</template>
