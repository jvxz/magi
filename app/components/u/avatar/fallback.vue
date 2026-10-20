<script setup lang="ts">
import type { AvatarFallbackProps } from 'reka-ui'

export type UAvatarFallbackProps = AvatarFallbackProps

const props = defineProps<UAvatarFallbackProps>()
</script>

<template>
  <AvatarFallback v-bind="props">
    <slot />
  </AvatarFallback>
</template>
