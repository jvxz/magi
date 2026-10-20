<script setup lang="ts">
import type { ContextMenuSubTriggerProps } from 'reka-ui'

import { useForwardProps } from 'reka-ui'

const props = defineProps<ContextMenuSubTriggerProps & { class?: HTMLAttributes['class']; inset?: boolean }>()

const delegated = reactiveOmit(props, 'class')

const forwarded = useForwardProps(delegated)
</script>

<template>
  <ContextMenuSubTrigger v-bind="forwarded" :class="cn(popoverItemBase(), props.class)">
    <slot />
    <Icon :name="ICON__CHEVRON_RIGHT" class="ml-auto !size-4" />
  </ContextMenuSubTrigger>
</template>
