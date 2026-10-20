<script lang="ts">
import type { VariantProps } from 'tailwind-variants'

export const avatarVariants = tv({
  base: 'inline-flex shrink-0 items-center justify-center overflow-hidden bg-secondary font-normal text-foreground select-none',
  variants: {
    shape: {
      circle: 'rounded-full',
      square: 'rounded-md',
    },
    size: {
      base: 'h-16 w-16 text-2xl',
      lg: 'h-32 w-32 text-5xl',
      sm: 'h-10 w-10 text-xs',
    },
  },
})

export type AvatarVariants = VariantProps<typeof avatarVariants>
</script>

<script setup lang="ts">
import type { HTMLAttributes } from 'vue'

const props = withDefaults(
  defineProps<{
    class?: HTMLAttributes['class']
    size?: AvatarVariants['size']
    shape?: AvatarVariants['shape']
  }>(),
  {
    shape: 'circle',
    size: 'sm',
  },
)
</script>

<template>
  <AvatarRoot :class="cn(avatarVariants({ size, shape }), props.class)">
    <slot />
  </AvatarRoot>
</template>
