<script lang="ts" setup>
import type { SeparatorProps } from 'reka-ui'

export type UShowcaseSeparatorProps = SeparatorProps

defineProps<UShowcaseSeparatorProps>()
</script>

<template>
  <USeparator v-bind="$props">
    <slot />
  </USeparator>
</template>
