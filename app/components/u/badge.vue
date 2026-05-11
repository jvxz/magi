<script setup lang="ts">
import type { VariantProps } from 'class-variance-authority'

defineProps<Props>()

interface BadgeVariantProps extends VariantProps<typeof badgeVariants> {}

interface Props {
  size?: BadgeVariantProps['size']
  variant?: BadgeVariantProps['variant']
}
</script>

<template>
  <div :class="cn(badgeVariants({ size, variant }), $attrs.class ?? '')">
    <slot />
  </div>
</template>
