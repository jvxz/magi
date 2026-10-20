<script lang="ts" setup>
import type { ContextMenuTriggerProps } from 'reka-ui'

import { useForwardProps } from 'reka-ui'

export type UContextMenuTriggerProps = ContextMenuTriggerProps

const props = defineProps<UContextMenuTriggerProps>()

const forwarded = useForwardProps(props)
</script>

<template>
  <ContextMenuTrigger v-bind="forwarded" data-slot="context-menu-trigger">
    <slot />
  </ContextMenuTrigger>
</template>
