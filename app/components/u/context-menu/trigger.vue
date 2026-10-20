<script lang="ts" setup>
import type { ContextMenuTriggerProps } from 'reka-ui'

import { useForwardProps } from 'reka-ui'

const props = defineProps<ContextMenuTriggerProps>()

const forwarded = useForwardProps(props)
</script>

<template>
  <ContextMenuTrigger v-bind="forwarded" data-slot="context-menu-trigger">
    <slot />
  </ContextMenuTrigger>
</template>
