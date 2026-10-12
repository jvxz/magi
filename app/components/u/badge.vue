<script setup lang="ts">
import type { PrimitiveProps } from 'reka-ui'
import type { HTMLAttributes } from 'vue'

export interface UBadgeProps extends PrimitiveProps {
  size?: BadgeVariants['size']
  variant?: BadgeVariants['variant']
  class?: HTMLAttributes['class']
}

const props = defineProps<UBadgeProps>()
</script>

<template>
  <Primitive :class="cn(badgeVariants({ size, variant }), props.class)">
    <slot />
  </Primitive>
</template>
