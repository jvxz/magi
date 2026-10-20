<script lang="ts">
import type { VariantProps } from 'tailwind-variants'

export const badgeVariants = tv({
  base: 'inline-flex  shrink-0 cursor-default items-center justify-center tracking-wide select-none',
  defaultVariants: {
    size: 'default',
    variant: 'default',
  },
  extend: interactiveBase,
  variants: {
    size: {
      default: 'px-2 h-fit py-0.5 text-xs',
      lg: 'px-2.5 py-1 h-fit text-sm',
      sm: 'px-1.5 py-px h-fit text-2xs rounded-md',
    },
  },
})

export type BadgeVariants = VariantProps<typeof badgeVariants>
</script>

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
