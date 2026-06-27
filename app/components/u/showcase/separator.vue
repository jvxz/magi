<script lang="ts" setup>
import type { SeparatorProps } from 'reka-ui'

defineProps<SeparatorProps>()
</script>

<template>
  <USeparator v-bind="$props">
    <slot />
  </USeparator>
</template>
