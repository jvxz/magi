<script lang="ts" setup>
import type { ContextMenuTriggerProps } from 'reka-ui'

defineProps<ContextMenuTriggerProps>()
</script>

<template>
  <UContextMenu>
    <UContextMenuTrigger v-bind="$props">
      <slot />
    </UContextMenuTrigger>
    <UContextMenuContent>
      <UContextMenuItem> Mention </UContextMenuItem>
      <UContextMenuItem> Message </UContextMenuItem>
      <UContextMenuSeparator />
      <UContextMenuItem> View avatar </UContextMenuItem>
    </UContextMenuContent>
  </UContextMenu>
</template>
