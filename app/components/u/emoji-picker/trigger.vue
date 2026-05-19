<script lang="ts" setup>
import type { PopoverTriggerProps } from 'reka-ui'

defineProps<PopoverTriggerProps>()
</script>

<template>
  <PopoverTrigger v-bind="$props">
    <slot />
  </PopoverTrigger>
</template>
