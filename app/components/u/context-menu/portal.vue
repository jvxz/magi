<script setup lang="ts">
import type { ContextMenuPortalProps } from 'reka-ui'

export type UContextMenuPortalProps = ContextMenuPortalProps

const props = defineProps<UContextMenuPortalProps>()
</script>

<template>
  <ContextMenuPortal v-bind="props">
    <slot />
  </ContextMenuPortal>
</template>
