<script setup lang="ts">
import type { AvatarImageProps } from 'reka-ui'

export type UAvatarImageProps = AvatarImageProps

const props = defineProps<UAvatarImageProps>()
</script>

<template>
  <AvatarImage v-bind="props" class="h-full w-full object-cover">
    <slot />
  </AvatarImage>
</template>
