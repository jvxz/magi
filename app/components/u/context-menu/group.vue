<script setup lang="ts">
import type { ContextMenuGroupProps } from 'reka-ui'

export type UContextMenuGroupProps = ContextMenuGroupProps

const props = defineProps<UContextMenuGroupProps>()
</script>

<template>
  <ContextMenuGroup v-bind="props">
    <slot />
  </ContextMenuGroup>
</template>
