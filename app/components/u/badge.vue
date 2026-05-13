<script setup lang="ts">
import type { PrimitiveProps } from 'reka-ui'

defineProps<Props>()

interface Props extends PrimitiveProps {
  size?: BadgeVariants['size']
  variant?: BadgeVariants['variant']
}
</script>

<template>
  <Primitive :class="cn(badgeVariants({ size, variant }), $attrs.class)">
    <slot />
  </Primitive>
</template>
